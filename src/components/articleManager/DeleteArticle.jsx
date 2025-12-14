'use client'

import { useState } from "react"
import { ModalComponent } from "../ModalComponent"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const handleDelete = async (articleId, setIsLoading, onSuccess) => {
  setIsLoading(true)
  try{
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/articles/${Number(articleId)}`,
      {
        method: "DELETE",
      })
    const jsonData = await res.json()
    if (!res.ok) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }
    onSuccess()
    toast.success("Artikel dihapus")
  }catch(err){
    console.error(err.message)
    toast.error(err.message)
  }finally{
    setIsLoading(false)
  }
}

export const DeleteArticle = ({ articleId, editionId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const r = useRouter()
  const onSubmit = (e) => {
    e.preventDefault()
    const onSuccess = () => {
      setIsModalOpen(false)
      r.replace(`/admin/editions/${Number(editionId)}/articles`)
    }
    handleDelete(articleId, setIsLoading, onSuccess)
  }
  return (
    <div className="w-full p-4 bg-white rounded-lg ">
      <p className="text-rose-500 font-bold text-xl mb-4">Delete</p>
      <p className="text-dark-primary mb-4">This action cannot be undone.</p>
      <>
        <button
          className="text-sm bg-rose-500 text-white font-bold hover:bg-rose-400 active:bg-rose-600 px-4 py-2 rounded-lg transition-colors cursor-pointer"
          aria-label="delete article"
          title="Delete Article"
          onClick={() => setIsModalOpen(true)}
        >
        Delete Article
        </button>
        <ModalComponent isOpen={isModalOpen}>
          <p className="text-dark-primary text-lg font-semibold mb-4">Hapus Artikel</p>
          <p>Perhatian! artikel yang sudah dihapus tidak dapat dikembalikan.</p>
          <p>Harap pastikan kembali artikel yang akan dihapus.</p>
          <form onReset={() => setIsModalOpen(false)} onSubmit={onSubmit} className="w-[30rem]">
            <div className="flex w-full justify-end gap-2 mt-4">
              <button
                className="text-dark-primary/75 font-bold hover:bg-neutral-200 active:bg-neutral-300 px-4 py-2 rounded-lg transition-colors cursor-pointer min-w-28 disabled:text-dark-primary/30 disabled:bg-transparent disabled:cursor-not-allowed"
                aria-label="cancel update article info"
                title="Cancel"
                type="reset"
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
              >
              Batalkan
              </button>
              <button
                className="text-white font-bold bg-blue-primary hover:bg-blue-400 active:bg-blue-600 px-4 py-2 rounded-lg transition-colors cursor-pointer min-w-28 disabled:bg-blue-primary/30 disabled:cursor-not-allowed"
                aria-label="submit new edition"
                title="Delete"
                type="submit"
                disabled={isLoading}
              >
              {isLoading ? <div className="flex justify-center items-center w-full"><span className="loader"></span></div> : "Ya, Hapus"}
              </button>
            </div>
          </form>
        </ModalComponent>
      </>
    </div>
  )
}