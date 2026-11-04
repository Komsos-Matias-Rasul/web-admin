import { PageHeader } from "@/components/PageHeader"
import { BeritaTableWrapper } from "@/components/berita/BeritaTableWrapper"

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata = {
  title: "Samara | Berita Paroki",
  description: "Manajer Berita Paroki",
};

const BeritaPage = () => {
  return (
    <>
      <PageHeader title="Berita Paroki Manager" />
      <div className="text mb-2">Hello, Komsos Samara!</div>
      <BeritaTableWrapper />
    </>
  )
}

export default BeritaPage
