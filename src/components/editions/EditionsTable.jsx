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

const columns = [
  {
    key: "title",
    label: "TITLE",
  },
  {
    key: "cover_img",
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

export const EditionsTable = ({ rowData }) => {
  return (
    <Table isStriped>
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key} className="text-center">{column.label}</TableColumn>}
      </TableHeader>
      <TableBody emptyContent="Article Done. Me go home :3" items={rowData}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
} 