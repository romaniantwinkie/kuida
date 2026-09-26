"use client";

import { Toaster as Sonner } from "sonner";
import "sonner/dist/styles.css";

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      offset={16}
      visibleToasts={3}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "w-[22rem]",
        },
      }}
    />
  );
}
