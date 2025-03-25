import { Storage } from "@google-cloud/storage"
import { v4 as uuidv4 } from "uuid"

export const imgUploader = (buffer, fileName = uuidv4()) => {
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
      const _file = bucket.file(fileName+".webp")
      const stream = _file.createWriteStream()

      stream.on('error', (err) => {
        console.error('Stream Error:', err)
      })

      stream.on('finish', () => {
        console.log(`File uploaded to ${bucketName} as ${fileName}.webp`)
      })

      stream.end(buffer)
      resolve(`/api/img?title=${fileName}.webp`)
    } catch (err) {
      reject(err)
    }
  })
}