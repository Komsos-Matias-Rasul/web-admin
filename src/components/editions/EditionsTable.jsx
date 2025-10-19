"use client"

import useSWR from "swr";
import Image from "next/image";
import { EditEditionInfoModal, PublishEditionModal } from "./EditionModal";
import { FiEye } from "react-icons/fi";
import { RiBookletFill } from "react-icons/ri";
import Link from "next/link";

const ActionsButtonGroup = ({ editionData }) => (
  <div className="flex gap-2 justify-center">
    <EditEditionInfoModal data={editionData} />
    <Link href={`/admin/editions/${editionData.rowId}/articles`}>
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
      <PublishEditionModal editionId={editionData.rowId} />
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
    thumbnail_img: <Image src={process.env.NEXT_PUBLIC_GCLOUD_PREFIX + edition.thumbnail_img} width={100} height={0} className="w-1/2" alt="" />,
    published_at: edition.published_at && <p>{new Date(edition.published_at).toLocaleString('id-US', {
      dateStyle:'medium',
    })}</p>,
    action: <ActionsButtonGroup editionData={{
      rowId: edition.id,
      editionTitle: edition.title,
      editionYear: edition.edition_year,
      coverImg: process.env.NEXT_PUBLIC_GCLOUD_PREFIX + edition.thumbnail_img,
      publishedAt: edition.published_at,
    }} />,
    status: edition.id === data.active_edition && <div className="flex justify-center"><div className="flex items-center px-2 py-1 text-xs font-semibold text-blue-primary border-2 border-blue-primary rounded-full w-fit gap-1" title="currently active"><FiEye size={15} /><label>ACTIVE</label></div></div>
  }))

  return editions
}

export const EditionsTable = () => {
  const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/editions`, fetchEditionData)
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
          <th className="py-2 px-8 text-left">Cover</th>
          <th className="py-2 px-8 text-left">Publish Date</th>
          <th className="py-2 px-8">Action</th>
          <th className="py-2 px-8">Status</th>
        </tr>
      </thead>
      <tbody>
        {
          data.map(edition => (
            <tr key={edition.key} className="bg-white text-dark-primary">
              <td className="pl-8 py-4 font-semibold">{edition.title}</td>
              <td className="pl-8 py-4">{edition.thumbnail_img}</td>
              <td className="pl-8 py-4">{edition.published_at}</td>
              <td className="px-4 py-4">{edition.action}</td>
              <td className="px-4 py-4">{edition.status}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}