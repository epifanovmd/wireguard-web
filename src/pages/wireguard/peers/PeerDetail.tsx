import { EPermissions } from "@api/api-gen/data-contracts";
import { PageHeader, PageLayout } from "@components/layouts";
import {
  PeerActions,
  PeerConfigurationCard,
  QrCodeModal,
} from "@components/shared";
import { PageLoader } from "@components/shared/loaders";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  PageEmpty,
  Select,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/ui";
import { usePermissions } from "@store";
import { observer } from "mobx-react-lite";
import { FC, useState } from "react";

import { useUsersSelectOptions } from "../../../hooks";
import { PeerForm } from "./components/PeerForm";
import { PeerLiveCharts } from "./components/PeerLiveCharts";
import { PeerLiveStatCards } from "./components/PeerLiveStatCards";
import { PeerLiveStatusStrip } from "./components/PeerLiveStatusStrip";
import { usePeerDetailVM } from "./hooks";

interface PeerDetailProps {
  peerId: string;
  onBack: () => void;
}

export const PeerDetail: FC<PeerDetailProps> = observer(
  ({ peerId, onBack }) => {
    const vm = usePeerDetailVM(peerId, onBack);
    const { peer, model } = vm;
    const { hasPermission } = usePermissions();
    const usersOptions = useUsersSelectOptions();

    const canManage = hasPermission(EPermissions.WgPeerManage);
    const canViewStats = hasPermission(EPermissions.WgStatsView);
    const [assignUserId, setAssignUserId] = useState<string | undefined>();

    return (
      <PageLayout
        header={
          <PageHeader
            title={peer?.name ?? "Пир"}
            actions={
              peer && (
                <PeerActions
                  status={peer.status}
                  size="sm"
                  canManage={canManage}
                  onQr={() => vm.setQrOpen(true)}
                  onToggle={vm.handleToggle}
                  onEdit={() => vm.setEditOpen(true)}
                  onDelete={vm.handleDelete}
                />
              )
            }
          />
        }
        contentClassName="gap-3 sm:gap-6"
      >
        {vm.isLoading ? (
          <PageLoader />
        ) : !peer || !model ? (
          <PageEmpty icon="question" title="Пир не найден" />
        ) : (
          <>
            <PeerLiveStatusStrip
              peer={peer}
              canManage={canManage}
              onAssign={() => {
                setAssignUserId(undefined);
                vm.setAssignOpen(true);
              }}
              onRevoke={vm.handleRevoke}
            />

            {canViewStats && <PeerLiveStatCards />}

            <Tabs defaultValue={canViewStats ? "charts" : "config"}>
              <TabsList>
                {canViewStats && (
                  <TabsTrigger value="charts">Скорость / Трафик</TabsTrigger>
                )}
                <TabsTrigger value="config">Конфигурация</TabsTrigger>
              </TabsList>

              {canViewStats && (
                <TabsContent value="charts" className={"flex flex-col gap-4"}>
                  <PeerLiveCharts />
                </TabsContent>
              )}

              <TabsContent value="config">
                <PeerConfigurationCard
                  peer={model}
                  canManage={canManage}
                  handleRotatePsk={vm.handleRotatePsk}
                  handleRemovePsk={vm.handleRemovePsk}
                />
              </TabsContent>
            </Tabs>

            {canManage && (
              <Modal
                open={vm.editOpen}
                onOpenChange={open => !open && vm.setEditOpen(false)}
              >
                <ModalOverlay />
                <ModalContent className="max-w-lg">
                  <ModalHeader>
                    <ModalTitle>Редактировать пир</ModalTitle>
                  </ModalHeader>
                  <ModalBody>
                    <PeerForm
                      isEdit
                      defaultValues={peer}
                      onSubmit={vm.handleUpdate}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => vm.setEditOpen(false)}
                    >
                      Отмена
                    </Button>
                    <Button
                      type="submit"
                      form="peer-form"
                      loading={vm.isUpdateLoading}
                    >
                      Сохранить
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            )}

            <Modal
              open={vm.assignOpen}
              onOpenChange={open => !open && vm.setAssignOpen(false)}
            >
              <ModalOverlay />
              <ModalContent className="max-w-sm">
                <ModalHeader>
                  <ModalTitle>Назначить пользователю</ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <Select
                    fetchOptions={usersOptions.fetchOptions}
                    getOption={usersOptions.getOption}
                    fetchOnMount
                    value={assignUserId}
                    onChange={setAssignUserId}
                    placeholder="Выберите пользователя"
                  />

                  <div className={"flex grow justify-end gap-2 py-4"}>
                    <Button
                      variant="outline"
                      onClick={() => vm.setAssignOpen(false)}
                    >
                      Отмена
                    </Button>
                    <Button
                      disabled={!assignUserId}
                      loading={vm.assignLoading}
                      onClick={() =>
                        assignUserId && vm.handleAssign(assignUserId)
                      }
                    >
                      Назначить
                    </Button>
                  </div>
                </ModalBody>
              </ModalContent>
            </Modal>

            <QrCodeModal
              open={vm.qrOpen}
              peerId={peerId}
              peerName={peer.name}
              onClose={() => vm.setQrOpen(false)}
            />
          </>
        )}
      </PageLayout>
    );
  },
);
