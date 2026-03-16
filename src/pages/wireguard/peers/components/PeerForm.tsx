import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  IWgPeerCreateRequestDto,
  IWgPeerUpdateRequestDto,
  WgPeerDto,
  WgServerDto,
} from "~@api/api-gen/data-contracts";
import {
  Button,
  Checkbox,
  Input,
  Select,
  Textarea,
  Toggle,
} from "~@components";

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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PeerFormData>({
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

  const enabled = watch("enabled");
  const presharedKey = watch("presharedKey");

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
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4"
    >
      {!isEdit && servers && servers.length > 0 && (
        <Select
          label="Server"
          required
          value={serverId}
          onChange={v => setServerId(v ?? "")}
          data={servers.map(s => ({
            value: s.id,
            label: `${s.name} (${s.interface})`,
          }))}
        />
      )}

      <Input
        label="Peer name"
        required
        error={errors.name?.message}
        {...register("name")}
      />
      <Textarea label="Description" rows={2} {...register("description")} />

      <Input
        label="Client allowed IPs"
        hint="Routes pushed to client (e.g. 0.0.0.0/0 for full tunnel)"
        {...register("clientAllowedIPs")}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="DNS override"
          placeholder="1.1.1.1"
          {...register("dns")}
        />
        <Input
          label="MTU"
          type="number"
          placeholder="1420"
          {...register("mtu")}
        />
      </div>

      <Input
        label="Persistent keepalive (sec)"
        type="number"
        placeholder="25"
        {...register("persistentKeepalive")}
      />
      <Input
        label="Endpoint override"
        placeholder="host:port"
        {...register("endpoint")}
      />
      <Input
        label="Expires at"
        type="datetime-local"
        {...register("expiresAt")}
      />

      <div className="flex items-center justify-between py-1">
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">
            Preshared key
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Adds additional layer of symmetric encryption
          </p>
        </div>
        <Toggle
          checked={presharedKey}
          onChange={v => setValue("presharedKey", v)}
        />
      </div>

      <div className="flex items-center justify-between py-1">
        <span className="text-sm font-medium text-[var(--text-primary)]">
          Enabled
        </span>
        <Toggle checked={enabled} onChange={v => setValue("enabled", v)} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {isEdit ? "Save changes" : "Create peer"}
        </Button>
      </div>
    </form>
  );
};
