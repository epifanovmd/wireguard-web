import { Button } from "@components/ui";
import { Link, useRouter } from "@tanstack/react-router";
import { BarChart3, Grid2x2, MoveLeft, Server, Users, Zap } from "lucide-react";
import { FC } from "react";

const QUICK_LINKS = [
  { to: "/", label: "Дашборд", icon: Grid2x2 },
  { to: "/wireguard/servers", label: "Серверы", icon: Server },
  { to: "/wireguard/peers", label: "Пиры", icon: Zap },
  { to: "/users", label: "Пользователи", icon: Users },
  { to: "/wireguard/stats", label: "Статистика", icon: BarChart3 },
] as const;

export const NotFoundPage: FC = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-8 p-8 text-center">
      {/* 404 */}
      <div className="relative select-none">
        <p className="text-[10rem] font-black leading-none tracking-tighter text-muted/40 sm:text-[14rem]">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl border border-border/60 bg-background/80 px-6 py-3 shadow-sm backdrop-blur-sm">
            <p className="text-lg font-semibold text-foreground">
              Страница не найдена
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Возможно, адрес устарел или страница была удалена
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.history.back()}
        >
          <MoveLeft size={15} />
          Назад
        </Button>
        <Button size="sm">
          <Link to="/">На главную</Link>
        </Button>
      </div>

      {/* Quick links */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Быстрый переход
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {QUICK_LINKS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
            >
              <Icon size={13} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
