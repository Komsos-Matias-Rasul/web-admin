"use client"

import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa";

const handlePublish = async (articleId, r) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/articles/publish/${Number(articleId)}`,
    {
      method: 'POST',
    })
    if (!res.ok) {
      r.back()
    }
  } catch (err) {
    console.error(err)
  }
}

export const PublishButton = ({rowId}) => {
  const r = useRouter()
  
  return (
    <button
      onClick={() => handlePublish(rowId, r)}
      className="bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 transition-colors text-white p-2 rounded-lg cursor-pointer"
      aria-label="publish"
      title="Publish article"
      >
        <FaCheck size={15} />
    </button>
)}