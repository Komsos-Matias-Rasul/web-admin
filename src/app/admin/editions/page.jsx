import { EditionsTable } from "@/components/editions/EditionsTable"
import { NewEditionModal } from "@/components/editions/EditionModal"
import { PageHeader } from "@/components/PageHeader"

const EditionsPage = async () => {
  return (
    <>
      <PageHeader title="Zaitun Editions Manager" />
      <div className="text-xl mb-2">Hello, Komsos Samara!</div>

      <div className="w-full flex justify-end items-center my-4">
        <NewEditionModal />
      </div>

      <EditionsTable />
    </>
  )
}

export default EditionsPage
