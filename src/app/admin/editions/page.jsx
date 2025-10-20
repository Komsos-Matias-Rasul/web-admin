import { EditionsTable } from "@/components/editions/EditionsTable"
import { CreateNewEditionModal } from "@/components/editions/CreateNewEditionModal"
import { PageHeader } from "@/components/PageHeader"

const EditionsPage = async () => {
  return (
    <>
      <PageHeader title="Zaitun Editions Manager" />
      <div className="text mb-2">Hello, Komsos Samara!</div>

      <div className="w-full flex justify-end items-center my-4">
        <CreateNewEditionModal />
      </div>

      <EditionsTable />
    </>
  )
}

export default EditionsPage
