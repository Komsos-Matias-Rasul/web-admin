import { NextResponse } from "next/server"
import { Storage } from "@google-cloud/storage"
import { getDB } from "@/lib/db"

export const config = {
  api: {
    bodyParser: false,
  }
}

const postImage = (buffer, fileName) => {
  const bucketName = process.env.GCLOUD_BUCKET || ""
  const b_cred = process.env.GOOGLE_CREDENTIALS_BASE64 || ""

  const _cred = JSON.parse(Buffer.from(b_cred, "base64").toString())

  return new Promise((resolve, reject) => {
    try {
      const storage = new Storage({
        projectId: process.env.GCLOUD_PROJECT,
        credentials: _cred
      })

      const bucket = storage.bucket(bucketName)
      const _file = bucket.file(fileName)
      const stream = _file.createWriteStream()

      stream.on('error', (err) => {
        console.error('Stream Error:', err)
      })

      stream.on('finish', () => {
        console.log(`File uploaded to ${bucketName} as ${fileName}`)
      })

      stream.end(buffer)
      resolve(`/api/img/${fileName}`)
    } catch (err) {
      reject(err)
    }
  })
}

export const POST = async (req, res) => {
  const param = req.nextUrl.searchParams
  const slug = param.get("slug")
  const formData = await req.formData()
  const file = formData.get("thumbnail")
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)
  let url
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }
  const extension = file.type.split('/').pop()
  const fileName = `${slug}_thumb.${extension}`
  try {
    url = await postImage(buffer, fileName)
    const pool = getDB()
    const q = `
      UPDATE articles
      SET thumb_img = $1, headline_img = $1
      WHERE slug = $2;
    `
    const value = [url, slug]
    await pool.query(q, value)
  }
  catch (err) {
    console.error('Error saving the file:', err)
    return NextResponse.json({ error: 'Error saving the file' }, { status: 500 })
  }
  return NextResponse.json({status: "OK"}, { status: 201 })
}