import { PageHeader } from "@/components/PageHeader"
import { BeritaTableWrapper } from "@/components/berita/BeritaTableWrapper"

export const metadata = {
  title: "Samara | Berita Paroki",
  description: "Manajer Berita Paroki",
};

const EditionsPage = async () => {
  return (
    <>
      <PageHeader title="Berita Paroki Manager" />
      <div className="text mb-2">Hello, Komsos Samara!</div>
      <BeritaTableWrapper />
    </>
  )
}

export default EditionsPage
