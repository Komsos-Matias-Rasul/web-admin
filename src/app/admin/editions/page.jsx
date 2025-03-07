import { EditionsTable } from "@/components/editions/EditionsTable"
import { EditEditionInfoModal, NewEditionModal } from "@/components/editions/EditionModal"
import { getDB } from "@/lib/db"
import { Button } from "@heroui/button"
import Link from "next/link"
import { FaCheck } from "react-icons/fa"
import { RiBookletFill } from "react-icons/ri";

const ActionsButtonGroup = ({ editionData }) => (
  <div className="flex gap-2">
    <EditEditionInfoModal data={editionData} />
    <Button title="Manage Articles" isIconOnly size="sm" className="bg-sky-700 text-white" startContent={<RiBookletFill size={15} />} />
    <Button title="Publish" isIconOnly size="sm" className="bg-emerald-500 text-white" startContent={<FaCheck size={15} />} />
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
            coverImg: row.cover_img
          }} />,
        }))
      }
    } catch(err) {
      console.error(err)
    }
  return (
    <>
      <div className="w-full flex justify-between items-center mb-4">
        <h1>Editions</h1>
        <NewEditionModal />
      </div>
      <EditionsTable rowData={editions} />
    </>
  )
}

export default EditionsPage