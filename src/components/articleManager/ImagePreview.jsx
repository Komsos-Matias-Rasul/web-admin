'use client'
import Image from "next/image"
import useSWR from "swr"
import { UpdateImageFileNameModal } from "./UpdateImageFileNameModal"

const fetchArticleCover = async (endpoint) => {
  const res = await fetch(endpoint)
  if (!res.ok) {
    const jsonData = await res.json()
    if (jsonData) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }
  }
  const { data } = await res.json()

  const splitCoverImg = data.coverImg.split("/")
  const coverImgFileNameExt = splitCoverImg[splitCoverImg.length - 1]
  const splitCoverImgFileNameExt = coverImgFileNameExt.split(".")
  const coverImgFileName = splitCoverImgFileNameExt[0]
  const fileExt = splitCoverImgFileNameExt[1]

  const cover = {
    articleId: data.articleId,
    coverImg: data.coverImg,
    thumbnailImg: data.thumbnailImg,
    fileName: coverImgFileName,
    fileExt: fileExt
  }
  return cover
}

export const ImagePreview = ({articleId}) => {

  const {data, isLoading, error} = useSWR(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/articles/${articleId}/cover`, fetchArticleCover)
  if (isLoading) {
    return (
    <div className="text-amber-600 bg-amber-200 border border-amber-600/50 px-4 py-2 rounded-lg animate-pulse">
      Memuat informasi ...
    </div>
  )}
  return (
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
      <UpdateImageFileNameModal
        articleId={articleId}
        initialFileName={data.fileName}
        fileExt={data.fileExt}
        fullPath={data.coverImg}
      />
    </div>
  )
}