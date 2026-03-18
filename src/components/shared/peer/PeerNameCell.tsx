import { FC } from "react";

import { PeerModel } from "~@models";

import { CopyableText } from "../../ui2";

export const PeerNameCell: FC<{ peer: PeerModel }> = ({ peer }) => (
  <div>
    <p className="font-medium text-[var(--foreground)]">{peer.name}</p>
    <CopyableText
      text={peer.data.publicKey}
      displayText={peer.shortPublicKey}
      className="mt-0.5 text-[var(--muted-foreground)]"
    />
  </div>
);
