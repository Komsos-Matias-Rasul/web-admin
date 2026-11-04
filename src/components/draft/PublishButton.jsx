"use client"

import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { toast } from "sonner";
import { ConfirmModal } from "../ConfirmModal";

const publishArticle = async (articleId) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/articles/${Number(articleId)}/publish`,
  {
    method: 'PUT',
  })
  if (!res.ok) {
    // Error body may be missing or non-JSON (e.g. proxy error page)
    const jsonData = await res.json().catch(() => null)
    const reason = jsonData?.data?.error ?? res.statusText
    const traceId = jsonData?._id ? ` (${jsonData._id})` : ""
    throw new Error(`${res.status} ${reason}${traceId}`)
  }
}

export const PublishButton = ({ rowId, articleTitle, onSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onConfirm = async () => {
    setIsLoading(true)
    try {
      await publishArticle(rowId)
      toast.success("Artikel berhasil dipublikasi")
      setIsModalOpen(false)
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
        onClick={() => setIsModalOpen(true)}
        disabled={isLoading}
        className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 transition-colors text-white p-2 rounded-lg cursor-pointer disabled:cursor-not-allowed"
        aria-label="publish"
        title="Publish article"
      >
        {
          isLoading ? <div className="w-4 aspect-square rounded-full border-b-0 border-l-0 border-2 animate-spin" /> : <FaCheck size={15} />
        }
      </button>
      <ConfirmModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={onConfirm}
        isLoading={isLoading}
        title="Konfirmasi Publikasi Artikel"
        message={<p>Artikel <b>&quot;{articleTitle}&quot;</b> akan dipublikasi</p>}
        confirmLabel="Publikasi"
      />
    </>
  )
}