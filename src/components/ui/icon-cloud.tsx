import React, { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import { renderToString } from "react-dom/server"

import { Button } from "@/components/ui/button"

interface Icon {
  x: number
  y: number
  z: number
  scale: number
  opacity: number
  id: number
}

interface IconCloudProps {
  icons?: React.ReactNode[]
  images?: string[]
  showControl?: boolean
  width?: number
  height?: number
  iconSize?: number
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function IconCloud({
  icons,
  images,
  showControl = false,
  width = 360,
  height = 360,
  iconSize = 64,
}: IconCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [iconPositions, setIconPositions] = useState<Icon[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState({ x: width / 2, y: height / 2 })

  const [targetRotation, setTargetRotation] = useState<{
    x: number
    y: number
    startX: number
    startY: number
    distance: number
    startTime: number
    duration: number
  } | null>(null)

  const animationFrameRef = useRef<number>(0)
  const rotationRef = useRef({ x: 0, y: 0 })
  const iconCanvasesRef = useRef<HTMLCanvasElement[]>([])
  const imagesLoadedRef = useRef<boolean[]>([])

  // Pause animation if user prefers reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mediaQuery.matches) {
      setIsPaused(true)
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setIsPaused(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Create icon canvases once when icons/images change
  useEffect(() => {
    if (!icons && !images) return

    const items = icons ?? images ?? []
    imagesLoadedRef.current = new Array(items.length).fill(false)

    const newIconCanvases = items.map((item, index) => {
      const offscreen = document.createElement("canvas")
      offscreen.width = iconSize * 2
      offscreen.height = iconSize * 2
      const offCtx = offscreen.getContext("2d")

      if (offCtx) {
        if (images) {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.src = items[index] as string
          img.onload = () => {
            offCtx.clearRect(0, 0, offscreen.width, offscreen.height)
            offCtx.beginPath()
            offCtx.arc(iconSize, iconSize, iconSize, 0, Math.PI * 2)
            offCtx.closePath()
            offCtx.clip()
            offCtx.drawImage(img, 0, 0, iconSize * 2, iconSize * 2)
            imagesLoadedRef.current[index] = true
          }
        } else {
          const svgString = renderToString(item as React.ReactElement)
          const img = new Image()
          img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString)
          img.onload = () => {
            offCtx.clearRect(0, 0, offscreen.width, offscreen.height)
            offCtx.drawImage(img, 0, 0, iconSize * 2, iconSize * 2)
            imagesLoadedRef.current[index] = true
          }
        }
      }
      return offscreen
    })

    iconCanvasesRef.current = newIconCanvases
  }, [icons, images, iconSize])

  // Generate initial icon positions on a sphere
  useEffect(() => {
    const items = icons ?? images ?? []
    const newIcons: Icon[] = []
    const numIcons = items.length || 16

    const offset = 2 / numIcons
    const increment = Math.PI * (3 - Math.sqrt(5))

    for (let i = 0; i < numIcons; i++) {
      const y = i * offset - 1 + offset / 2
      const r = Math.sqrt(1 - y * y)
      const phi = i * increment

      const x = Math.cos(phi) * r
      const z = Math.sin(phi) * r

      newIcons.push({
        x: x * 125,
        y: y * 125,
        z: z * 125,
        scale: 1,
        opacity: 1,
        id: i,
      })
    }
    setIconPositions(newIcons)
  }, [icons, images])

  // Click Selection handler: Brings clicked icon bubble to front along shortest path
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    let closestIcon: { icon: Icon; distance: number } | null = null

    iconPositions.forEach((icon) => {
      const cosX = Math.cos(rotationRef.current.x)
      const sinX = Math.sin(rotationRef.current.x)
      const cosY = Math.cos(rotationRef.current.y)
      const sinY = Math.sin(rotationRef.current.y)

      const rotatedX = icon.x * cosY - icon.z * sinY
      const rotatedZ = icon.x * sinY + icon.z * cosY
      const rotatedY = icon.y * cosX + rotatedZ * sinX

      const screenX = canvasRef.current!.width / 2 + rotatedX
      const screenY = canvasRef.current!.height / 2 + rotatedY

      const scale = (rotatedZ + 200) / 300
      const radius = (iconSize / 2) * scale
      const dx = x - screenX
      const dy = y - screenY
      const distSq = dx * dx + dy * dy

      if (distSq < radius * radius) {
        if (!closestIcon || rotatedZ > closestIcon.icon.z) {
          closestIcon = { icon, distance: distSq }
        }
      }
    })

    if (closestIcon) {
      const icon = (closestIcon as { icon: Icon }).icon
      const rawTargetX = -Math.atan2(
        icon.y,
        Math.sqrt(icon.x * icon.x + icon.z * icon.z)
      )
      const rawTargetY = Math.atan2(icon.x, icon.z)

      const currentX = rotationRef.current.x
      const currentY = rotationRef.current.y

      // Shortest arc path delta (-PI to +PI) to prevent 360 spin
      const diffX = Math.atan2(
        Math.sin(rawTargetX - currentX),
        Math.cos(rawTargetX - currentX)
      )
      const diffY = Math.atan2(
        Math.sin(rawTargetY - currentY),
        Math.cos(rawTargetY - currentY)
      )

      const targetX = currentX + diffX
      const targetY = currentY + diffY
      const distance = Math.hypot(diffX, diffY)

      setTargetRotation({
        x: targetX,
        y: targetY,
        startX: currentX,
        startY: currentY,
        distance,
        startTime: performance.now(),
        duration: Math.min(800, Math.max(400, distance * 500)),
      })
    }
  }

  // Hover detection: Update pointer cursor & hoveredIndex
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMousePos({ x, y })

    let foundHoveredIndex: number | null = null

    iconPositions.forEach((icon, index) => {
      const cosX = Math.cos(rotationRef.current.x)
      const sinX = Math.sin(rotationRef.current.x)
      const cosY = Math.cos(rotationRef.current.y)
      const sinY = Math.sin(rotationRef.current.y)

      const rotatedX = icon.x * cosY - icon.z * sinY
      const rotatedZ = icon.x * sinY + icon.z * cosY
      const rotatedY = icon.y * cosX + rotatedZ * sinX

      const screenX = canvasRef.current!.width / 2 + rotatedX
      const screenY = canvasRef.current!.height / 2 + rotatedY

      const scale = (rotatedZ + 200) / 300
      const radius = (iconSize / 2) * scale
      const dx = x - screenX
      const dy = y - screenY

      if (dx * dx + dy * dy < radius * radius) {
        foundHoveredIndex = index
      }
    })

    setHoveredIndex(foundHoveredIndex)
  }

  // Animation loop with smooth rotation and hovered outline highlight
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (canvas && ctx) {
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        if (targetRotation) {
          const elapsed = performance.now() - targetRotation.startTime
          const progress = Math.min(1, elapsed / targetRotation.duration)
          const easedProgress = easeOutCubic(progress)

          rotationRef.current = {
            x:
              targetRotation.startX +
              (targetRotation.x - targetRotation.startX) * easedProgress,
            y:
              targetRotation.startY +
              (targetRotation.y - targetRotation.startY) * easedProgress,
          }

          if (progress >= 1) {
            setTargetRotation(null)
          }
        } else if (!isPaused) {
          // Smooth ambient cursor-tracking rotation
          const dx = mousePos.x - centerX
          const dy = mousePos.y - centerY
          const speed = 0.003
          rotationRef.current = {
            x: rotationRef.current.x + (dy / canvas.height) * speed,
            y: rotationRef.current.y - (dx / canvas.width) * speed,
          }
        }

        iconPositions.forEach((icon, index) => {
          const cosX = Math.cos(rotationRef.current.x)
          const sinX = Math.sin(rotationRef.current.x)
          const cosY = Math.cos(rotationRef.current.y)
          const sinY = Math.sin(rotationRef.current.y)

          const rotatedX = icon.x * cosY - icon.z * sinY
          const rotatedZ = icon.x * sinY + icon.z * cosY
          const rotatedY = icon.y * cosX + rotatedZ * sinX

          const scale = (rotatedZ + 200) / 300
          const opacity = Math.max(0.3, Math.min(1, (rotatedZ + 150) / 200))

          ctx.save()
          ctx.translate(
            canvas.width / 2 + rotatedX,
            canvas.height / 2 + rotatedY
          )
          ctx.scale(scale, scale)
          ctx.globalAlpha = opacity

          // Draw icon / SVG canvas
          if (icons || images) {
            if (
              iconCanvasesRef.current[index] &&
              imagesLoadedRef.current[index]
            ) {
              ctx.drawImage(
                iconCanvasesRef.current[index],
                -iconSize / 2,
                -iconSize / 2,
                iconSize,
                iconSize
              )
            }
          } else {
            ctx.beginPath()
            ctx.arc(0, 0, iconSize / 2, 0, Math.PI * 2)
            ctx.fillStyle = "#253BFF"
            ctx.fill()
            ctx.fillStyle = "white"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.font = "bold 16px sans-serif"
            ctx.fillText(`${icon.id + 1}`, 0, 0)
          }

          ctx.restore()
        })

        const hasPendingAssets =
          Boolean(icons || images) &&
          !imagesLoadedRef.current.every((loaded) => loaded)
        const shouldContinue = !isPaused || targetRotation !== null || hasPendingAssets

        if (shouldContinue) {
          animationFrameRef.current = requestAnimationFrame(animate)
        }
      }

      animate()
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [
    icons,
    images,
    iconPositions,
    isPaused,
    mousePos,
    targetRotation,
    hoveredIndex,
    iconSize,
  ])

  return (
    <div className="relative inline-block select-none group flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
        className={`rounded-lg transition-all duration-300 ${
          hoveredIndex !== null ? "cursor-pointer" : "cursor-default"
        }`}
        aria-label="Interactive 3D Icon Selection Cloud"
        role="img"
      />



      {showControl && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsPaused(!isPaused)}
          aria-label={isPaused ? "Play Animation" : "Pause Animation"}
          className="absolute top-2 right-2 border-white/20 bg-white/10 hover:bg-white/20 text-white"
        >
          {isPaused ? <Play size={16} /> : <Pause size={16} />}
        </Button>
      )}
    </div>
  )
}
