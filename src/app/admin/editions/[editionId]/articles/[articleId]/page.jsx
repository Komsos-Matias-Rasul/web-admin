import { ArticleReader } from "@/components/articleManager/ArticleReader"
import { ArticleInfo } from "@/components/articleManager/ArticleInfo"
import { ImagePreview } from "@/components/articleManager/ImagePreview"
import { DeleteArticle } from "@/components/articleManager/DeleteArticle"

export const metadata = {
  title: "Samara | Editorial - Info Artikel",
  description: "Samara | Editorial - Info Artikel",
};

const EditArticlePage = async ({ params }) => {
  const param = await params
  const articleId = Number(param.articleId)
  const editionId = Number(param.editionId)

  return (
    <main className="flex gap-4">
    <div className="w-3/5">
      <ArticleReader articleId={articleId}/>
    </div>
    <div className="flex flex-col gap-4 w-2/5">
      <ArticleInfo articleId={articleId} />
      <ImagePreview articleId={articleId} />
      <DeleteArticle articleId={articleId} editionId={editionId} />
    </div>
  </main>
  )
}

export default EditArticlePage