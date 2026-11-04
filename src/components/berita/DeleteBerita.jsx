'use client'

import { useState } from "react"
import { ConfirmModal } from "../ConfirmModal"
import { toast } from "sonner"
import { FiTrash2 } from "react-icons/fi"

const deleteBerita = async (beritaId) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/berita/${Number(beritaId)}`,
    {
      method: "DELETE",
    }
  )
  if (!res.ok) {
    const jsonData = await res.json().catch(() => null)
    const reason = jsonData?.data?.error ?? res.statusText
    const traceId = jsonData?._id ? ` (${jsonData._id})` : ""
    throw new Error(`${res.status} ${reason}${traceId}`)
  }
}

export const DeleteBerita = ({ beritaId, beritaTitle, onSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onConfirm = async () => {
    setIsLoading(true)
    try {
      await deleteBerita(beritaId)
      setIsModalOpen(false)
      toast.success("Berita dihapus")
      onSuccess?.()
    } catch (err) {
      console.error(err.message)
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className="text-sm bg-rose-500 text-white font-bold hover:bg-rose-400 active:bg-rose-600 p-2 rounded-lg transition-colors cursor-pointer"
        aria-label="hapus berita"
        title="Hapus berita"
        onClick={() => setIsModalOpen(true)}
      >
        <FiTrash2 size={15} />
      </button>
      <ConfirmModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={onConfirm}
        isLoading={isLoading}
        variant="danger"
        title="Hapus Berita"
        message={
          <p>
            Perhatian! Berita {beritaTitle ? <span className="font-semibold">&ldquo;{beritaTitle}&rdquo;</span> : "yang dipilih"} akan dihapus dan tidak dapat dikembalikan.
          </p>
        }
        confirmLabel="Ya, Hapus"
      />
    </>
  )
}
