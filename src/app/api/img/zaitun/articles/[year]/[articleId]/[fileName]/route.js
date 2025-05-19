/*API for zaitun article content images*/

import { Storage } from "@google-cloud/storage"
import { NextResponse } from "next/server"

export const GET = async (req) => {
  const path = req.nextUrl.pathname.split('/')
  const editionYear = path[5]
  const articleId = path[6]
  const fileName = path[7]
  
  const b_cred = process.env.GOOGLE_CREDENTIALS_BASE64
  const bucketName = process.env.GCLOUD_BUCKET

  const _cred = JSON.parse(Buffer.from(b_cred, "base64").toString())
  const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT,
    credentials: _cred
  })

  let blob
  let contentType

  try {
    const bucket = storage.bucket(bucketName)
    const file = bucket.file(`zaitun/articles/${editionYear}/${articleId}/${fileName}`)
    blob = await file.download()
    const meta = await file.getMetadata()
    contentType = meta[0].contentType
  } catch (err) {
    if (err.code === 404) {
      console.error("file not found:", `zaitun/articles/${editionYear}/${articleId}/${fileName}`)
      return NextResponse.json("no such file", { status: 404 })
    }
    console.error(err)
    return NextResponse.json("internal server error", { status: 500 })
  }
  const res = new NextResponse(blob[0])
  res.headers.append("Content-Type", contentType)

  return res
}