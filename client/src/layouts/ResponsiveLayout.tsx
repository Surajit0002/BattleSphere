import React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  withGutter?: boolean;
}

/**
 * A responsive layout component that provides consistent spacing and width constraints across the application.
 * 
 * @param children - The content to be rendered within the layout
 * @param className - Additional CSS classes to apply to the layout
 * @param fullWidth - If true, the content will span the full width of the parent container with padding
 * @param maxWidth - The maximum width of the content ("sm" | "md" | "lg" | "xl" | "2xl" | "full")
 * @param withGutter - If true, adds horizontal padding even when fullWidth is true
 */
export function ResponsiveLayout({
  children,
  className,
  fullWidth = false,
  maxWidth = "2xl",
  withGutter = true,
}: ResponsiveLayoutProps) {
  return (
    <div
      className={cn(
        // Horizontal padding that applies in all cases when withGutter is true
        withGutter && "px-4 sm:px-6 lg:px-8",
        // Container class that centers the content and applies max-width
        !fullWidth && "mx-auto",
        // Max width classes
        maxWidth === "sm" && "max-w-screen-sm",
        maxWidth === "md" && "max-w-screen-md",
        maxWidth === "lg" && "max-w-screen-lg",
        maxWidth === "xl" && "max-w-screen-xl",
        maxWidth === "2xl" && "max-w-screen-2xl",
        maxWidth === "full" && "max-w-full",
        // Additional custom classes
        className
      )}
    >
      {children}
    </div>
  );
}

export default ResponsiveLayout;