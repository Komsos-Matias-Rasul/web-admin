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
];

export const EditionsTable = ({ rowData }) => {
  return (
    <Table isStriped aria-label="Example table with dynamic content">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
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