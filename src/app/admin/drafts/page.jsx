import { DraftTable } from "@/components/draft/DraftTable"
import Link from "next/link"
import { AiFillEdit } from "react-icons/ai";
import { PublishButton } from "../../../components/draft/PublishButton";
import { PageHeader } from "@/components/PageHeader";


const ActionsButtonGroup = ({ rowId }) => (
  <div className="flex gap-2">
    <Link href={`/admin/editor/${ rowId }`}>
      <button
        className="bg-amber-500 text-white hover:bg-amber-400 active:bg-amber-600 p-2 rounded-lg transition-colors cursor-pointer"
        aria-label="edit"
        title="Edit article"
        >
          <AiFillEdit size={15} />
      </button>
    </Link>
    <PublishButton rowId={rowId} />
  </div>
)

const ArticlesPage = async () => {
  let draftedArticle = []
  try{
    const res = await fetch(`${process.env.BACKEND_URL}/api/core/drafts`)
    if (!res.ok){
      throw new Error(res.statusText)
    }
    const draftData = await res.json()
    if (draftData.data.length > 0){
      draftedArticle = draftData.data.map((row) => ({
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
      <div className="mb-4">
        <PageHeader title="Article Drafts" />
      </div>
      <DraftTable rowData={draftedArticle} />
    </>
  )
}

export default ArticlesPage