import { EditionsTable } from "@/components/editions/EditionsTable"
import { EditEditionInfoModal, NewEditionModal } from "@/components/editions/EditionModal"
import { getDB } from "@/lib/db"
import { Button } from "@heroui/button"
import Link from "next/link"
import { FaCheck } from "react-icons/fa"
import { RiBookletFill } from "react-icons/ri";
import { PageHeader } from "@/components/PageHeader"

const ActionsButtonGroup = ({ editionData }) => (
  <div className="flex gap-2">
    <EditEditionInfoModal data={editionData} />
    <Button as={Link} href={`/admin/editions/${editionData.rowId}/articles`} title="Manage Articles" isIconOnly size="sm" className="bg-sky-700 text-white" startContent={<RiBookletFill size={15} />} />
    {
      editionData.publishedAt === null &&
      <Button title="Publish" isIconOnly size="sm" className="bg-emerald-500 text-white" startContent={<FaCheck size={15} />} />
    }
  </div>
)

const EditionsPage = async () => {
  const db = getDB()
    let editions = []
    try{
      const _res = await db.query(`
        SELECT id, title, cover_img, published_at, edition_year FROM editions ORDER BY created_at DESC;`)
      if (_res.rows.length > 0){
        editions = _res.rows.map((row) => ({
          key: row.id,
          title: <p className="w-56">{row.title}</p>,
          cover_img: row.cover_img,
          published_at: <p>{row.published_at && new Date(row.published_at).toLocaleString('id-US', {
            dateStyle:'medium',
          })}</p>,
          action: <ActionsButtonGroup editionData={{
            rowId: row.id,
            editionTitle: row.title,
            editionYear: row.edition_year,
            coverImg: row.cover_img,
            publishedAt: row.published_at,
          }} />,
        }))
      }
    } catch(err) {
      console.error(err)
    }
  return (
    <>
      <PageHeader title="Zaitun Editions Manager" />
      <div className="w-full flex justify-end items-center my-4">
        <NewEditionModal />
      </div>
      <EditionsTable rowData={editions} />
    </>
  )
}

export default EditionsPage