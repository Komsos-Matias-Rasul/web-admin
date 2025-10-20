"use client"
import { ArticleInfo } from "@/components/articleManager/ArticleInfo"
import { ArticleReader } from "@/components/articleManager/ArticleReader"
import { ImagePreview } from "@/components/articleManager/ImagePreview"

const EditArticleClient = ({ articleId }) => {

  return (
    <main className="flex gap-4">
      {/*
        <div className="w-full">
          <ImageInput img={initialData?.dataThumbnail ? (process.env.NEXT_PUBLIC_GCLOUD_PREFIX + initialData?.dataThumbnail) : null} articleId={initialData?.dataID} />
        </div>
      </div> */}
      <div className="w-3/5">
        <ArticleReader articleId={articleId}/>
      </div>
      {/* <WriteArticle
        dataID={initialData?.dataID}
        categories={initialData?.categories}
        dataContent={initialData?.dataContent}
        dataTitle={currentTitle}
        dataWriter={currentWriter}
        dataCategory={currentCategory}
      /> */}
      <div className="flex flex-col gap-4 w-2/5">
        <ArticleInfo articleId={articleId} />
        <ImagePreview articleId={articleId} />
      </div>
      {/* <div className="flex flex-col gap-2">
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
      </div> */}
    </main>
  )
}

export default EditArticleClient