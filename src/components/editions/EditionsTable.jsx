"use client"

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";

import {
  Spinner,
} from "@heroui/spinner"
import useSWR from "swr";
import Image from "next/image";
import { EditEditionInfoModal, PublishEditionModal } from "./EditionModal";
import { Button } from "@heroui/button";
import { FiEye } from "react-icons/fi";
import { RiBookletFill } from "react-icons/ri";
import Link from "next/link";

const columns = [
  {
    key: "title",
    label: "TITLE",
  },
  {
    key: "thumbnail_img",
    label: "COVER",
  },
  {
    key: "published_at",
    label: "PUBLISH DATE",
  },
  {
    key: "action",
    label: "ACTION",
  },
  {
    key: "status",
    label: "STATUS",
  }
];

const ActionsButtonGroup = ({ editionData }) => (
  <div className="flex gap-2">
    <EditEditionInfoModal data={editionData} />
    <Button
      as={Link}
      href={`/admin/editions/${editionData.rowId}/articles`}
      title="Manage Articles"
      isIconOnly
      size="sm"
      className="bg-sky-700 text-white"
      startContent={<RiBookletFill size={15} />} />
    {
      editionData.publishedAt === null &&
      <PublishEditionModal editionId={editionData.rowId} />
    }
  </div>
)

const fetcher = (...args) => fetch(...args)
  .then(res => res.json())
  .then(resJson => {
    const {data} = resJson
    let rows = []
    if (data.editions.length > 0) {
      rows = data.editions.map(edition => ({
        key: edition.id,
        title: <p className="w-56">{edition.title}</p>,
        thumbnail_img: <Image src={process.env.NEXT_PUBLIC_GCLOUD_PREFIX + edition.thumbnail_img} width={100} height={0} className="w-1/2" alt="" />,
        published_at: edition.published_at && <p>{new Date(edition.published_at).toLocaleString('id-US', {
          dateStyle:'medium',
        })}</p>,
        action: <ActionsButtonGroup editionData={{
          rowId: edition.id,
          editionTitle: edition.title,
          editionYear: edition.edition_year,
          coverImg: process.env.NEXT_PUBLIC_GCLOUD_PREFIX + edition.thumbnail_img,
          publishedAt: edition.published_at,
        }} />,
        status: edition.id === data.active_edition && <div className="flex justify-center"><div className="text-sky-400 flex items-center p-1 bg-sky-500/25 border border-sky-500 rounded-lg w-fit gap-1" title="currently active"><FiEye size={15} /><label>Active</label></div></div>
      }))
    }
    return rows
  })

export const EditionsTable = () => {
  // const [editionData, setEditionData] = useState([])
  const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/editions`, fetcher)
  return (
    <Table isStriped>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key} className="text-center">{column.label}</TableColumn>}
      </TableHeader>
      <TableBody
        emptyContent="Article Done. Me go home :3"
        items={data || []}
        isLoading={isLoading}
        loadingContent={<Spinner color="default" size="lg"/>}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}