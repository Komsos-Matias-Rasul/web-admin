import { EditionsTableWrapper } from "@/components/editions/EditionsTableWrapper"
import { PageHeader } from "@/components/PageHeader"

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

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
