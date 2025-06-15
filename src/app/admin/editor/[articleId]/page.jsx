import { getDB } from "@/lib/db"
import EditArticleClient from "./EditArticleClient"

const EditArticlePage = async ({ params }) => {
  const db = getDB()
  const param = await params
  let categories = { rows: [] }
  let writers = { rows: [], writer_name: [] }
  let dataContent, dataThumbnail, dataTitle, dataWriter, dataCategory, dataID

  try {
    categories = await db.query("SELECT * FROM categories WHERE edition_id = (select edition_id FROM articles a WHERE a.id = $1 ) OR categories.id=1 ORDER BY id", [Number(param.articleId)])
    writers = await db.query("SELECT * FROM writers ORDER BY id")
    const _res = await db.query(`
      SELECT title, writer_id ,headline_img, content_json, category_id FROM articles
      WHERE articles.id = $1`, [Number(param.articleId)])
    
    if (_res.rows.length > 0) {
      dataID = Number(param.articleId)
      dataContent = JSON.parse(_res.rows[0].content_json)
      dataThumbnail = _res.rows[0].headline_img
      dataTitle = _res.rows[0].title || ""
      dataWriter = String(_res.rows[0].writer_id)
      dataCategory = String(_res.rows[0].category_id)
    }
  } catch (err) {
    console.error(err)
  }

  const initialData = {
    categories: categories?.rows.map((category) => category) ?? [],
    writers: writers?.rows.map((writer) => writer) ?? [],
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