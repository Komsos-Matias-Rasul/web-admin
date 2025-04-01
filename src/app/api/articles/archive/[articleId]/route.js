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
      UPDATE articles
      SET archived_date = $1
      WHERE id = $2
      RETURNING 1`, [new Date().toISOString(), Number(articleId)])
    if (queryResponse.rows.length < 1) {
      throw new Error("article archived unsuccessful", { status: 500 })
    }
    return NextResponse.json("article archived successfully", {status: 202})
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json({error: err.message}, {status: 500})
  }
}