import { getDB } from "@/lib/db"
import { NextResponse } from "next/server"

export const POST = async (req, res) => {
  const path = req.nextUrl.pathname.split('/')
  const articleId = path[path.length - 1]
  const conn = getDB()
  try {
    let queryResponse = await conn.query("SELECT id FROM articles WHERE id=$1", [Number(articleId)])
    if (queryResponse.rows.length < 1) {
      console.error(`sql: article with id ${articleId} not found`)
      return NextResponse.json("article not found", { status: 404 })
    }
    queryResponse = await conn.query(
      `UPDATE articles
      SET published_date = $1, archived_date = null
      WHERE id = $2
      RETURNING 1;
      `, [new Date().toISOString(), Number(articleId)])
    if (queryResponse.rows.length < 1) {
      throw new Error("article published unsuccessful", { status: 500 })
    }
    return NextResponse.json("article published successfully", {status: 202})
  } catch (err) {
    console.error(err)
    return NextResponse.json({error: err.message}, {status: 500})
  }
}