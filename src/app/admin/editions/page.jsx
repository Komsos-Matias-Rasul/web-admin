import { EditionsTableWrapper } from "@/components/editions/EditionsTableWrapper"
import { PageHeader } from "@/components/PageHeader"

export const metadata = {
  title: "Samara | Zaitun - Edisi",
  description: "Samara | Zaitun - Edisi",
};

const EditionsPage = async () => {
  return (
    <>
      <PageHeader title="Zaitun Editions Manager" />
      <div className="text mb-2">Hello, Komsos Samara!</div>
      <EditionsTableWrapper />
    </>
  )
}

export default EditionsPage
