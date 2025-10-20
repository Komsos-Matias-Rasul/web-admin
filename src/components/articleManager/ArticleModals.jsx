"use client"
import { useState } from "react"
import { AddWriterModal } from "./AddWriterModal"
import { ModalComponent } from "../ModalComponent"
import { toast } from "sonner"

const handleSubmit = async (articleInfo, setIsLoading, mutator, onClose) => {
  const {id, title, writerId, categoryId} = articleInfo
  try {
    if (!title || !writerId || !categoryId) {
      setMessage({ type: 'error', text: 'Please fill out all required fields' })
      return false
    }

    setIsLoading(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/articles/saveTWC`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        category: Number(categoryId),
        writer: Number(writerId),
        id: Number(id)
      }),
    })
    const jsonData = await res.json()
    if (!res.ok) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }
    toast.success("Informasi artikel berhasil diperbarui")
    mutator.mutateInitialData({id, title, writerId, categoryId})
    onClose()
  } catch (err) {
    console.error(err)
    toast.error(err.message)
  } finally {
    setIsLoading(false)
  }
}

export const SettingsModal = ({
  articleId,
  initialData,
  writers,
  categories,
}) => {
  const [articleTitle, setArticleTitle] = useState(initialData.title)
  const [selectedWriter, setSelectedWriter] = useState(initialData.writerId)
  const [selectedCategory, setSelectedCategory] = useState(initialData.categoryId)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onReset = () => {
    setArticleTitle(initialData.title)
    setSelectedWriter(initialData.writerId)
    setSelectedCategory(initialData.categoryId)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const articleInfo = {
      id: articleId,
      title: articleTitle,
      writerId: selectedWriter,
      categoryId: selectedCategory,
    }
    const mutator = {
      mutateInitialData: initialData.mutate,
      mutateWriters: writers.mutate,
      mutateCategories: categories.mutate,
    }

    handleSubmit(articleInfo, setIsLoading, mutator, () => setIsModalOpen(false))
  }

  return (
    <>
      <button
        className="text-sm bg-blue-primary text-white font-bold hover:bg-blue-400 active:bg-sky-700 px-4 py-2 rounded-lg transition-colors cursor-pointer"
        aria-label="update article"
        title="Update Article Info"
        onClick={() => setIsModalOpen(true)}
      >
      Perbarui Informasi
      </button>

      <ModalComponent isOpen={isModalOpen}>
        <div className="text-dark-primary text-lg font-semibold">Perbarui Informasi Artikel</div>
        <form onReset={onReset} onSubmit={onSubmit} className="w-[30rem]">
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-dark-primary/75 font-semibold">Judul Artikel: <span className="text-rose-500">*</span></label>
              <input
                placeholder="Makna Air dalam Pembaptisan"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                className="bg-neutral-200 rounded px-4 py-2 text-dark-primary/75 focus:outline-none"
                required
                disabled={isLoading}
                />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-dark-primary/75 font-semibold">Penulis: <span className="text-rose-500">*</span></label>
              <div className="flex gap-2 w-[90%]">
                <select
                  value={selectedWriter}
                  onChange={(e) => setSelectedWriter(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">Select a writer</option>
                  {writers.data.map((writer) => (
                    <option key={writer.id} value={writer.id}>
                      {writer.writerName}
                    </option>
                  ))}
                </select>
                <AddWriterModal />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-dark-primary/75 font-semibold">Kategori: <span className="text-rose-500">*</span></label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={isLoading}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">Select a category</option>
                {categories.data.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex w-full justify-end gap-2 mt-4">
            <button
              className="text-dark-primary/75 font-bold hover:bg-neutral-200 active:bg-neutral-300 px-4 py-2 rounded-lg transition-colors cursor-pointer min-w-28 disabled:text-dark-primary/30 disabled:bg-transparent disabled:cursor-not-allowed"
              aria-label="cancel create edition"
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
              title="Create"
              type="submit"
              disabled={isLoading}
            >
            {isLoading ? <div className="flex justify-center items-center w-full"><span className="loader"></span></div> : "Simpan"}
            </button>
          </div>
        </form>
      </ModalComponent>
    </>
  )
}