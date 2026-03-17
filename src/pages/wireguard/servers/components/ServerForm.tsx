import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { IWgServerCreateRequestDto, IWgServerUpdateRequestDto, WgServerDto } from "~@api/api-gen/data-contracts";
import { Button, Input, Select, Textarea, Toggle } from "~@components";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  interface: z.string().min(1, "Interface name is required").regex(/^[a-z0-9]+$/, "Lowercase letters and numbers only"),
  listenPort: z.coerce.number().int().min(1).max(65535),
  address: z.string().min(1, "CIDR address required").regex(/^\d+\.\d+\.\d+\.\d+\/\d+$/, "Must be CIDR format e.g. 10.0.0.1/24"),
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
  onSubmit: (data: IWgServerCreateRequestDto | IWgServerUpdateRequestDto) => Promise<void>;
  onCancel: () => void;
}

export const ServerForm: FC<ServerFormProps> = ({ defaultValues, isEdit, loading, onSubmit, onCancel }) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ServerFormData>({
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

  const enabled = watch("enabled");

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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      <Input label="Server name" required error={errors.name?.message} {...register("name")} />

      {!isEdit && (
        <Input
          label="Interface name"
          placeholder="wg0"
          required
          hint="e.g. wg0, wg1 — cannot be changed after creation"
          error={errors.interface?.message}
          {...register("interface")}
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Listen port"
          type="number"
          required
          error={errors.listenPort?.message}
          {...register("listenPort")}
        />
        <Input
          label="Address (CIDR)"
          placeholder="10.0.0.1/24"
          required
          error={errors.address?.message}
          {...register("address")}
        />
      </div>

      <Input
        label="Endpoint"
        placeholder="vpn.example.com:51820"
        hint="Public host:port for client configs"
        {...register("endpoint")}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input label="DNS" placeholder="1.1.1.1" {...register("dns")} />
        <Input label="MTU" type="number" placeholder="1420" {...register("mtu")} />
      </div>

      <Textarea label="Description" rows={2} {...register("description")} />

      <div className="flex items-center justify-between py-1">
        <span className="text-sm font-medium text-[var(--foreground)]">Enabled</span>
        <Toggle checked={enabled} onChange={v => setValue("enabled", v)} />
      </div>

      {/* Advanced */}
      <button
        type="button"
        className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        onClick={() => setShowAdvanced(v => !v)}
      >
        <ChevronRight size={16} className={`transition-transform ${showAdvanced ? "rotate-90" : ""}`} />
        Advanced settings (scripts)
      </button>

      {showAdvanced && (
        <div className="flex flex-col gap-3 pl-3 border-l-2 border-[var(--border)]">
          <Textarea label="PreUp" placeholder="iptables -A FORWARD ..." rows={2} {...register("preUp")} />
          <Textarea label="PostUp" rows={2} {...register("postUp")} />
          <Textarea label="PreDown" rows={2} {...register("preDown")} />
          <Textarea label="PostDown" rows={2} {...register("postDown")} />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={loading}>{isEdit ? "Save changes" : "Create server"}</Button>
      </div>
    </form>
  );
};
