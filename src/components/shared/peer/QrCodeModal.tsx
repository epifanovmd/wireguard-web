import { useApi } from "@api/hooks";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  Spinner,
} from "@components/ui";
import { FC, useEffect, useState } from "react";

import { useQrCode } from "./hooks";

interface QrCodeModalProps {
  peerId?: string;
  peerName?: string;
  open: boolean;
  onClose: () => void;
}

export const QrCodeModal: FC<QrCodeModalProps> = ({
  peerId,
  peerName,
  open,
  onClose,
}) => {
  const api = useApi();
  const { qrUrl, loading } = useQrCode(peerId, open);

  const handleDownload = async () => {
    if (!peerId) return;

    const res = await api.getPeerConfig({ id: peerId });

    if (res.data) {
      const blob = new Blob([res.data as string], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `${peerName}.conf`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Modal open={open} onOpenChange={o => !o && onClose()}>
      <ModalOverlay />
      <ModalContent className="max-w-sm">
        <ModalHeader>
          <ModalTitle>{`QR-код — ${peerName}`}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center gap-4 py-4">
            {loading ? (
              <div className="w-48 h-48 flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : qrUrl ? (
              <img
                src={qrUrl}
                alt="QR Code"
                className="w-48 h-48 rounded-lg border border-border"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {"QR-код недоступен"}
                </p>
              </div>
            )}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {"Отсканируйте QR-код в приложении WireGuard"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {"Доступно для iOS, Android, Windows, macOS, Linux"}
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={handleDownload}>
            {"Скачать .conf"}
          </Button>
          <Button onClick={onClose}>Закрыть</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
