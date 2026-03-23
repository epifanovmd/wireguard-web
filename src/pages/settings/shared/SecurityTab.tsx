import { Fingerprint, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { useApi } from "~@api";
import { usePasskeyAuth } from "~@common";
import {
  AsyncButton,
  AsyncIconButton,
  Badge,
  Button,
  Card,
  IconButton,
} from "~@components/ui";
import { useNotification } from "~@core/notifications";
import { useAuthStore } from "~@store";

export const SecurityTab: FC = observer(() => {
  const toast = useNotification();
  const api = useApi();
  const { user } = useAuthStore();
  const profile = user?.profile;
  const passkey = usePasskeyAuth();

  const handlePasskeyRegister = async () => {
    if (!profile?.id) return;

    const userRes = await api.getUserById(profile.userId);
    const login = userRes.data?.email ?? userRes.data?.phone;

    if (!login) {
      toast.error("Не удалось определить логин (email/телефон)");
      return;
    }

    const { ok, error } = await passkey.handleRegister(login);

    if (ok) {
      toast.success("Passkey успешно зарегистрирован");
    } else if (error) {
      toast.error(error);
    }
  };

  const handlePasskeyRemove = () => {
    passkey.removePasskey();
  };

  return (
    <Card title="Passkey (биометрический вход)" className="p-5">
      {!passkey.support ? (
        <p className="text-sm text-muted-foreground">
          Ваш браузер не поддерживает passkey (WebAuthn).
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <Fingerprint size={16} className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {passkey.profileId
                  ? "Passkey зарегистрирован на этом устройстве"
                  : "Passkey не зарегистрирован на этом устройстве"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {passkey.profileId
                  ? `Логин: ${passkey.profileId}`
                  : "Зарегистрируйте passkey для входа через Face ID, Touch ID или ключ безопасности."}
              </p>
            </div>
            <Badge variant={passkey.profileId ? "success" : "gray"} dot>
              {passkey.profileId ? "Активен" : "Не задан"}
            </Badge>
          </div>

          {passkey.error && (
            <div className="px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-xs text-destructive">{passkey.error}</p>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <AsyncButton
              size="sm"
              variant={passkey.profileId ? "outline" : "default"}
              loading={passkey.loading}
              onClick={handlePasskeyRegister}
            >
              {passkey.profileId
                ? "Перерегистрировать passkey"
                : "Зарегистрировать passkey"}
            </AsyncButton>
            {passkey.profileId && (
              <IconButton
                size="sm"
                variant={"destructive"}
                onClick={handlePasskeyRemove}
              >
                <Trash2 className={"text-destructive"} />
              </IconButton>
            )}
          </div>
        </div>
      )}
    </Card>
  );
});
