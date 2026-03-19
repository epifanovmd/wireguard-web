import * as React from "react";
import { Toaster } from "react-hot-toast";

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <>
    {children}
    <Toaster
      position="top-right"
      gutter={8}
      containerStyle={{ zIndex: 9999 }}
      toastOptions={{
        duration: 4000,
        style: {
          padding: 0,
          background: "transparent",
          boxShadow: "none",
          maxWidth: "400px",
        },
      }}
    />
  </>
);
