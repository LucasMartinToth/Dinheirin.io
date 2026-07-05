import Image from "next/image"

export function Logo() {
  return (
    <div className="flex items-center justify-center">
      <Image src="/logo.svg" alt="" width={250} height={32} />
    </div>
  )
}