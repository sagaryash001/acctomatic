import { cn } from "@/lib/utils";

export function AdminCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("admin-glass rounded-2xl p-5", className)} {...props} />;
}
