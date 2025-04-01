import { getDB } from "@/lib/db"
import { NextResponse } from "next/server"

export const GET = async (req, res) => {
  const params = req.nextUrl.searchParams
  let editionId = params.get('edition')
  if (!editionId) return NextResponse.json("missing required parameters", {status: 400})
  editionId = Number(editionId)

  const db = getDB()
  try {
      const article = await db.query("SELECT * FROM categories WHERE edition_id = $1 ORDER BY id;", [editionId])
      console.log(article.rows)
      return NextResponse.json(article.rows)
    } catch (err) {
      console.error('Error:', err.message)
      return NextResponse.json({error: err.message}, {status: 500})
    }
}