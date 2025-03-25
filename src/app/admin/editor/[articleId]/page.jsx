import { getDB } from "@/lib/db"
import WriteArticle from "@/components/WriteArticle"

const EditArticlePage = async ({ params }) => {
  const db = getDB()
  const param = await params
  let categories = {
    rows: [],
  }
  let dataContent, dataThumbnail, dataTitle, dataWriter, dataCategory
  try{
    categories = await db.query("SELECT * FROM categories ORDER BY id;")
    const _res = await db.query(`
      SELECT title, writer_name, headline_img, content_json, category_id FROM articles
      WHERE articles.id = $1`, [Number(param.articleId)])
    if (_res.rows.length > 0) {
      dataContent = JSON.parse(_res.rows[0].content_json)
      dataThumbnail = _res.rows[0].headline_img
      dataTitle = _res.rows[0].title || ""
      dataWriter = _res.rows[0].writer_name || ""
      dataCategory = String(_res.rows[0].category_id)
    }
  } catch(err) {
    console.error(err)
  }
  return (
    <WriteArticle
      categories={categories.rows}
      dataContent={dataContent}
      dataThumbnail={dataThumbnail}
      dataTitle={dataTitle}
      dataWriter={dataWriter}
      dataCategory={dataCategory}
      />
  )
}

export default EditArticlePage