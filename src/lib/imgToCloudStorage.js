import { Storage } from "@google-cloud/storage"

export const uploadImgToCloudStorage = (buffer, fileName) => {
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
      resolve(`/api/img?title=${fileName}`)
    } catch (err) {
      reject(err)
    }
  })
}

// legacy
export const imgUploader = (buffer, fileName) => {
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