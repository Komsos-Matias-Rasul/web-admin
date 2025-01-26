import { getDB } from "@/lib/db"
import { NextResponse } from "next/server"

const formatTitleToSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, '')
    .trim()
    .replace(/\s+/g, '-')
}

export const POST = async (req, res) => {
  const data = await req.json()
  const slug = formatTitleToSlug(data.title)
  let id
  try{
    const pool = getDB()
    const q = `
      INSERT INTO articles (title, slug, category_id, writer_id, content_json, ads_json, thumb_img, headline_img, created_at, writer_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id;
    `
    const values = [data.title, slug, data.category, 1, JSON.stringify(data.content), JSON.stringify({ side: [], below: "" }), "null", "null", new Date().toISOString(), data.writer]
    const result = await pool.query(q, values)
    id = result.rows[0].id
  }
  catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
  return NextResponse.json({ slug }, { status: 201 })
}