"use client"

import Link from "next/link";
import { AiFillEdit } from "react-icons/ai";
import useSWR from "swr";
import { PublishButton } from "../draft/PublishButton";

const ActionsButtonGroup = ({ editionId, articleId, onReload, isPublished }) => (
  <div className="flex gap-2 justify-center">
    <Link href={`/admin/editions/${ editionId }/articles/${ articleId }`}>
      <button
        className="bg-amber-500 text-white hover:bg-amber-400 active:bg-amber-600 p-2 rounded-lg transition-colors cursor-pointer"
        aria-label="edit"
        title="Edit artikel"
      >
        <AiFillEdit size={15} />
      </button>
    </Link>
    { !isPublished && <PublishButton rowId={articleId} onSuccess={onReload} /> }
  </div>
)

const fetchEditionData = async (endpoint) => {
  const res = await fetch(endpoint)
  if (!res.ok) {
    const jsonData = await res.json()
    if (jsonData) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }
  }
  const { data } = await res.json()
  const articles = data.articles.map(article => ({
    key: article.id,
    title: article.title,
    writer: article.writer,
    category: article.category,
    status: article.publishedAt ? "PUBLISHED" : "DRAFT",
  }))

  return articles
}

export const ArticlesTable = ({ editionId }) => {
  const { data, error, isLoading, mutate } = useSWR(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/editions/${editionId}/articles`, fetchEditionData)
  if (isLoading) return (
    <div className="text-amber-600 bg-amber-200 border border-amber-600/50 px-8 py-4 rounded-lg animate-pulse">
      Loading edition data . . .
    </div>
  )
  if (error) return (
    <div className="text-rose-600 bg-rose-200 border border-rose-600/50 px-8 py-4 rounded-lg">
      {error.message}
    </div>
  )
  return (
    <table className="w-full rounded-lg overflow-hidden">
      <thead>
        <tr className="text-white uppercase text-sm bg-blue-primary">
          <th className="py-2 px-8 text-left">Title</th>
          <th className="py-2 px-8 text-left">Writer</th>
          <th className="py-2 px-8 text-left">Category</th>
          <th className="py-2 px-8">Status</th>
          <th className="py-2 px-8">Actions</th>
        </tr>
      </thead>
      <tbody>
        {
          data.map(article => (
            <tr key={article.key} className="bg-white text-dark-primary">
              <td className="pl-8 py-4 font-semibold">{article.title}</td>
              <td className="pl-8 py-4">{article.writer}</td>
              <td className="pl-8 py-4">{article.category}</td>
              <td className="px-4 py-4">{article.status}</td>
              <td className="px-4 py-4">
                <ActionsButtonGroup
                  editionId={editionId}
                  articleId={article.key}
                  onReload={mutate}
                  isPublished={article.status === "PUBLISHED"}
                />
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}