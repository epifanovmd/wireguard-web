import { zodResolver } from "@hookform/resolvers/zod";
import { useHotkeys } from "@mantine/hooks";
import { formatISO, parseISO } from "date-fns";
import { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import {
  IWgPeerCreateRequestDto,
  IWgPeerUpdateRequestDto,
  IWgServerOptionDto,
  WgPeerDto,
} from "~@api/api-gen/data-contracts";
import {
  Button,
  DatePickerFormField,
  InputFormField,
  SelectFormField,
  SwitchFormField,
  TextareaFormField,
} from "~@components/ui";

import { useServersSelectOptions } from "../../hooks";

const schema = z.object({
  serverId: z.string().optional(),
  name: z.string().min(1, "Название обязательно"),
  description: z.string().optional().or(z.literal("")),
  presharedKey: z.boolean(),
  persistentKeepalive: z.coerce.number().optional().nullable(),
  dns: z.string().optional().or(z.literal("")),
  mtu: z.coerce.number().optional().nullable(),
  clientAllowedIPs: z.string().optional().or(z.literal("")),
  expiresAt: z.date().optional(),
  enabled: z.boolean(),
});

const createSchema = schema.extend({
  serverId: z.string().min(1, "Выберите сервер"),
});

export type PeerFormData = z.infer<typeof schema>;

interface PeerFormProps {
  defaultValues?: Partial<WgPeerDto>;
  initialServerId?: string;
  isEdit?: boolean;
  loading?: boolean;
  onSubmit: (
    data: IWgPeerCreateRequestDto | IWgPeerUpdateRequestDto,
    serverId?: string,
  ) => Promise<void>;
  onCancel: () => void;
}

export const PeerForm: FC<PeerFormProps> = ({
  defaultValues,
  initialServerId,
  isEdit,
  loading,
  onSubmit,
  onCancel,
}) => {
  const serversOptions = useServersSelectOptions();

  const methods = useForm<PeerFormData>({
    resolver: zodResolver(isEdit ? schema : createSchema),
    defaultValues: {
      serverId: initialServerId ?? "",
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      presharedKey: defaultValues?.hasPresharedKey ?? false,
      persistentKeepalive: defaultValues?.persistentKeepalive ?? 25,
      dns: defaultValues?.dns ?? "",
      mtu: defaultValues?.mtu ?? null,
      clientAllowedIPs: defaultValues?.clientAllowedIPs ?? "0.0.0.0/0, ::/0",
      expiresAt: defaultValues?.expiresAt
        ? parseISO(defaultValues.expiresAt)
        : undefined,
      enabled: defaultValues?.enabled ?? true,
    },
  });

  const { handleSubmit } = methods;

  const handleFormSubmit = async (data: PeerFormData) => {
    const payload = {
      name: data.name,
      enabled: data.enabled,
      ...(data.presharedKey && { presharedKey: true as const }),
      ...(data.description && { description: data.description }),
      ...(data.persistentKeepalive && {
        persistentKeepalive: data.persistentKeepalive,
      }),
      ...(data.dns && { dns: data.dns }),
      ...(data.mtu && { mtu: data.mtu }),
      ...(data.clientAllowedIPs && {
        clientAllowedIPs: data.clientAllowedIPs,
      }),
      ...(data.expiresAt && { expiresAt: formatISO(data.expiresAt) }),
    } as IWgPeerCreateRequestDto | IWgPeerUpdateRequestDto;

    await onSubmit(payload, data.serverId);
  };

  useHotkeys(
    [["Enter", () => handleSubmit(handleFormSubmit)()]],
    ["TEXTAREA", "SELECT"],
  );

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-4 mb-4">
        {!isEdit && (
          <SelectFormField<PeerFormData, IWgServerOptionDto>
            name="serverId"
            label="Сервер"
            required
            search
            fetchOptions={serversOptions.fetchOptions}
            getOption={serversOptions.getOption}
            fetchOnMount
            placeholder="Выберите сервер"
          />
        )}

        <InputFormField<PeerFormData>
          name="name"
          label="Название пира"
          required
        />
        <TextareaFormField<PeerFormData>
          name="description"
          label="Описание"
          rows={2}
        />

        <InputFormField<PeerFormData>
          name="clientAllowedIPs"
          label="Разрешённые IP клиента"
          hint="Маршруты для клиента (например 0.0.0.0/0 для полного туннеля)"
        />

        <div className="grid grid-cols-2 gap-3">
          <InputFormField<PeerFormData>
            name="dns"
            label="DNS (переопределение)"
            placeholder="1.1.1.1"
          />
          <InputFormField<PeerFormData>
            name="mtu"
            label="MTU"
            type="number"
            placeholder="1420"
          />
        </div>

        <InputFormField<PeerFormData>
          name="persistentKeepalive"
          label="Persistent keepalive (сек)"
          type="number"
          placeholder="25"
        />
        <DatePickerFormField<PeerFormData>
          name="expiresAt"
          label="Срок действия"
          placeholder="Выберите дату"
        />

        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-medium text-foreground">
              Общий ключ (PSK)
            </p>
            <p className="text-xs text-muted-foreground">
              Добавляет дополнительный уровень симметричного шифрования
            </p>
          </div>
          <SwitchFormField<PeerFormData> name="presharedKey" />
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-sm font-medium text-foreground">Включён</span>
          <SwitchFormField<PeerFormData> name="enabled" />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button
            type="button"
            loading={loading}
            onClick={handleSubmit(handleFormSubmit)}
          >
            {isEdit ? "Сохранить" : "Создать пир"}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};
