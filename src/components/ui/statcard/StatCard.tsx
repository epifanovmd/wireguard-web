import { Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import React, { FC } from "react";

export type StatCardColor =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple";

const COLOR_MAP: Record<StatCardColor, string> = {
  default: "gray",
  success: "green",
  warning: "yellow",
  danger: "red",
  info: "blue",
  purple: "violet",
};

export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label?: string };
  className?: string;
  color?: StatCardColor;
}

export const StatCard: FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
  color = "default",
}) => {
  const trendPositive = trend && trend.value >= 0;

  return (
    <Paper
      withBorder
      radius="md"
      p="lg"
      className={className}
      shadow="xs"
      style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
    >
      <Group justify="space-between" align="flex-start" gap="sm">
        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Text
            size="xs"
            fw={600}
            tt="uppercase"
            c="dimmed"
            style={{ letterSpacing: "0.06em", color: "var(--text-muted)" }}
          >
            {title}
          </Text>
          <Text size="xl" fw={700} truncate style={{ color: "var(--text-primary)" }}>
            {value}
          </Text>
          {subtitle && (
            <Text size="xs" style={{ color: "var(--text-muted)" }}>
              {subtitle}
            </Text>
          )}
          {trend && (
            <Text size="xs" fw={600} c={trendPositive ? "green" : "red"}>
              {trendPositive ? "+" : ""}
              {trend.value}%
              {trend.label && (
                <Text component="span" c="dimmed" fw={400} ml={4}>
                  {trend.label}
                </Text>
              )}
            </Text>
          )}
        </Stack>
        {icon && (
          <ThemeIcon
            size={44}
            radius="md"
            variant="light"
            color={COLOR_MAP[color]}
          >
            {icon}
          </ThemeIcon>
        )}
      </Group>
    </Paper>
  );
};
