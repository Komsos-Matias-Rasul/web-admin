"use client"

import { useRouter } from "next/navigation"

export const BackButton = () => {
  const r = useRouter()
  return (
    <button onClick={r.back} className="flex items-center w-fit gap-1 text-blue-primary hover:bg-blue-primary/20 font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer">
      &lt; Kembali
    </button>
  )
}