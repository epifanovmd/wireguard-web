import { zodResolver } from "@hookform/resolvers/zod";
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
  InputFormField,
  Select,
  SwitchFormField,
  TextareaFormField,
} from "~@components/ui2";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional().or(z.literal("")),
  presharedKey: z.boolean(),
  persistentKeepalive: z.coerce.number().optional().nullable(),
  dns: z.string().optional().or(z.literal("")),
  mtu: z.coerce.number().optional().nullable(),
  clientAllowedIPs: z.string().optional().or(z.literal("")),
  endpoint: z.string().optional().or(z.literal("")),
  expiresAt: z.string().optional().or(z.literal("")),
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
      persistentKeepalive: defaultValues?.persistentKeepalive ?? null,
      dns: defaultValues?.dns ?? "",
      mtu: defaultValues?.mtu ?? null,
      clientAllowedIPs: defaultValues?.clientAllowedIPs ?? "0.0.0.0/0, ::/0",
      endpoint: defaultValues?.endpoint ?? "",
      expiresAt: defaultValues?.expiresAt
        ? new Date(defaultValues.expiresAt).toISOString().slice(0, 16)
        : "",
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
    if (data.endpoint) payload.endpoint = data.endpoint;
    if (data.expiresAt)
      payload.expiresAt = new Date(data.expiresAt).toISOString();

    await onSubmit(payload, serverId);
  };

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
            placeholder="Select server"
          />
        )}

        <InputFormField<PeerFormData> name="name" label="Peer name" required />
        <TextareaFormField<PeerFormData>
          name="description"
          label="Description"
          rows={2}
        />

        <InputFormField<PeerFormData>
          name="clientAllowedIPs"
          label="Client allowed IPs"
          hint="Routes pushed to client (e.g. 0.0.0.0/0 for full tunnel)"
        />

        <div className="grid grid-cols-2 gap-3">
          <InputFormField<PeerFormData>
            name="dns"
            label="DNS override"
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
          label="Persistent keepalive (sec)"
          type="number"
          placeholder="25"
        />
        <InputFormField<PeerFormData>
          name="endpoint"
          label="Endpoint override"
          placeholder="host:port"
        />
        <InputFormField<PeerFormData>
          name="expiresAt"
          label="Expires at"
          type="datetime-local"
        />

        <div className="flex items-center justify-between py-1">
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">
              Preshared key
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Adds additional layer of symmetric encryption
            </p>
          </div>
          <SwitchFormField<PeerFormData> name="presharedKey" />
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-sm font-medium text-[var(--foreground)]">
            Enabled
          </span>
          <SwitchFormField<PeerFormData> name="enabled" />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            loading={loading}
            onClick={handleSubmit(handleFormSubmit)}
          >
            {isEdit ? "Save changes" : "Create peer"}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};
