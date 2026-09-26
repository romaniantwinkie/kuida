import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

const BentoGrid = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <div className={cn("grid w-full auto-rows-[18rem] grid-cols-1 gap-4 md:grid-cols-3", className)}>{children}</div>;
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
}: {
  name: string;
  className?: string;
  background: ReactNode;
  Icon?: React.ComponentType<{ className?: string }>;
  description: string;
}) => (
  <div
    className={cn(
      "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm",
      className,
    )}
  >
    <div className="min-h-0 flex-1 overflow-hidden">{background}</div>
    <div className="z-[1] flex flex-col gap-1 p-5">
      {Icon ? <Icon className="h-5 w-5 text-foreground" /> : null}
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{name}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export { BentoCard, BentoGrid };
