"use client"
import { useState } from "react"
import WriteArticle from "@/components/WriteArticle"
import { ArchiveArticleButton, DeleteArticleButton } from "@/components/articleManager/ArticleButtons"
import { ImageInput } from "@/components/ThumbnailUploader"
import { SettingsModal } from "@/components/articleManager/ArticleModals"

const EditArticleClient = ({ initialData }) => {
  const [currentTitle, setCurrentTitle] = useState(initialData?.dataTitle || "")
  const [currentWriter, setCurrentWriter] = useState(initialData?.dataWriter || "")
  const [currentCategory, setCurrentCategory] = useState(initialData?.dataCategory || "")

  const handleSettingsSaved = (updatedData) => {
    setCurrentTitle(updatedData.title)
    setCurrentWriter(updatedData.writer)
    setCurrentCategory(updatedData.category)
  }

  const getWriterName = (writerId) => {
    const writer = initialData?.writers?.find(writer => writer.id === Number(writerId))
    return writer?.writer_name || "Unknown Writer"
  }

  const getCategoryName = (categoryId) => {
    const category = initialData?.categories?.find(category => category.id === Number(categoryId))
    return category?.label || "Unknown Category"
  }

  return (
    <main>
      <div className="flex w-full items-end gap-4">
        <div className="w-3/5 shrink-0">
          <div className="bg-white p-4 rounded-lg shadow-lg border space-y-2">
            <SettingsModal
              dataID={initialData?.dataID}
              categories={initialData?.categories ?? []}
              writers={initialData?.writers ?? []}
              dataTitle={currentTitle}
              dataWriter={currentWriter}
              dataCategory={currentCategory}
              onSettingsSaved={handleSettingsSaved}
            />
            <h1 className="text-lg font-semibold">Basic Information</h1>
            <div className="flex">
              <label className="w-1/3 shrink-0">Title</label>
              <p><span className="select-none">: </span>{currentTitle}</p>
            </div>
            <div className="flex">
              <label className="w-1/3 shrink-0">Writer</label>
              <p><span className="select-none">: </span>{getWriterName(currentWriter)}</p>
            </div>
            <div className="flex">
              <label className="w-1/3 shrink-0">Category</label>
              <p><span className="select-none">: </span>{getCategoryName(currentCategory)}</p>
            </div>
            <div className="flex">
              <label className="w-1/3 shrink-0">Status</label>
              <p><span className="select-none">: </span>PUBLISHED | DRAFT | ARCHIVED</p>
            </div>
          </div>
        </div>
        <div className="w-full">
          <ImageInput img={initialData?.dataThumbnail} articleId={initialData?.dataID} />
        </div>
      </div>
      <WriteArticle
        dataID={initialData?.dataID}
        categories={initialData?.categories}
        dataContent={initialData?.dataContent}
        dataThumbnail={initialData?.dataThumbnail}
        dataTitle={currentTitle}
        dataWriter={currentWriter}
        dataCategory={currentCategory}
      />
      <div className="flex flex-col gap-2">
        <div className="border border-rose-600 bg-rose-600/20 rounded-lg p-3 text-rose-700">
          <h3 className="text-xl font-semibold">Archive</h3>
          <p>This action will tag the article as archived so it will no longer shows up in the draft neither on public. You can change this later.</p>
          <div className="flex justify-end items-center">
            <ArchiveArticleButton articleId={initialData?.dataID} />
          </div>
        </div>
        <div className="border border-rose-600 bg-rose-600/20 rounded-lg p-3 text-rose-700">
          <h3 className="text-xl font-semibold">Permanently Delete</h3>
          <p>This action will permanently delete the article. This action is irreversible.</p>
          <div className="flex justify-end items-center">
            <DeleteArticleButton articleId={initialData?.dataID} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default EditArticleClient