import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "destructive";
  size?: "sm" | "md";
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "btn rounded-lg transition-transform duration-200",
        {
          "btn-primary": variant === "primary",
          "btn-ghost": variant === "ghost",
          "btn-outline": variant === "outline",
          "btn-sm": size === "sm",
        },
        className
      )}
    />
  );
}
