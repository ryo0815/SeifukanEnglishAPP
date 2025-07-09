import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm hover:shadow-md",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gradient-to-r from-blue-500 to-blue-600 text-white",
        secondary: "border-transparent bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900",
        destructive: "border-transparent bg-gradient-to-r from-red-500 to-red-600 text-white",
        outline: "text-gray-700 border-gray-300 bg-white hover:bg-gray-50",
        success: "border-transparent bg-gradient-to-r from-green-500 to-green-600 text-white",
        warning: "border-transparent bg-gradient-to-r from-orange-500 to-orange-600 text-white",
        purple: "border-transparent bg-gradient-to-r from-purple-500 to-purple-600 text-white",
        pink: "border-transparent bg-gradient-to-r from-pink-500 to-pink-600 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
