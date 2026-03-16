import {
  Button,
  ElementProps,
  Stack,
  StackProps,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { Inbox } from "lucide-react";
import React, { FC, forwardRef } from "react";

export interface EmptyProps
  extends StackProps,
    ElementProps<"div", keyof StackProps> {
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  icon?: React.ReactNode;
}

export const Empty: FC<EmptyProps> = forwardRef<HTMLDivElement, EmptyProps>(
  ({ title, description, action, icon, ...props }, ref) => {
    return (
      <Stack
        ref={ref}
        align="center"
        justify="center"
        py={64}
        px={16}
        {...props}
      >
        <ThemeIcon size={64} radius="xl" variant="light" color="gray">
          {icon ?? <Inbox size={32} />}
        </ThemeIcon>
        <Text fw={600} size="sm">
          {title ?? "No data"}
        </Text>
        {description && (
          <Text size="xs" c="dimmed" ta="center" maw={280} lh={1.5}>
            {description}
          </Text>
        )}
        {action && (
          <Button size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </Stack>
    );
  },
);
