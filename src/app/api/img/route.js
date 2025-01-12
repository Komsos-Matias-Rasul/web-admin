import { Storage } from "@google-cloud/storage"
import { NextResponse } from "next/server"

export const GET = async (req) => {
  const params = req.nextUrl.searchParams
  const query = params.get('title')

  if(!query) {
    return NextResponse.json("Bad request: missing required fields (title)", { status: 400 })
  }
  
  const b_cred = process.env.GOOGLE_CREDENTIALS_BASE64
  const bucketName = process.env.GCLOUD_BUCKET

  const _cred = JSON.parse(Buffer.from(b_cred, "base64").toString())
  const storage = new Storage({
    projectId: process.env.GCLOUD_PROJECT,
    credentials: _cred
  })

  let blob
  let contentType
  const fileName = encodeURIComponent(query)

  try{
    const bucket = storage.bucket(bucketName)
    const file = bucket.file(fileName)
    blob = await file.download()
    const meta = await file.getMetadata()
    contentType = meta[0].contentType
  } catch(err){
    if (err.code === 404) {
      return NextResponse.json("No such file", {status: 404})
    }
    return NextResponse.json("Oops! >_< sowry", {status: 500})
  }

  const res = new NextResponse(blob[0], {status: 200, statusText: "OK"})
  res.headers.append("Content-Type", contentType)

  return res
}