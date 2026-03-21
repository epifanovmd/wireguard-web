import { ErrorRouteComponent } from "@tanstack/react-router";

export const RouterErrorFallback: ErrorRouteComponent = ({ error }) => (
  <div className="flex flex-col items-center justify-center h-screen gap-4 text-center p-8">
    <div className="text-destructive font-semibold text-lg">
      Ошибка загрузки страницы
    </div>
    <p className="text-sm text-muted-foreground max-w-md">{error.message}</p>
    <button
      className="cursor-pointer text-sm underline text-muted-foreground hover:text-foreground transition-colors"
      onClick={() => window.location.reload()}
    >
      Перезагрузить страницу
    </button>
  </div>
);
