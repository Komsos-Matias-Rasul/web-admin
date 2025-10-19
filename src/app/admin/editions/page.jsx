import { EditionsTable } from "@/components/editions/EditionsTable"
import { CreateNewEditionModal } from "@/components/editions/CreateNewEditionModal"
import { PageHeader } from "@/components/PageHeader"
import { Toaster } from 'sonner'

const EditionsPage = async () => {
  return (
    <>
      <Toaster richColors />
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
