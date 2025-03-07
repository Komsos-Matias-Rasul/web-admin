import { getDB } from "@/lib/db"
import WriteArticle from "@/components/WriteArticle"


const WriteArticlePage = async () => {
  const db = getDB()
  let categories = {
    rows: [],
  }
  try{
    categories = await db.query("SELECT * FROM categories ORDER BY id;")
  } catch(err) {
    console.error(err)
  }
  return (
    <WriteArticle
      categories={categories.rows}
      />
  )
}

export default WriteArticlePage