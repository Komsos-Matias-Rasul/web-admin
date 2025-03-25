import { ArticlesTable } from "@/components/articleManager/ArticlesTable"
import { PageHeader } from "@/components/PageHeader"
import { StatusPrivate, StatusPublic } from "@/components/VisibilityStatus"
import { getDB } from "@/lib/db"
import { Button } from "@heroui/button"
import Link from "next/link"
import { AiFillEdit } from "react-icons/ai"

const ActionsButtonGroup = ({ rowId }) => (
  <div className="flex gap-2">
    <Link href={`/admin/editor/edit/${ rowId }`}>
      <Button title="Edit Article" isIconOnly size="sm" className="bg-amber-500 text-white" startContent={<AiFillEdit size={15} />}/>
    </Link>
  </div>
)

// TODO: Secure page by check if the article is exists.
const ArticleManagerPage = async ({ params }) => {
  const param = await params
  const db = getDB()
  let draftedArticle = []
  let edPublishDate
  let edTitle
  try{
    let res = await db.query(`
      SELECT a.id, a.title, writer_name, c.label as category, a.published_date,
      e.published_at as ed_publish_date, e.title as ed_title
      FROM articles a 
      JOIN categories c ON c.id=a.category_id 
      JOIN editions e on e.id= a.edition_id 
      WHERE a.edition_id = $1`, [Number(param.editionId)])
    if (res.rowCount > 0){
      edPublishDate = res.rows[0].ed_publish_date
      edTitle = res.rows[0].ed_title
      draftedArticle = res.rows.map((row) => ({
        key: row.id,
        title: <p className="w-56">{row.title}</p>,
        writer_name: row.writer_name,
        category: row.category,
        status: row.published_date ? "PUBLISHED" : "DRAFT",
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
        </div>
      </div>
      <ArticlesTable rowData={draftedArticle} />
    </>
  )
}

export default ArticleManagerPage