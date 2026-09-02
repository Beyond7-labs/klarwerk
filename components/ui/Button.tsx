/**
 * Button. Primär (Navy), Ghost (Rahmen), Danger, oder Textlink-Stil.
 * Mit `href` wird ein Link gerendert.
 * Props: variant, size, href, ...ButtonHTMLAttributes.
 * Beispiel: <Button variant="primary" href="/projekte/neu">Neues Projekt</Button>
 */
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "danger" | "link";
type Size = "md" | "sm" | "xs";

type Props = {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

function klassen(variant: Variant, size: Size, extra?: string) {
  if (variant === "link") return ["btn-link", extra].filter(Boolean).join(" ");
  return [
    "btn",
    `btn-${variant}`,
    size === "sm" ? "btn-sm" : size === "xs" ? "btn-xs" : "",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button({ variant = "primary", size = "md", href, className, children, ...rest }: Props) {
  const cls = klassen(variant, size, className);
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
