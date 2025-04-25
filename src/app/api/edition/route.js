import { getDB } from "@/lib/db"
import { uploadImgToCloudStorage } from "@/lib/imgToCloudStorage"
import sharp from "sharp"
import { NextResponse } from "next/server"

export const config = {
  api: {
    bodyParser: false,
  }
}

const formatTitleToSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, '')
    .trim()
    .replace(/\s+/g, '-')
}

export const POST = async (req, res) => {
  const formData = await req.formData()
  const file = formData.get("thumbnail")
  const editionTitle = formData.get("editionTitle")
  const editionYear = formData.get("editionYear")
  if (!file || editionTitle === "" || editionYear === "") {
    return NextResponse.json({message: "missing required formData: thumbnail, editionYear, editionYear"}, { status: 400 })
  }
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)
  const slug = formatTitleToSlug(editionTitle)

  const pool = getDB()
  try {
    const displayBuffer = await sharp(buffer).png({quality: 80}).toBuffer()
    const thumbnailBuffer = await sharp(buffer).resize(500).webp({quality: 50}).toBuffer()
    const displayImgUrl = await uploadImgToCloudStorage(displayBuffer, `zaitun/editions/${editionYear}/${slug}/${slug}.png`)
    const thumbnailImgUrl = await uploadImgToCloudStorage(thumbnailBuffer, `zaitun/editions/${editionYear}/${slug}/${slug}_thumb.webp`)

    const queryResult = await pool.query(`
      INSERT INTO editions(title, created_at, edition_year, cover_img, thumbnail_img)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `, [editionTitle, new Date().toISOString(), editionYear, displayImgUrl, thumbnailImgUrl])

    if(!queryResult.rowCount) {
      throw new Error("failed to create new edition")
    }
    console.log("edition created:", queryResult.rows[0].id)
  } catch (err) {
    console.error(err)
    return NextResponse.json("internal server error", {status: 500})
  }
  return NextResponse.json("new edition created successfully", {status: 201})
}