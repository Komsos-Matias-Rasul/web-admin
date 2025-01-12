import { getDB } from "@/lib/db"
import { NextResponse } from "next/server"

export const GET = async (req, res) => {
  const path = req.nextUrl.pathname.split('/')
  const slug = path[path.length - 1]
  const db = getDB()
  try {
    const article = await db.query(`
      SELECT a.id, title, slug, writer_name, created_at, thumb_img, c.label 
      FROM articles as a
      JOIN categories as c ON c.id = a.category_id
      ORDER BY category_id`)
    return NextResponse.json(article.rows)
  } catch (err) {
    console.error('Error:', err.message)
    return NextResponse.json({error: err.message}, {status: 500})
  }
}