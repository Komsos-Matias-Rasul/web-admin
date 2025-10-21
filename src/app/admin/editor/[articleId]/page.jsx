import { PageHeader } from "@/components/PageHeader"
import WriteArticle from "@/components/WriteArticle"

const EditArticlePage = async ({ params }) => {
  const param = await params
  const articleId = Number(param.articleId)
  let initialData
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/core/articles/${articleId}`)
    const jsonData = await res.json()
    if (!res.ok) {
      throw new Error(`${res.status} ${jsonData.data.error} (${jsonData._id})`)
    }
    const { data } = jsonData
    const contents = JSON.parse(data.contents)
    const lastUpdate = new Date(data.updatedAt).toLocaleString('id-US', {
      dateStyle: 'long',
      timeStyle: 'short',
    })
    initialData = {
      title: data.title,
      contents,
      lastUpdate,
    }
  } catch (err) {
    console.error(err)
    return (
      <main>
        <PageHeader title="Tulis Artikel" />
        <div className="text-rose-600 bg-rose-200 border border-rose-600/50 px-8 py-4 rounded-lg">
          {err.message}
        </div>
      </main>
    )
  }
  
  return (
    <main>
      <PageHeader title="Tulis Artikel" />
      <div className="flex gap-4 text-dark-primary/75 text-lg mb-2">
        <label className="font-semibold">Judul artikel:</label>
        <p>{initialData.title}</p>
      </div>
      <div>
        <WriteArticle
          articleContents={initialData.contents}
          articleId={articleId}
          articleLastUpdate={initialData.lastUpdate}
          />
      </div>
    </main>
  )
}

export default EditArticlePage