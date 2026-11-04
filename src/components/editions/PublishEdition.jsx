'use client'

import { useState } from "react"
import { ConfirmModal } from "../ConfirmModal"
import { FaCheck } from "react-icons/fa"
import { toast } from "sonner"

const publishEdition = async (editionId) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/editions/${editionId}/publish`, {
    method: "PUT",
  })
  if (!res.ok) {
    const jsonData = await res.json().catch(() => null)
    const reason = jsonData?.data?.error ?? res.statusText
    const traceId = jsonData?._id ? ` (${jsonData._id})` : ""
    throw new Error(`${res.status} ${reason}${traceId}`)
  }
}

export const PublishEdition = ({ editionId, editionTitle, onSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onConfirm = async () => {
    setIsLoading(true)
    try {
      await publishEdition(editionId)
      toast.success("Edisi berhasil diterbitkan")
      setIsModalOpen(false)
      onSuccess?.()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className="bg-emerald-500 text-white hover:bg-emerald-400 active:bg-emerald-600 p-2 rounded-lg transition-colors cursor-pointer"
        aria-label="publish"
        title="Publish edition"
        onClick={() => setIsModalOpen(true)}
      >
        <FaCheck size={15} />
      </button>
      <ConfirmModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={onConfirm}
        isLoading={isLoading}
        title="Publikasi Edisi"
        message={
          <p>
            Tekan tombol &ldquo;Publikasi&rdquo; untuk membuat edisi{" "}
            {editionTitle ? <span className="font-semibold">&ldquo;{editionTitle}&rdquo;</span> : "ini"}{" "}
            dapat diakses oleh publik.
          </p>
        }
        confirmLabel="Publikasi"
      />
    </>
  )
}
