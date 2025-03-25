import { getDB } from "@/lib/db"
import { DraftTable } from "@/components/draft/DraftTable"
import Link from "next/link"
import { Button } from "@heroui/button"
import { AiFillEdit } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";


const ActionsButtonGroup = ({ rowId }) => (
  <div className="flex gap-2">
    <Link href={`/admin/editor/edit/${ rowId }`}>
      <Button title="Edit Article" isIconOnly size="sm" className="bg-amber-500 text-white" startContent={<AiFillEdit size={15} />}/>
    </Link>
    <Button title="Publish" isIconOnly size="sm" className="bg-emerald-500 text-white" startContent={<FaCheck size={15} />} />
  </div>
)

const ArticlesPage = async () => {
  const db = getDB()
  let draftedArticle = []
  try{
    const _res = await db.query(`
      SELECT articles.id, title, writer_name, c.label as category, updated_at FROM articles
      JOIN categories c ON c.id=articles.category_id
      WHERE published_date is null;`)
    if (_res.rows.length > 0){
      draftedArticle = _res.rows.map((row) => ({
        key: row.id,
        title: <p className="w-56">{row.title}</p>,
        writer_name: row.writer_name,
        category: row.category,
        updated_at: <p>{new Date(row.updated_at).toLocaleString('id-US', {
          dateStyle:'short',
        })} - {new Date(row.updated_at).toLocaleTimeString('id-US', {
          timeStyle: "short",
        })}</p>,
        action: <ActionsButtonGroup rowId={row.id} />,
      }))
    }
  } catch(err) {
    console.error(err)
  }
  return (
    <>
      <div className="w-full flex justify-between items-center mb-4">
        <h1>Drafts</h1>
      </div>
      <DraftTable rowData={draftedArticle} />
    </>
  )
}

export default ArticlesPage