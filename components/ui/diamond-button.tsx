import * as React from "react"
import { motion } from "framer-motion"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const diamondButtonVariants = cva(
  "relative inline-flex items-center justify-center text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-gold via-yellow-500 to-gold text-black shadow-[0_0_20px_rgba(218,165,32,0.5),0_0_40px_rgba(218,165,32,0.3),inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.2)]",
        secondary:
          "bg-gradient-to-br from-accent via-blue-500 to-accent text-white shadow-[0_0_20px_rgba(65,105,225,0.5),0_0_40px_rgba(65,105,225,0.3),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.2)]",
        outline:
          "border-2 border-gold bg-gradient-to-br from-gold/10 via-transparent to-gold/10 text-gold shadow-[0_0_15px_rgba(218,165,32,0.3),inset_0_0_20px_rgba(218,165,32,0.1)]",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 px-4",
        lg: "h-12 px-10 text-base",
        xl: "h-14 px-12 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface DiamondButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof diamondButtonVariants> {
  asChild?: boolean
}

const DiamondButton = React.forwardRef<HTMLButtonElement, DiamondButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="inline-block"
      >
        <Comp
          className={cn(diamondButtonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {/* Diamond facet reflections */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.3),transparent_50%)]" />
          </div>

          {/* Sparkle particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <span className="relative z-10">{children}</span>
        </Comp>
      </motion.div>
    )
  }
)
DiamondButton.displayName = "DiamondButton"

export { DiamondButton, diamondButtonVariants }
