import { getDB } from "@/lib/db"
import WriteArticle from "@/components/WriteArticle"
import { Button } from "@heroui/button"

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
    <main>
      <WriteArticle
        categories={categories.rows}
        dataContent={dataContent}
        dataThumbnail={dataThumbnail}
        dataTitle={dataTitle}
        dataWriter={dataWriter}
        dataCategory={dataCategory}
        />
      <div className="flex flex-col gap-2">
        <div className="border border-rose-600 bg-rose-600/20 rounded-lg p-3 text-rose-700">
          <h3 className="text-xl font-semibold">Archive Article</h3>
          <p className="">This action will tag the article as archived so it will no longer shows up in the draft neither on public. You can change this later.</p>
          <div className="flex justify-end items-center">
            <Button color="danger">Archive</Button>
          </div>
        </div>
        <div className="border border-rose-600 bg-rose-600/20 rounded-lg p-3 text-rose-700">
          <h3 className="text-xl font-semibold">Delete Article</h3>
          <p className="">This action will permanently delete the article. This action is irreversible.</p>
          <div className="flex justify-end items-center">
            <Button color="danger">Delete</Button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default EditArticlePage