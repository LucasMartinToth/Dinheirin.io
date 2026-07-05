import Image from "next/image"

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/logo.svg" alt="" width={32} height={32} />
      <span className="text-h4 font-bold text-neutral-100">
        dinheir<span className="text-green">.io</span>
      </span>
    </div>
  )
}