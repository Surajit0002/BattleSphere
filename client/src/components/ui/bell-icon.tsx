import React from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface BellIconProps extends React.HTMLAttributes<HTMLDivElement> {
  hasNotifications?: boolean;
  size?: "sm" | "md" | "lg";
}

export function BellIcon({ hasNotifications = false, size = "md", className, ...props }: BellIconProps) {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div className={cn("relative", className)} {...props}>
      <Bell className={cn(sizeMap[size])} />
      {hasNotifications && (
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
      )}
    </div>
  );
}

export default BellIcon;