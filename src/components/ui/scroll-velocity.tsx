import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion"
import React, { useRef } from "react"
import { cn } from "@/lib/utils"

interface VelocityTextProps {
  children: React.ReactNode
  baseVelocity?: number
  className?: string
}

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

export function VelocityText({
  children,
  baseVelocity = 100,
  className,
}: VelocityTextProps) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  })

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  })

  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`)

  const directionFactor = useRef<number>(1)

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1
    }

    moveBy += directionFactor.current * moveBy * Math.abs(velocityFactor.get())

    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className={cn("w-full overflow-hidden whitespace-nowrap flex flex-nowrap", className)}>
      <motion.div className="flex flex-nowrap gap-12 whitespace-nowrap" style={{ x }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 shrink-0">
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
