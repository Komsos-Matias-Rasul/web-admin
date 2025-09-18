import { ArticlesTable } from "@/components/articleManager/ArticlesTable"
import { PageHeader } from "@/components/PageHeader"
import { StatusActive, StatusPrivate, StatusPublic } from "@/components/VisibilityStatus"
import { Button } from "@heroui/button"
import Link from "next/link"
import { AiFillEdit } from "react-icons/ai"
import { WriteArticleButton } from "./WriteArticleButton"

const ActionsButtonGroup = ({ rowId }) => (
  <div className="flex gap-2">
    <Link href={`/admin/editor/${ rowId }`}>
      <Button title="Edit Article" isIconOnly size="sm" className="bg-amber-500 text-white" startContent={<AiFillEdit size={15} />}/>
    </Link>
  </div>
)

// TODO: Secure page by check if the article is exists.
const ArticleManagerPage = async ({ params }) => {
  const param = await params
  let draftedArticle = []
  let edPublishDate
  let edTitle
  let isActive
  try{

    const res = await fetch(`${process.env.BACKEND_URL}/api/core/editions/${Number(param.editionId)}/articles`)
    const data = await res.json()
    if (!res.ok){
      throw new Error(res.statusText)
    }
    if (data.data.articles.length > 0){
      edPublishDate = data.data.edition_publish_date
      isActive = data.data.active_edition === data.data.edition_id
      edTitle = data.data.edition_title

      draftedArticle = data.data.articles.map((row) => ({
        key: row.id,
        title: <p className="">{row.title}</p>,
        writer: <p className="">{row.writer}</p>,
        category: row.category,
        status: row.article_published_date ? "PUBLISHED" : "DRAFT",
        action: <ActionsButtonGroup rowId={row.id} />,
      }))
    }
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
      <ArticlesTable rowData={draftedArticle} />
    </>
  )
}

export default ArticleManagerPage