import { NextResponse } from "next/server"
import { Storage } from "@google-cloud/storage"
import sharp from "sharp"

export const config = {
  api: {
    bodyParser: false,
  }
}

const postImage = (buffer, fileName) => {
  const bucketName = process.env.GCLOUD_BUCKET || ""
  const b_cred = process.env.GOOGLE_CREDENTIALS_BASE64 || ""
  const encodedFileURL = encodeURIComponent(fileName)

  const _cred = JSON.parse(Buffer.from(b_cred, "base64").toString())

  return new Promise((resolve, reject) => {
    try {
      const storage = new Storage({
        projectId: process.env.GCLOUD_PROJECT,
        credentials: _cred
      })

      const bucket = storage.bucket(bucketName)
      const _file = bucket.file(encodedFileURL+".webp")
      const stream = _file.createWriteStream()

      stream.on('error', (err) => {
        console.error('Stream Error:', err)
      })

      stream.on('finish', () => {
        console.log(`File uploaded to ${bucketName} as ${encodedFileURL}.webp`)
      })

      stream.end(buffer)
      resolve(`/api/img?title=${encodedFileURL}.webp`)
    } catch (err) {
      reject(err)
    }
  })
}

const waitTime = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
}
export const POST = async (req, res) => {
  const formData = await req.formData()
  const file = formData.get("image")
  const referrer = formData.get("referrer")
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)
  let url
  console.log("referrer:", referrer)
  
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, {status: 400})
  }
  const fileName = file.name.split(".")[0]

  try {
    const compressedBuffer = await sharp(buffer).webp({quality: 60}).toBuffer()
    // url = await postImage(compressedBuffer, fileName)
  }
  catch (err) {
    console.error('Error saving the file:', err)
    return NextResponse.json({ error: 'Error saving the file'}, {status: 500})
  }
  // await waitTime(2000)
  return NextResponse.json({
    success: 1,
    file: {
      url: url,
    }
  }, { status: 200 })
}