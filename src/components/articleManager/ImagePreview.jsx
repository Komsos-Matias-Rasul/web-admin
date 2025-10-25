'use client'
import Image from "next/image"
import useSWR from "swr"
import { RenameModal } from "./RenameModal"
import { useState } from "react"
import { UploadCoverModal } from "./UploadCoverModal"
import Link from "next/link"

const fetchArticleCover = async (endpoint) => {
  const res = await fetch(endpoint)
  if (!res.ok) {
    const jsonData = await res.json()
    if (jsonData) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }
  }
  const { data } = await res.json()

  const splitCoverImg = data.coverImg.split("/").pop()
  const fileName = decodeURIComponent(splitCoverImg)

  const cover = {
    articleId: data.articleId,
    coverImg: data.coverImg,
    thumbnailImg: data.thumbnailImg,
    fileName,
  }
  return cover
}

export const ImagePreview = ({articleId}) => {
  const {data, isLoading, error, mutate} = useSWR(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/articles/${articleId}/cover`, fetchArticleCover)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
  if (isLoading) {
    return (
      <div className="w-full p-4 bg-white rounded-lg">
        <p className="text-dark-primary font-bold text-xl mb-4">Headline</p>
        <div className="text-amber-600 bg-amber-200 border border-amber-600/50 px-4 py-2 rounded-lg animate-pulse">
          Memuat informasi ...
        </div>
      </div>
  )}
  if (error) {
    return (
      <div className="w-full p-4 bg-white rounded-lg">
        <p className="text-dark-primary font-bold text-xl mb-4">Headline</p>
        <div className="text-rose-600 bg-rose-200 border border-rose-600/50 px-4 py-2 rounded-lg">
          {error.message}
        </div>
      </div>
  )}

  return (
    <>
      <div className="w-full p-4 bg-white rounded-lg">
        <p className="text-dark-primary font-bold text-xl mb-4">Headline</p>
        <Image
          id="headline-img"
          priority
          src={`${process.env.NEXT_PUBLIC_GCLOUD_PREFIX + data.coverImg}`}
          width={400}
          height={0}
          alt=""
          />
        <button
            className="my-4 w-full text-sm bg-blue-primary text-white font-bold hover:bg-blue-400 active:bg-sky-700 px-4 py-2 rounded-lg transition-colors cursor-pointer"
            aria-label="upload headline"
            title="Upload Headline"
            onClick={() => setIsModalOpen(true)}
          >
          Unggah Headline
        </button>
        <div className="flex flex-col">
          <div className="flex gap-2">
            <label className="text-dark-secondary font-semibold">Nama <i>file</i>:</label>
            <button
              title="Update filename"
              className="px-2 text-sm rounded text-white bg-blue-primary hover:bg-blue hover:bg-blue-400 active:bg-blue-600 transition-colors cursor-pointer"
              onClick={() => setIsRenameModalOpen(true)}
            >
              Perbarui
            </button>
          </div>
          <Link
            target="_blank"
            href={process.env.NEXT_PUBLIC_GCLOUD_PREFIX + data.coverImg}
            title="Open image"
            className="text-dark-primary/80 text-sm hover:text-blue-primary hover:underline">
              {`${data.fileName}`}&#8690;
          </Link>
        </div>
        <RenameModal
          articleId={articleId}
          initialFileName={data.fileName}
          isModalOpen={isRenameModalOpen}
          setIsModalOpen={setIsRenameModalOpen}
          onSuccess={mutate}
        />
      </div>

      <UploadCoverModal
        articleId={articleId}
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onSuccess={mutate}
        />
    </>
  )
}