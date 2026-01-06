"use client"

import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { toast } from "sonner";

const handlePublish = async (articleId, onSuccess, setIsLoading) => {
  setIsLoading(true)
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/articles/${Number(articleId)}/publish`,
    {
      method: 'PUT',
    })
    if (!res.ok) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }
    toast.success("Artikel berhasil dipublikasi")
    onSuccess()
  } catch (err) {
    console.error(err.message)
    toast.error(err.message)
  } finally {
    setIsLoading(false)
  }
}

export const PublishButton = ({rowId, onSuccess}) => {
  // const r = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const onPublish = () => {
    handlePublish(rowId, onSuccess, setIsLoading)
  }

  return (
    <button
      onClick={onPublish}
      className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 transition-colors text-white p-2 rounded-lg cursor-pointer"
      aria-label="publish"
      title="Publish article"
      >
        {
          isLoading ? <div className="w-4 aspect-square rounded-full border-b-0 border-l-0 border-2 animate-spin" /> : <FaCheck size={15} />
        }
    </button>
)}