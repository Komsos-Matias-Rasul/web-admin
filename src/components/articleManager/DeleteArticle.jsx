'use client'

import { useState } from "react"
import { ConfirmModal } from "../ConfirmModal"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const deleteArticle = async (articleId) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/articles/${Number(articleId)}`,
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

export const DeleteArticle = ({ articleId, editionId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const r = useRouter()

  const onConfirm = async () => {
    setIsLoading(true)
    try {
      await deleteArticle(articleId)
      setIsModalOpen(false)
      toast.success("Artikel dihapus")
      r.replace(`/admin/editions/${Number(editionId)}/articles`)
    } catch (err) {
      console.error(err.message)
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full p-4 bg-white rounded-lg ">
      <p className="text-rose-500 font-bold text-xl mb-4">Delete</p>
      <p className="text-dark-primary mb-4">This action cannot be undone.</p>
      <button
        type="button"
        className="text-sm bg-rose-500 text-white font-bold hover:bg-rose-400 active:bg-rose-600 px-4 py-2 rounded-lg transition-colors cursor-pointer"
        aria-label="delete article"
        title="Delete Article"
        onClick={() => setIsModalOpen(true)}
      >
        Delete Article
      </button>
      <ConfirmModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={onConfirm}
        isLoading={isLoading}
        variant="danger"
        title="Hapus Artikel"
        message="Perhatian! Artikel yang sudah dihapus tidak dapat dikembalikan."
        confirmLabel="Ya, Hapus"
      />
    </div>
  )
}
