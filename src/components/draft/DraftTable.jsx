"use client"

import Link from "next/link";
import { AiFillEdit } from "react-icons/ai";
import useSWR from "swr";

const ActionsButtonGroup = ({ rowId }) => (
  <div className="flex gap-2">
    <Link href={`/admin/editor/${rowId}`}>
      <button
        className="bg-amber-500 text-white hover:bg-amber-400 active:bg-amber-600 p-2 rounded-lg transition-colors cursor-pointer"
        aria-label="edit"
        title="Edit article"
        >
          <AiFillEdit size={15} />
      </button>
    </Link>
  </div>
)

const fetchDraftsData = async (endpoint) => {
  const res = await fetch(endpoint)
  if (!res.ok) {
    const jsonData = await res.json()
    if (jsonData) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }
  }
  const { data } = await res.json()
  const artciles = data.articles.map((article) => ({
    key: article.id,
    title: <p className="w-56">{article.title}</p>,
    writer: article.writer,
    category: article.category,
    updated_at: <p>{new Date(article.updated_at).toLocaleString('id-US', {
      dateStyle:'short',
    })} - {new Date(article.updated_at).toLocaleTimeString('id-US', {
      timeStyle: "short",
    })}</p>,
    actions: <ActionsButtonGroup rowId={article.id} />,
  }))

  return artciles
}

export const DraftTable = () => {
  const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/drafts`, fetchDraftsData)
  if (isLoading) return (
    <div className="text-amber-600 bg-amber-200 border border-amber-600/50 px-8 py-4 rounded-lg animate-pulse">
      Loading drafts data . . .
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
          <th className="py-2 px-8">Last Update</th>
          <th className="py-2 px-8">Actions</th>
        </tr>
      </thead>
      <tbody>
        {
          data.map(articles => (
            <tr key={articles.key} className="bg-white text-dark-primary">
              <td className="pl-8 py-4 font-semibold">{articles.title}</td>
              <td className="pl-8 py-4">{articles.writer}</td>
              <td className="pl-8 py-4">{articles.category}</td>
              <td className="px-4 py-4">{articles.updated_at}</td>
              <td className="px-4 py-4">{articles.actions}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}