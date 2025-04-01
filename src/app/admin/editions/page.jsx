import { EditionsTable } from "@/components/editions/EditionsTable"
import { EditEditionInfoModal, NewEditionModal, PublishEditionModal } from "@/components/editions/EditionModal"
import { getDB } from "@/lib/db"
import { Button } from "@heroui/button"
import Link from "next/link"
import { FiEye } from "react-icons/fi";
import { RiBookletFill } from "react-icons/ri";
import { PageHeader } from "@/components/PageHeader"
import Image from "next/image"

const ActionsButtonGroup = ({ editionData }) => (
  <div className="flex gap-2">
    <EditEditionInfoModal data={editionData} />
    <Button as={Link} href={`/admin/editions/${editionData.rowId}/articles`} title="Manage Articles" isIconOnly size="sm" className="bg-sky-700 text-white" startContent={<RiBookletFill size={15} />} />
    {
      editionData.publishedAt === null &&
      <PublishEditionModal editionId={editionData.rowId} />
    }
  </div>
)

const EditionsPage = async () => {
  const db = getDB()
    let editions = []
    try{
      const _res = await db.query(`
        SELECT id, title, cover_img, published_at, edition_year, edition_id as active_edition FROM editions, active_edition ORDER BY created_at DESC;`)
      if (_res.rows.length > 0){
        editions = _res.rows.map((row) => ({
          key: row.id,
          title: <p className="w-56">{row.title}</p>,
          cover_img: <Image src={row.cover_img} width={100} height={0} className="w-1/2" alt="" />,
          published_at: row.published_at && <p> { new Date(row.published_at).toLocaleString('id-US', {
            dateStyle:'medium',
          })}</p>,
          action: <ActionsButtonGroup editionData={{
            rowId: row.id,
            editionTitle: row.title,
            editionYear: row.edition_year,
            coverImg: row.cover_img,
            publishedAt: row.published_at,
          }} />,
          status: row.id === row.active_edition && <div className="flex justify-center"><div className="text-sky-400 flex items-center p-1 bg-sky-500/25 border border-sky-500 rounded-lg w-fit gap-1" title="currently active"><FiEye size={15} /><label>Active</label></div></div>
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