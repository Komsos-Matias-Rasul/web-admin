import EditArticleClient from "./EditArticleClient"

const EditArticlePage = async ({ params }) => {
  const param = await params
  let categories = []
  let writers = []
  let dataContent, dataThumbnail, dataTitle, dataWriter, dataCategory, dataID

  try {
    let res = await fetch(`${process.env.BACKEND_URL}/api/core/categories/by-article/${Number(param.articleId)}`)
    if (!res.ok) {
      throw new Error(res.statusText)
    }
    let jsonData = await res.json()
    categories = jsonData.data

    res = await fetch(`${process.env.BACKEND_URL}/api/core/writers`)
    if (!res.ok) {
      throw new Error(res.statusText)
    }
    jsonData = await res.json()
    writers = jsonData.data
    
    res = await fetch(`${process.env.BACKEND_URL}/api/core/articles/${Number(param.articleId)}`)
    if (!res.ok) {
      throw new Error(res.statusText)
    }
    jsonData = await res.json()
    const article = jsonData.data
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