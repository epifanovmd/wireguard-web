import { useEffect, useState } from "react";

import { iocHook } from "~@common/ioc";

import { ISocketTransport, SocketTransportState } from "../transport";

/**
 * Returns the current socket connection state.
 * Triggers re-render on every status change.
 *
 * @example
 * const { status, error } = useSocketStatus();
 * if (status === "reconnecting") return <Spinner />;
 */
export function useSocketStatus(): SocketTransportState {
  const transport = iocHook(ISocketTransport)();
  const [state, setState] = useState<SocketTransportState>(transport.state);

  useEffect(() => {
    return transport.onStatusChange(setState);
  }, [transport]);

  return state;
}

// ─── useIsSocketConnected ─────────────────────────────────────────────────────

/** Lightweight boolean for components that only care about connectivity. */
export function useIsSocketConnected(): boolean {
  const { status } = useSocketStatus();

  return status === "connected";
}
