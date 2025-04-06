import { getDB } from "@/lib/db"
import { NextResponse } from "next/server"

const formatTitleToSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/gi, '')
        .trim()
        .replace(/\s+/g, '-')
}

export const POST = async (req) => {
    const { titleData, categoryData, writerData, IDData } = await req.json()
    const pool = getDB()

    const now = new Date().toISOString()
    const id_ = Number(IDData)
    const title = String(titleData)
    const category = Number(categoryData)
    const writer = Number(writerData)
    console.log('API : ', id_, title, category, writer)

    const slug = formatTitleToSlug(titleData)

    try {
        const q = `
        UPDATE articles
        SET updated_at = $1,
            title = $2,
            slug = $3,
            category_id = $4,
            writer_id = $5
        WHERE id = $6;
      `
        const values = [
            now,
            title,
            slug,
            category,
            writer,
            id_
        ]
        await pool.query(q, values)
        
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }

    return NextResponse.json({ id: IDData })
}
