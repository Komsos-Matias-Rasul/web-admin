'use client'
import useSWR from "swr"
import { SettingsModal } from "./ArticleModals"

const fetchArticleInfo = async(endpoint) => {
  const res = await fetch(endpoint)
  if (!res.ok) {
    const jsonData = await res.json()
    if (jsonData) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }
  }
  const { data } = await res.json()
  const initialData = {
    id: data.id,
    title: data.title,
    writerId: data.writer_id,
    categoryId: data.category_id
  }
  return initialData
}

const fetchWriters = async(endpoint) => {
  const res = await fetch(endpoint)
  if (!res.ok) {
    const jsonData = await res.json()
    if (jsonData) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }
  }
  const { data } = await res.json()
  const writers = data.writers.map(writer => ({
    id: writer.id,
    writerName: writer.writer_name,
  }))
  return writers
}

const fetchCategories = async(endpoint) => {
  const res = await fetch(endpoint)
  if (!res.ok) {
    const jsonData = await res.json()
    if (jsonData) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }
  }
  const { data } = await res.json()
  const categories = data.categories.map(category => ({
    id: category.id,
    label: category.label,
    key: category.key,
  }))
  return categories
}


const getWriterName = (writerId, writers) => {
  const writer = writers.find(writer => writer.id === Number(writerId))
  return writer.writerName || "Unknown Writer"
}

const getCategoryName = (categoryId, categories) => {
  const category = categories.find(c => c.id === Number(categoryId))
  return category.label || "Unknown Category"
}


export const ArticleInfo = ({articleId}) => {
  const articleFetcher = useSWR(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/articles/${articleId}/info`, fetchArticleInfo)
  const initialData = articleFetcher.data
  const isInitialDataLoading = articleFetcher.isLoading
  const initialDataErr = articleFetcher.error
  const mutateInitialData = articleFetcher.mutate

  const writersFetcher = useSWR(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/writers`, fetchWriters)
  const writers = writersFetcher.data
  const isWritersLoading = writersFetcher.isLoading
  const writersErr = writersFetcher.error
  const mutateWriters = writersFetcher.mutate
  
  const categoriesFetcher = useSWR(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/categories/by-article/${articleId}`, fetchCategories)
  const categories = categoriesFetcher.data
  const isCategoriesLoading = categoriesFetcher.isLoading
  const categoriesErr = categoriesFetcher.error
  const mutateCategories = categoriesFetcher.mutate

  return (
    <div className="w-full bg-white p-4 rounded-lg">
      <p className="text-dark-primary font-bold text-xl mb-4">Informasi Artikel</p>
      {
        (isInitialDataLoading || isWritersLoading || isCategoriesLoading) ?
        <div className="text-amber-600 bg-amber-200 border border-amber-600/50 px-4 py-2 rounded-lg animate-pulse">
          Memuat informasi ...
        </div> :
        (initialDataErr || writersErr || categoriesErr) ?
        <div className="text-rose-600 bg-rose-200 border border-rose-600/50 px-4 py-2 rounded-lg">
          {initialDataErr?.message || writersErr?.message || categoriesErr?.message}
        </div> :
        (
          <>
            <div className="flex flex-col mb-4">
              <label className="text-dark-secondary font-semibold">Judul</label>
              <p className="text-dark-primary/80">{initialData.title}</p>
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-dark-secondary font-semibold">Penulis</label>
              <p className="text-dark-primary/80">{getWriterName(initialData.writerId, writers)}</p>
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-dark-secondary font-semibold">Kategori</label>
              <p className="text-dark-primary/80">{getCategoryName(initialData.categoryId, categories)}</p>
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-dark-secondary font-semibold">Status</label>
              <p className="text-dark-primary/80">{getCategoryName(initialData.categoryId, categories)}</p>
            </div>
            <SettingsModal
              articleId={initialData.id}
              writers={{data: writers, mutate: mutateWriters}}
              categories={{data: categories, mutate: mutateCategories}}
              initialData={{
                title: initialData.title,
                writerId: initialData.writerId,
                categoryId: initialData.categoryId,
                mutate: mutateInitialData,
              }}
              />
          </>
        )
      }
    </div>
  )
}