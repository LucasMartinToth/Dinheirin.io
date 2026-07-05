type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary"
}

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const base = "w-full rounded-full py-3.5 text-p2 font-bold transition-colors disabled:opacity-50"
  const variants = {
    primary: "bg-green text-neutral-100 hover:bg-green-400",
    secondary: "bg-neutral-100 text-neutral-800 hover:bg-neutral-300",
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}