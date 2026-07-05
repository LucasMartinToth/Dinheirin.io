type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "h5"
  children: React.ReactNode
  className?: string
}

const sizeMap = {
  h1: "text-h1", h2: "text-h2", h3: "text-h3", h4: "text-h4", h5: "text-h5",
}

export function Heading({ as = "h1", children, className = "" }: HeadingProps) {
  const Tag = as
  return (
    <Tag className={`${sizeMap[as]} font-bold text-neutral-100 text-center ${className}`}>
      {children}
    </Tag>
  )
}