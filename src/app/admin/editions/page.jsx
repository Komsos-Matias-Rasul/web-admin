import { EditionsTable } from "@/components/editions/EditionsTable"
import { EditEditionInfoModal, NewEditionModal, PublishEditionModal } from "@/components/editions/EditionModal"
import { getDB } from "@/lib/db"
import { Button } from "@heroui/button"
import Link from "next/link"
import { FiEye } from "react-icons/fi";
import { RiBookletFill } from "react-icons/ri";
import { PageHeader } from "@/components/PageHeader"
import Image from "next/image"
import { cookies } from "next/headers"; // <-- Tambahkan ini

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
  const db = getDB();
  const cookieStore = cookies();
  // const userId = cookieStore.get("user_id")?.value; 

  let username = [];
  let editions = [];

  try {
    // if (userId) {
    //   const userRes = await db.query('SELECT username FROM users WHERE id = $1', [userId]);
    //   if (userRes.rows.length > 0) {
    //     username = userRes.rows[0].username;
    //   }
    // }

    const _res = await fetch(`${process.env.BACKEND_URL}/api/core/editions`)
    const data = await _res.json()
    if (!_res.ok) {
      throw new Error(_res.statusText)
    }
    if (data.data.editions.length > 0){
      editions = data.data.editions.map((row) => ({
        key: row.id,
        title: <p className="w-56">{row.title}</p>,
        thumbnail_img: <Image src={row.thumbnail_img} width={100} height={0} className="w-1/2" alt="" />,
        published_at: row.published_at && <p>{new Date(row.published_at).toLocaleString('id-US', {
          dateStyle:'medium',
        })}</p>,
        action: <ActionsButtonGroup editionData={{
          rowId: row.id,
          editionTitle: row.title,
          editionYear: row.edition_year,
          coverImg: row.cover_img,
          publishedAt: row.published_at,
        }} />,
        status: row.id === data.data.active_edition && <div className="flex justify-center"><div className="text-sky-400 flex items-center p-1 bg-sky-500/25 border border-sky-500 rounded-lg w-fit gap-1" title="currently active"><FiEye size={15} /><label>Active</label></div></div>
      }))
    }
  } catch(err) {
    console.error(err);
  }

  return (
    <>
      <PageHeader title="Zaitun Editions Manager" />
      <div className="text-xl mb-2">Hello, {username}!</div>

      <div className="w-full flex justify-end items-center my-4">
        <NewEditionModal />
      </div>

      <EditionsTable rowData={editions} />
    </>
  )
}

export default EditionsPage
