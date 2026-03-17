import { useNavigate } from "@tanstack/react-router";
import { Play, RotateCcw, Square, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { FC, useEffect, useState } from "react";

import { EWgServerStatus } from "~@api/api-gen/data-contracts";
import { PageHeader } from "~@components/layouts";
import {
  Badge,
  Button,
  Card,
  Empty,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  Spinner,
  useConfirm,
  useToast,
} from "~@components/ui2";
import { ServerModel } from "~@models";
import { useServersDataStore } from "~@store";

import { useWgServer } from "../../../socket";
import { ServerForm } from "./components/ServerForm";
import { ServerStatusBadge } from "./components/ServerStatusBadge";

interface ServerCardProps {
  server: ServerModel;
  loading: string | undefined;
  onAction: (
    id: string,
    action: "start" | "stop" | "restart" | "delete",
  ) => void;
  onView: (id: string) => void;
}

const ServerCard: FC<ServerCardProps> = ({ server, loading, onAction, onView }) => {
  const { status: liveStatus } = useWgServer(server.data.id);
  const effectiveStatus = liveStatus?.status ?? server.data.status;
  const isDown = effectiveStatus === "down" || effectiveStatus === "error";

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer p-5"
      onClick={() => onView(server.data.id)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-[var(--foreground)] truncate">
              {server.name}
            </h3>
            <ServerStatusBadge status={effectiveStatus} />
            {!server.data.enabled && <Badge variant="warning">Disabled</Badge>}
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--muted-foreground)]">
            <span className="font-mono">{server.data.interface}</span>
            <span>·</span>
            <span>:{server.data.listenPort}</span>
            {server.data.address && (
              <>
                <span>·</span>
                <span>{server.data.address}</span>
              </>
            )}
            {liveStatus && (
              <>
                <span>·</span>
                <span>{liveStatus.activePeerCount}/{liveStatus.peerCount} peers</span>
              </>
            )}
          </div>
          {server.data.endpoint && (
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              {server.data.endpoint}
            </p>
          )}
          {server.data.description && (
            <p className="text-xs text-[var(--muted-foreground)] mt-1 truncate">
              {server.data.description}
            </p>
          )}
        </div>
      </div>

      <div
        className="flex items-center gap-1 mt-4"
        onClick={e => e.stopPropagation()}
      >
        {isDown ? (
          <Button
            loading={loading === "start"}
            size="sm"
            variant="ghost"
            onClick={() => onAction(server.data.id, "start")}
          >
            <Play size={15} className="text-success" />
          </Button>
        ) : (
          <Button
            loading={loading === "stop"}
            size="sm"
            variant="ghost"
            onClick={() => onAction(server.data.id, "stop")}
          >
            <Square size={15} className="text-warning" />
          </Button>
        )}
        <Button
          loading={loading === "restart"}
          size="sm"
          variant="ghost"
          onClick={() => onAction(server.data.id, "restart")}
        >
          <RotateCcw size={15} />
        </Button>
        <Button
          loading={loading === "delete"}
          size="sm"
          variant="ghost"
          onClick={() => onAction(server.data.id, "delete")}
        >
          <Trash2 size={15} className="text-destructive" />
        </Button>
      </div>
    </Card>
  );
};

export const ServersList: FC = observer(() => {
  const store = useServersDataStore();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<Record<string, string>>({});

  useEffect(() => {
    store.loadServers().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLoading = (id: string, action: string) =>
    setActionLoading(prev => ({ ...prev, [id]: action }));
  const clearLoading = (id: string) =>
    setActionLoading(prev => {
      const n = { ...prev };
      delete n[id];
      return n;
    });

  const handleAction = async (
    id: string,
    action: "start" | "stop" | "restart" | "delete",
  ) => {
    if (action === "delete") {
      const ok = await confirm({
        title: "Delete server",
        message: "This will permanently delete the server and all its peers.",
        variant: "danger",
      });
      if (!ok) return;
    }
    setLoading(id, action);
    let res;
    if (action === "start") res = await store.startServer(id);
    else if (action === "stop") res = await store.stopServer(id);
    else if (action === "restart") res = await store.restartServer(id);
    else res = await store.deleteServer(id);
    clearLoading(id);
    if (res?.error) {
      toast.error(res.error.message);
    } else if (action === "delete") {
      toast.success("Server deleted");
    }
  };

  const activeCount = store.servers.filter(
    s => s.status === EWgServerStatus.Up,
  ).length;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Servers"
        subtitle={`${store.total} total, ${activeCount} active`}
        actions={
          <Button onClick={() => setCreateOpen(true)}>Add server</Button>
        }
      />
      <div className="p-4 sm:p-6">
        {!store.listHolder.isReady && !store.listHolder.isError ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : store.servers.length === 0 ? (
          <Empty
            title="No servers"
            description="Add your first WireGuard server to get started"
            action={<Button onClick={() => setCreateOpen(true)}>Add server</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {store.models.map(server => (
              <ServerCard
                key={server.data.id}
                server={server}
                loading={actionLoading[server.data.id]}
                onAction={handleAction}
                onView={id =>
                  navigate({
                    to: "/wireguard/servers/$serverId",
                    params: { serverId: id },
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      <Modal open={createOpen} onOpenChange={open => !open && setCreateOpen(false)}>
        <ModalOverlay />
        <ModalContent className="max-w-lg">
          <ModalHeader>
            <ModalTitle>Add server</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <ServerForm
              loading={false}
              onCancel={() => setCreateOpen(false)}
              onSubmit={async data => {
                const res = await store.createServer(data as any);
                if (res.error) {
                  toast.error(res.error.message);
                } else {
                  toast.success("Server created");
                  setCreateOpen(false);
                }
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
});
