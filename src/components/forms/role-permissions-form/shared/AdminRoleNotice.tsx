import { memo } from "react";

export const AdminRoleNotice = memo(() => (
  <div className="flex items-start gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800">
    <div className="flex-1">
      <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
        {"Админ"}
      </p>
      <p className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
        {"Роль Администратор обходит все проверки прав. Конкретные права не"}
        {"требуются — доступ ко всему предоставляется автоматически."}
      </p>
    </div>
  </div>
));
