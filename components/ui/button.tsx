import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  asChild?: boolean
}

const variantClasses = {
  default: "bg-burgundy text-white hover:bg-burgundy-dark dark:bg-burgundy dark:hover:bg-burgundy-dark",
  outline: "border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800",
  ghost: "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800",
}

const sizeClasses = {
  default: "px-4 py-2 text-sm",
  sm: "px-3 py-1.5 text-xs",
  lg: "px-6 py-3 text-base",
}

const baseClasses = "font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center whitespace-nowrap"

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", style, ...props }, ref) => {
    // Apply inline styles for variant colors as fallback
    let inlineStyles: React.CSSProperties = style ? { ...style } : {}
    if (variant === "default") {
      inlineStyles = {
        ...inlineStyles,
        backgroundColor: "#B12B28",
        color: "white",
      }
    }

    return (
      <button
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        style={inlineStyles}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button }
