"use client"

import useSWR from "swr"
import { CreateNewBeritaModal } from "./CreateNewBerita";
import { BeritaTable } from "./BeritaTable";
import { DeleteBerita } from "./DeleteBerita";

const ActionsButtonGroup = ({ beritaData }) => (
  <div className="flex gap-2 justify-center">
    <DeleteBerita beritaId={beritaData.id} />
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
  const editions = data.map(berita => ({
    key: berita.id,
    title: <p className="w-56">{berita.title}</p>,
    thumbImg: berita.thumbImg,
    publishStart: berita.publishStart && <p>{new Date(berita.publishStart).toLocaleString('id-US', {
      dateStyle:'medium',
    })}</p>,
    publishEnd: berita.publishEnd && <p>{new Date(berita.publishEnd).toLocaleString('id-US', {
      dateStyle:'medium',
    })}</p>,
    action: <ActionsButtonGroup beritaData={{
      id: berita.id,
      publishStart: berita.publishStart,
      publishEnd: berita.publishEnd,
    }} />,
  }))

  return editions
}

export const BeritaTableWrapper = () => {
  const { data, error, isLoading, mutate } = useSWR(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/beritas`, fetchEditionData)

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
        <CreateNewBeritaModal onSuccess={mutate} />
      </div>
      <BeritaTable data={data} onChange={mutate} />
    </>
  )
}