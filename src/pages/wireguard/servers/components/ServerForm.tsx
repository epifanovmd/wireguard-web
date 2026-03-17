import { zodResolver } from "@hookform/resolvers/zod";
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
} from "~@components/ui2";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  interface: z
    .string()
    .min(1, "Interface name is required")
    .regex(/^[a-z0-9]+$/, "Lowercase letters and numbers only"),
  listenPort: z.coerce.number().int().min(1).max(65535),
  address: z
    .string()
    .min(1, "CIDR address required")
    .regex(/^\d+\.\d+\.\d+\.\d+\/\d+$/, "Must be CIDR format e.g. 10.0.0.1/24"),
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
    const payload: any = {
      name: data.name,
      listenPort: data.listenPort,
      address: data.address,
      enabled: data.enabled,
    };
    if (data.endpoint) payload.endpoint = data.endpoint;
    if (data.dns) payload.dns = data.dns;
    if (data.mtu) payload.mtu = data.mtu;
    if (data.description) payload.description = data.description;
    if (data.preUp) payload.preUp = data.preUp;
    if (data.postUp) payload.postUp = data.postUp;
    if (data.preDown) payload.preDown = data.preDown;
    if (data.postDown) payload.postDown = data.postDown;
    if (!isEdit) {
      payload.interface = data.interface;
    }
    await onSubmit(payload);
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-4 mb-4">
        <InputFormField<ServerFormData>
          name="name"
          label="Server name"
          required
        />

        {!isEdit && (
          <InputFormField<ServerFormData>
            name="interface"
            label="Interface name"
            placeholder="wg0"
            required
            hint="e.g. wg0, wg1 — cannot be changed after creation"
          />
        )}

        <div className="grid grid-cols-2 gap-3">
          <InputFormField<ServerFormData>
            name="listenPort"
            label="Listen port"
            type="number"
            required
          />
          <InputFormField<ServerFormData>
            name="address"
            label="Address (CIDR)"
            placeholder="10.0.0.1/24"
            required
          />
        </div>

        <InputFormField<ServerFormData>
          name="endpoint"
          label="Endpoint"
          placeholder="vpn.example.com:51820"
          hint="Public host:port for client configs"
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
          label="Description"
          rows={2}
        />

        <div className="flex items-center justify-between py-1">
          <span className="text-sm font-medium text-[var(--foreground)]">
            Enabled
          </span>
          <SwitchFormField<ServerFormData> name="enabled" />
        </div>

        <Collapse variant="ghost">
          <Collapse.Trigger leadingIcon={<Terminal size={15} />}>
            Advanced settings (scripts)
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
            Cancel
          </Button>
          <Button
            type="button"
            loading={loading}
            onClick={handleSubmit(handleFormSubmit)}
          >
            {isEdit ? "Save changes" : "Create server"}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};
