import { getDB } from "@/lib/db"
import { NextResponse } from "next/server"

export const POST = async (req) => {
  const { articleData, IDData } = await req.json()
  const pool = getDB()

  const now = new Date().toISOString()
  const id_ = Number(IDData)
  try {

    const q = `
        UPDATE articles
        SET content_json = $1,
            updated_at = $2
        WHERE id = $3;
      `
    const values = [
      JSON.stringify(articleData.content),
      now,
      id_
    ]
    await pool.query(q, values)

  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  return NextResponse.json({ id: IDData })
}
