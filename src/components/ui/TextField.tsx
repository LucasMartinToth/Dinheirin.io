"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

type TextFieldProps = {
  label: string
  type?: "text" | "email" | "password"
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

export function TextField({ label, type = "text", value, onChange, placeholder, required }: TextFieldProps) {
  const [show, setShow] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword ? (show ? "text" : "password") : type

  return (
    <div className="space-y-1">
      <label className="block text-label text-neutral-500">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-full bg-neutral-100 px-4 py-3.5 text-p2 text-neutral-800 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-green"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600"
            aria-label={show ? "Ocultar senha" : "Mostrar senha"}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  )
}