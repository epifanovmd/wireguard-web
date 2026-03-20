import React, { FC, useEffect, useState } from "react";

import { useApi } from "~@api/hooks";
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
} from "~@components/ui";

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
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && peerId) {
      setLoading(true);
      api.getPeerQrCode(peerId).then(res => {
        if (res.data) {
          setQrUrl((res.data as any).dataUrl ?? null);
        }
        setLoading(false);
      });
    }

    return () => {
      setQrUrl(null);
      setLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, peerId]);

  const handleDownload = async () => {
    if (peerId) {
      const res = await api.getPeerConfig(peerId);

      if (res.data) {
        const blob = new Blob([res.data as any], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${peerName}.conf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  return (
    <Modal open={open} onOpenChange={o => !o && onClose()}>
      <ModalOverlay />
      <ModalContent className="max-w-sm">
        <ModalHeader>
          <ModalTitle>QR-код — {peerName}</ModalTitle>
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
                  QR-код недоступен
                </p>
              </div>
            )}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Отсканируйте QR-код в приложении WireGuard
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Доступно для iOS, Android, Windows, macOS, Linux
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={handleDownload}>
            Скачать .conf
          </Button>
          <Button onClick={onClose}>Закрыть</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
