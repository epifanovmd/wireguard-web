import { zodResolver } from "@hookform/resolvers/zod";
import { useHotkeys } from "@mantine/hooks";
import { Terminal } from "lucide-react";
import React, { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import {
  IWgServerCreateRequestDto,
  IWgServerUpdateRequestDto,
  WgServerDto,
} from "~@api/api-gen/data-contracts";
import {
  Button,
  Collapse,
  InputFormField,
  SwitchFormField,
  TextareaFormField,
} from "~@components/ui";

const schema = z.object({
  name: z.string().min(1, "Название обязательно"),
  interface: z
    .string()
    .min(1, "Имя интерфейса обязательно")
    .regex(/^[a-z0-9]+$/, "Только строчные буквы и цифры"),
  listenPort: z.coerce.number().int().min(1).max(65535),
  address: z
    .string()
    .min(1, "CIDR-адрес обязателен")
    .regex(/^\d+\.\d+\.\d+\.\d+\/\d+$/, "Формат CIDR, например 10.0.0.1/24"),
  endpoint: z.string().optional().or(z.literal("")),
  dns: z.string().optional().or(z.literal("")),
  mtu: z.coerce.number().optional().nullable(),
  description: z.string().optional().or(z.literal("")),
  enabled: z.boolean(),
  preUp: z.string().optional().or(z.literal("")),
  postUp: z.string().optional().or(z.literal("")),
  preDown: z.string().optional().or(z.literal("")),
  postDown: z.string().optional().or(z.literal("")),
});

export type ServerFormData = z.infer<typeof schema>;

interface ServerFormProps {
  defaultValues?: Partial<WgServerDto>;
  isEdit?: boolean;
  loading?: boolean;
  onSubmit: (
    data: IWgServerCreateRequestDto | IWgServerUpdateRequestDto,
  ) => Promise<void>;
  onCancel: () => void;
}

export const ServerForm: FC<ServerFormProps> = ({
  defaultValues,
  isEdit,
  loading,
  onSubmit,
  onCancel,
}) => {
  const methods = useForm<ServerFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      interface: defaultValues?.interface ?? "",
      listenPort: defaultValues?.listenPort ?? 51820,
      address: defaultValues?.address ?? "",
      endpoint: defaultValues?.endpoint ?? "",
      dns: defaultValues?.dns ?? "",
      mtu: defaultValues?.mtu ?? undefined,
      description: defaultValues?.description ?? "",
      enabled: defaultValues?.enabled ?? true,
      preUp: defaultValues?.preUp ?? "",
      postUp: defaultValues?.postUp ?? "",
      preDown: defaultValues?.preDown ?? "",
      postDown: defaultValues?.postDown ?? "",
    },
  });

  const { handleSubmit } = methods;

  const handleFormSubmit = async (data: ServerFormData) => {
    const base = {
      name: data.name,
      listenPort: data.listenPort,
      address: data.address,
      enabled: data.enabled,
      ...(data.endpoint && { endpoint: data.endpoint }),
      ...(data.dns && { dns: data.dns }),
      ...(data.mtu && { mtu: data.mtu }),
      ...(data.description && { description: data.description }),
      ...(data.preUp && { preUp: data.preUp }),
      ...(data.postUp && { postUp: data.postUp }),
      ...(data.preDown && { preDown: data.preDown }),
      ...(data.postDown && { postDown: data.postDown }),
    };

    const payload = isEdit
      ? (base as IWgServerUpdateRequestDto)
      : ({ ...base, interface: data.interface } as IWgServerCreateRequestDto);

    await onSubmit(payload);
  };

  useHotkeys(
    [["Enter", () => handleSubmit(handleFormSubmit)()]],
    ["TEXTAREA", "SELECT"],
  );

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-4 mb-4">
        <InputFormField<ServerFormData>
          name="name"
          label="Название сервера"
          required
        />

        {!isEdit && (
          <InputFormField<ServerFormData>
            name="interface"
            label="Имя интерфейса"
            placeholder="wg0"
            required
            hint="Например wg0, wg1 — нельзя изменить после создания"
          />
        )}

        <div className="grid grid-cols-2 gap-3">
          <InputFormField<ServerFormData>
            name="listenPort"
            label="Порт прослушивания"
            type="number"
            required
          />
          <InputFormField<ServerFormData>
            name="address"
            label="Адрес (CIDR)"
            placeholder="10.0.0.1/24"
            required
          />
        </div>

        <InputFormField<ServerFormData>
          name="endpoint"
          label="Эндпоинт"
          placeholder="vpn.example.com:51820"
          hint="Публичный host:port для конфигурации клиентов"
        />

        <div className="grid grid-cols-2 gap-3">
          <InputFormField<ServerFormData>
            name="dns"
            label="DNS"
            placeholder="1.1.1.1"
          />
          <InputFormField<ServerFormData>
            name="mtu"
            label="MTU"
            type="number"
            placeholder="1420"
          />
        </div>

        <TextareaFormField<ServerFormData>
          name="description"
          label="Описание"
          rows={2}
        />

        <div className="flex items-center justify-between py-1">
          <span className="text-sm font-medium text-foreground">
            Включён
          </span>
          <SwitchFormField<ServerFormData> name="enabled" />
        </div>

        <Collapse variant="ghost">
          <Collapse.Trigger leadingIcon={<Terminal size={15} />}>
            Дополнительные настройки (скрипты)
          </Collapse.Trigger>
          <Collapse.Content innerClassName="px-3 pb-3 flex flex-col gap-3">
            <TextareaFormField<ServerFormData>
              name="preUp"
              label="PreUp"
              placeholder="iptables -A FORWARD ..."
              rows={2}
            />
            <TextareaFormField<ServerFormData>
              name="postUp"
              label="PostUp"
              rows={2}
            />
            <TextareaFormField<ServerFormData>
              name="preDown"
              label="PreDown"
              rows={2}
            />
            <TextareaFormField<ServerFormData>
              name="postDown"
              label="PostDown"
              rows={2}
            />
          </Collapse.Content>
        </Collapse>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button
            type="button"
            loading={loading}
            onClick={handleSubmit(handleFormSubmit)}
          >
            {isEdit ? "Сохранить" : "Создать сервер"}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};
