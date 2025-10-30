"use client"

import useSWR from "swr"
import { CreateNewEditionModal } from "./CreateNewEditionModal"
import { EditionsTable } from "./EditionsTable"
import { RiBookletFill } from "react-icons/ri";
import { FiEye } from "react-icons/fi";

import { EditEditionInfoModal } from "./EditEditionInfoModal";
import { PublishEdition } from "./PublishEdition";
import Link from "next/link";

const ActionsButtonGroup = ({ editionData }) => (
  <div className="flex gap-2 justify-center">
    <EditEditionInfoModal data={editionData} />
    <Link href={`/admin/editions/${editionData.editionId}/articles`}>
      <button
        className="bg-sky-700 text-white hover:bg-sky-600 active:bg-sky-800 p-2 rounded-lg transition-colors cursor-pointer"
        aria-label="manage"
        title="Manage articles"
        >
          <RiBookletFill size={15} />
      </button>
    </Link>
    {
      editionData.publishedAt === null &&
      <PublishEdition editionId={editionData.editionId} />
    }
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
  const editions = data.editions.map(edition => ({
    key: edition.id,
    title: <p className="w-56">{edition.title}</p>,
    thumbImg: edition.thumbImg,
    coverImg: decodeURIComponent(edition.coverImg.split("/").pop()),
    publishedAt: edition.publishedAt && <p>{new Date(edition.publishedAt).toLocaleString('id-US', {
      dateStyle:'medium',
    })}</p>,
    action: <ActionsButtonGroup editionData={{
      editionId: edition.id,
      title: edition.title,
      year: edition.year,
      publishedAt: edition.publishedAt,
    }} />,
    status: edition.id === data.activeEdition && <div className="flex justify-center"><div className="flex items-center px-2 py-1 text-xs font-semibold text-blue-primary border-2 border-blue-primary rounded-full w-fit gap-1" title="currently active"><FiEye size={15} /><label>ACTIVE</label></div></div>
  }))

  return editions
}

export const EditionsTableWrapper = () => {
  const { data, error, isLoading, mutate } = useSWR(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/editions`, fetchEditionData)

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
    <>
      <div className="w-full flex justify-end items-center my-4">
        <CreateNewEditionModal onSuccess={mutate} />
      </div>
      <EditionsTable data={data} onChange={mutate} />
    </>
  )
}