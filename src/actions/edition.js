"use server"

import { getDB } from "@/lib/db"
import { imgUploader } from "@/lib/imgToCloudStorage"
import sharp from "sharp"

const storeImage = async (imgFormData, editionId) => {
  if (!imgFormData) {
    throw new Error("No image file found")
  }
  const arrayBuffer = await imgFormData.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)
  try {
    const compressedBuffer = await sharp(buffer).webp({ quality: 60 }).toBuffer()
    const imgUrl = await imgUploader(compressedBuffer)
    const pool = getDB()
    const res = await pool.query(`
        UPDATE editions
        SET cover_img = $1
        WHERE id = $2
      `, [imgUrl, editionId])
    console.log(`Image saved successfully: ${imgUrl}`)
  } catch (err) {
    console.error(err)
    return err
  }
}

export const createNewEditionHandler = async (editionData) => {
  const {editionTitle, editionYear, coverImg} = editionData
  const conn = getDB()
  return new Promise(async(resolve, reject) => {
    try {
      let res = await conn.query(`
        INSERT INTO editions(title, edition_year, created_at)
        VALUES ($1, $2, $3)
        RETURNING id`, [editionTitle, editionYear, new Date().toISOString()])
      if (res.rowCount > 0) {
        res = await storeImage(coverImg, res.rows[0].id)
        resolve("Edition created successfully")
      }
      else{
        reject("Failed to insert edition")
      }
    }
    catch (err) {
      console.error(err)
      reject(err.message)
    }
  })
}

export const updateEditionInfoHandler = async (editionData) => {
  const { editionTitle, editionYear, coverImg, editionId } = editionData
  const conn = getDB()
  return new Promise(async (resolve, reject) => {
    try {
      let res = await conn.query(`
        UPDATE editions
        SET title = $1,
        edition_year = $2
        WHERE id = $3
        RETURNING id`, [editionTitle, Number(editionYear), editionId])
      if (res.rowCount > 0) {
        res = await storeImage(coverImg, res.rows[0].id)
        resolve("Edition updated successfully")
      }
      else {
        reject("Failed to update edition")
      }
    }
    catch (err) {
      console.error(err)
      reject(err)
    }
  })
}