import { getDB } from "@/lib/db"
import { NextResponse } from "next/server"

export const GET = async (req, res) => {
  const db = getDB()
  try {
    const id = 2
    const article = await db.query("SELECT * FROM articles WHERE id = $1", [id])
    console.log(article.rows)
    return NextResponse.json(article.rows)
  } catch (err) {
    console.error('Error:', err.message)
    return res.status(500).send({error: err.message})
  }
}