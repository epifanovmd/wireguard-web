import { zodResolver } from "@hookform/resolvers/zod";
import { useHotkeys } from "@mantine/hooks";
import { formatISO, parseISO } from "date-fns";
import React, { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import {
  IWgPeerCreateRequestDto,
  IWgPeerUpdateRequestDto,
  WgPeerDto,
  WgServerDto,
} from "~@api/api-gen/data-contracts";
import {
  Button,
  DatePickerFormField,
  InputFormField,
  Select,
  SwitchFormField,
  TextareaFormField,
} from "~@components/ui2";

const schema = z.object({
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

export type PeerFormData = z.infer<typeof schema>;

interface PeerFormProps {
  defaultValues?: Partial<WgPeerDto>;
  servers?: WgServerDto[];
  selectedServerId?: string;
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
  servers,
  selectedServerId,
  isEdit,
  loading,
  onSubmit,
  onCancel,
}) => {
  const [serverId, setServerId] = React.useState(
    selectedServerId ?? servers?.[0]?.id ?? "",
  );

  const methods = useForm<PeerFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
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
    const payload: any = {
      name: data.name,
      enabled: data.enabled,
    };
    if (data.presharedKey) payload.presharedKey = true;
    if (data.description) payload.description = data.description;
    if (data.persistentKeepalive)
      payload.persistentKeepalive = data.persistentKeepalive;
    if (data.dns) payload.dns = data.dns;
    if (data.mtu) payload.mtu = data.mtu;
    if (data.clientAllowedIPs) payload.clientAllowedIPs = data.clientAllowedIPs;
    if (data.expiresAt) payload.expiresAt = formatISO(data.expiresAt);

    await onSubmit(payload, serverId);
  };

  useHotkeys(
    [["Enter", () => handleSubmit(handleFormSubmit)()]],
    ["TEXTAREA", "SELECT"],
  );

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-4 mb-4">
        {!isEdit && servers && servers.length > 0 && (
          <Select
            options={servers.map(s => ({
              value: s.id,
              label: `${s.name} (${s.interface})`,
            }))}
            value={serverId}
            onValueChange={v => setServerId(v ?? "")}
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
            <p className="text-sm font-medium text-[var(--foreground)]">
              Общий ключ (PSK)
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Добавляет дополнительный уровень симметричного шифрования
            </p>
          </div>
          <SwitchFormField<PeerFormData> name="presharedKey" />
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-sm font-medium text-[var(--foreground)]">
            Включён
          </span>
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
