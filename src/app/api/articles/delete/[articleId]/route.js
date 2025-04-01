import { getDB } from "@/lib/db"
import { NextResponse } from "next/server"

export const DELETE = async (req, res) => {
  const path = req.nextUrl.pathname.split('/')
  const articleId = path[path.length - 1]
  const db = getDB()
  try {
    let queryResponse = await db.query("SELECT id FROM articles WHERE id=$1", [Number(articleId)])
    if (queryResponse.rows.length < 1) {
      console.error(`sql: article with id ${articleId} not found`)
      return NextResponse.json("article not found", { status: 404 })
    }
    queryResponse = await db.query(`
      DELETE FROM articles
      WHERE id = $1
      RETURNING 1`, [Number(articleId)])
    if (queryResponse.rows.length < 1) {
      throw new Error("article archived unsuccessful", { status: 500 })
    }
    return NextResponse.json("article deleted successfully", {status: 202})
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json({error: err.message}, {status: 500})
  }
}