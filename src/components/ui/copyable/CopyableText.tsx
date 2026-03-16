import { ActionIcon, CopyButton, Group, Text, Tooltip } from "@mantine/core";
import { Check, Copy } from "lucide-react";
import React, { FC } from "react";

export interface CopyableTextProps {
  text: string;
  displayText?: string;
  className?: string;
  truncate?: boolean;
  maxWidth?: string;
}

export const CopyableText: FC<CopyableTextProps> = ({
  text,
  displayText,
  className,
  truncate = true,
  maxWidth = "200px",
}) => {
  return (
    <Group
      gap={4}
      wrap="nowrap"
      className={className}
      style={{ display: "inline-flex" }}
    >
      <Text
        size="xs"
        ff="monospace"
        truncate={truncate ? "end" : undefined}
        style={truncate ? { maxWidth } : undefined}
        title={text}
      >
        {displayText ?? text}
      </Text>
      <CopyButton value={text} timeout={2000}>
        {({ copied, copy }) => (
          <Tooltip label={copied ? "Copied!" : "Copy"} withArrow>
            <ActionIcon
              variant="subtle"
              color={copied ? "green" : "gray"}
              size="xs"
              onClick={copy}
              aria-label={copied ? "Copied!" : "Copy to clipboard"}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>
    </Group>
  );
};
