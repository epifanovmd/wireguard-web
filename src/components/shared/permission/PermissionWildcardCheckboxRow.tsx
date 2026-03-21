import { memo, ReactNode } from "react";

import { Checkbox } from "~@components/ui";

interface PermissionWildcardCheckboxRowProps {
  label: ReactNode;
  description: string;
  checked: boolean;
  disabled: boolean;
  onCheckedChange: () => void;
  badge?: ReactNode;
}

export const PermissionWildcardCheckboxRow =
  memo<PermissionWildcardCheckboxRowProps>(
    ({ label, description, checked, disabled, onCheckedChange, badge }) => (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
        <Checkbox
          checked={checked}
          disabled={disabled}
          onCheckedChange={onCheckedChange}
        />
        <div className="flex-1">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {badge}
      </div>
    ),
  );
