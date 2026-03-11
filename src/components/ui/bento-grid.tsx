import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@sicaho-collab/m3-design-system";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full gap-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  iconClassName,
  titleClassName,
  description,
  href,
  cta,
  ctaContent,
  tag,
  tagClassName,
  hoverClassName,
  children,
}: {
  name: string;
  className: string;
  background?: ReactNode;
  Icon: any;
  iconClassName?: string;
  titleClassName?: string;
  description: string;
  href?: string;
  cta?: string;
  /** Custom hover CTA content — replaces the default cta/href link */
  ctaContent?: ReactNode;
  /** Small label tag shown in top-right corner */
  tag?: string;
  tagClassName?: string;
  /** Custom hover overlay color class (replaces default grey) */
  hoverClassName?: string;
  children?: ReactNode;
}) => (
  <div
    key={name}
    className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-m3-md",
      className,
    )}
  >
    {background && <div className="absolute inset-0">{background}</div>}
    {tag && (
      <span className={cn(
        "absolute top-3 right-3 z-10 rounded-m3-full px-2.5 py-0.5 text-[var(--text-xs)] font-medium",
        tagClassName || "bg-m3-surface-container-high text-m3-on-surface-variant"
      )}>
        {tag}
      </span>
    )}
    <div className="pointer-events-none z-10 flex flex-col gap-2 p-6">
      <div className="flex items-center gap-3">
        <Icon className={cn("h-6 w-6 shrink-0 text-m3-on-surface", iconClassName)} />
        <h3 className={cn("text-[var(--text-lg)] font-semibold text-m3-on-surface", titleClassName)}>
          {name}
        </h3>
      </div>
      <p className="max-w-lg text-[var(--text-sm)] text-m3-on-surface-variant">{description}</p>
    </div>
    {children && <div className="z-10">{children}</div>}
    {ctaContent ? (
      <div className="absolute bottom-0 flex w-full flex-row flex-wrap items-center gap-2 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {ctaContent}
      </div>
    ) : cta && href ? (
      <div className="absolute bottom-0 flex w-full flex-row items-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <Button variant="ghost" asChild size="sm" className="pointer-events-auto">
          <a href={href}>
            {cta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    ) : null}
    <div className={cn("pointer-events-none absolute inset-0 transform-gpu transition-all duration-300", hoverClassName || "group-hover:bg-m3-on-surface/[.03]")} />
  </div>
);

export { BentoCard, BentoGrid };
