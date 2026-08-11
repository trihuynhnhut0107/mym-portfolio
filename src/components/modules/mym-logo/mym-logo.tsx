import { cn } from "@/lib/utils"

export function MymLogo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <img
      src="/logos/portfolio/official-logo-1.svg"
      alt="MYM Logo"
      className={cn("inline-block shrink-0", className)}
    />
  )
}
