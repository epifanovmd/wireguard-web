import { observer } from "mobx-react-lite";
import { FC } from "react";

import { RolePermissionsForm } from "~@components/forms";
import { PageHeader, PageLayout } from "~@components/layouts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~@components/ui";
import { usePermissions } from "~@store";

import { MyPermissions, SecurityTab } from "./shared";

export const Settings: FC = observer(() => {
  const { isAdmin } = usePermissions();

  return (
    <PageLayout
      header={
        <PageHeader
          title="Настройки"
          subtitle="Системная конфигурация и информация"
        />
      }
    >
      <Tabs defaultValue="security">
        <TabsList>
          <TabsTrigger value="security">Безопасность</TabsTrigger>
          {isAdmin && <TabsTrigger value="roles">Роли и права</TabsTrigger>}
          <TabsTrigger value="my-permissions">Мои права</TabsTrigger>
        </TabsList>

        <TabsContent
          value="security"
          className={"flex flex-col gap-6 max-w-3xl mt-4"}
        >
          <SecurityTab />
        </TabsContent>
        {isAdmin && (
          <TabsContent
            value="roles"
            className={"flex flex-col gap-6 max-w-3xl mt-4"}
          >
            <RolePermissionsForm />
          </TabsContent>
        )}
        <TabsContent
          value="my-permissions"
          className={"flex flex-col gap-6 max-w-3xl mt-4"}
        >
          <MyPermissions />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
});
