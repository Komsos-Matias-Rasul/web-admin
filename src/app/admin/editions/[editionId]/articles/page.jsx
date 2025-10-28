import { ArticlesTable } from "@/components/articleManager/ArticlesTable"
import { PageHeader } from "@/components/PageHeader"
import { StatusActive, StatusPrivate, StatusPublic } from "@/components/VisibilityStatus"
import { WriteArticleButton } from "./WriteArticleButton"

// TODO: Secure page by check if the article is exists.
const ArticleManagerPage = async ({ params }) => {
  const param = await params
  let edPublishDate
  let edTitle
  let isActive
  try{
    const res = await fetch(`${process.env.BACKEND_URL}/api/core/editions/${Number(param.editionId)}/info`)
    const jsonData = await res.json()
    if (!res.ok){
      return <p>Error</p>
    }
    edPublishDate = jsonData.data.published_at
    isActive = jsonData.data.active_edition === jsonData.data.id
    edTitle = jsonData.data.title
  } catch(err) {
    console.error(err)
  }

  return (
    <>
      <PageHeader title="Manage Articles" />
      <div className="flex flex-col gap-2 mt-4 py-4">
        <p>Edition Name: {edTitle}</p>
        <div className="flex gap-2 items-center">
          <label>Visibility:</label>
          { edPublishDate ? <StatusPublic /> : <StatusPrivate /> }
          { isActive && <StatusActive /> }
        </div>
        <div className="flex justify-end">
          <WriteArticleButton editionId={Number(param.editionId)} />
        </div>
      </div>
      <ArticlesTable editionId={Number(param.editionId)} />
    </>
  )
}

export default ArticleManagerPage