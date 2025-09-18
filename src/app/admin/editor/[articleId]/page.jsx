import EditArticleClient from "./EditArticleClient"

const EditArticlePage = async ({ params }) => {
  const param = await params
  let categories = []
  let writers = []
  let dataContent, dataThumbnail, dataTitle, dataWriter, dataCategory, dataID

  try {
    let res = await fetch(`${process.env.BACKEND_URL}/api/core/categories/by-article?article=${Number(param.articleId)}`)
    if (!res.ok) {
      throw new Error(res.statusText)
    }
    const categoryData = await res.json()
    categories = categoryData.data

    res = await fetch(`${process.env.BACKEND_URL}/api/core/writers`)
    if (!res.ok) {
      throw new Error(res.statusText)
    }
    const writerData = await res.json()
    writers = writerData.data
    
    res = await fetch(`${process.env.BACKEND_URL}/api/core/articles/${Number(param.articleId)}`)
    if (!res.ok) {
      throw new Error(res.statusText)
    }
    const articleData = await res.json()
    const article = articleData.data
    dataID = Number(param.articleId)
    dataContent = JSON.parse(article.content_json)
    dataThumbnail = article.headline_img
    dataTitle = article.title || ""
    dataWriter = String(article.writer_id)
    dataCategory = String(article.category_id)
    
  } catch (err) {
    console.error(err)
  }

  const initialData = {
    categories,
    writers,
    dataContent,
    dataThumbnail,
    dataTitle,
    dataWriter,
    dataCategory,
    dataID
  }

  return <EditArticleClient initialData={initialData} />
}

export default EditArticlePage