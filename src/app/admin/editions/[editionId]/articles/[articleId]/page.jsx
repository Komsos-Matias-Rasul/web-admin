import { ArticleReader } from "@/components/articleManager/ArticleReader"
import { ArticleInfo } from "@/components/articleManager/ArticleInfo"
import { ImagePreview } from "@/components/articleManager/ImagePreview"

const EditArticlePage = async ({ params }) => {
  const param = await params
  const articleId = Number(param.articleId)

  return (
    <main className="flex gap-4">
    <div className="w-3/5">
      <ArticleReader articleId={articleId}/>
    </div>
    <div className="flex flex-col gap-4 w-2/5">
      <ArticleInfo articleId={articleId} />
      <ImagePreview articleId={articleId} />
    </div>
  </main>
  )
}

export default EditArticlePage