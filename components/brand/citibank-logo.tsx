import Image from "next/image"

type CitibankLogoProps = {
  className?: string
  width?: number
  height?: number
}

export function CitibankLogo({
  className = "",
  width = 120,
  height = 40,
}: CitibankLogoProps) {
  return (
    <Image
      src="/citibank-logo.jpg"
      alt="Citibank"
      width={width}
      height={height}
      className={`object-contain ${className}`}
      priority
    />
  )
}