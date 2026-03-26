import { useEffect, useState } from "react";

import { useApi } from "~@api";

export const useQrCode = (peerId: string | undefined, open: boolean) => {
  const api = useApi();
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !peerId) return;

    let cancelled = false;

    setLoading(true);
    api.getPeerQrCode({ id: peerId }).then(res => {
      if (cancelled) return;
      const data = res.data;

      setQrUrl(data?.dataUrl ?? null);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      setQrUrl(null);
      setLoading(false);
    };
  }, [open, peerId, api]);

  return { qrUrl, loading };
};
