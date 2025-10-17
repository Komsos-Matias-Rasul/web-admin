"use client"

import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import Link from "next/link";
import { AiFillEdit } from "react-icons/ai";
import useSWR from "swr";

const columns = [
  {
    key: "title",
    label: "TITLE",
  },
  {
    key: "writer",
    label: "WRITER",
  },
  {
    key: "category",
    label: "CATEGORY",
  },
  {
    key: "status",
    label: "STATUS",
  },
  {
    key: "action",
    label: "ACTION",
  },
];

const ActionsButtonGroup = ({ rowId }) => (
  <div className="flex gap-2">
    <Link href={`/admin/editor/${ rowId }`}>
      <Button title="Edit Article" isIconOnly size="sm" className="bg-amber-500 text-white" startContent={<AiFillEdit size={15} />}/>
    </Link>
  </div>
)

const fetcher = (...args) => fetch(...args)
  .then(res => res.json())
  .then(jsonData => {
    const { data } = jsonData
    console.log(data)
    let rows = []
    if (data.length > 0) {
      rows = data.map(article => ({
        key: article.id,
        title: article.title,
        writer: article.writer,
        category: article.category,
        status: article.published_at ? "PUBLISHED" : "DRAFT",
        action: <ActionsButtonGroup rowId={article.id} />,
      }))
    }
    return rows
  })

export const ArticlesTable = ({ editionId }) => {
  const { data, error, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/core/editions/${editionId}/articles`, fetcher)
  return (
    <Table isStriped aria-label="Example table with dynamic content">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
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