import { ColumnDef } from "@tanstack/react-table";

import { PublicUserModel } from "~@models";

import { UserAvatar } from "../../shared";

export const userColumns: ColumnDef<PublicUserModel>[] = [
  {
    accessorKey: "displayName",
    header: "Пользователь",
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <UserAvatar name={row.original.displayName} />
        <span className="font-medium text-[var(--foreground)]">
          {row.original.displayName}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Эл. почта",
    cell: ({ row }) => (
      <span className="text-[var(--muted-foreground)]">
        {row.original.data.email ?? "—"}
      </span>
    ),
  },
];
