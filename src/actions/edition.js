"use server"

import { getDB } from "@/lib/db"


// TODO: save coverImg API url
export const createNewEditionHandler = async(editionData) => {
  const {editionTitle, editionYear, coverImg} = editionData
  const conn = getDB()
  return new Promise( async (resolve, reject) => {
    try {
      const res = await conn.query(`
        INSERT INTO editions(title, edition_year, cover_img, created_at)
        VALUES ($1, $2, $3, $4)
        RETURNING 1`, [editionTitle, editionYear, "img", new Date().toISOString()])
      if (res.rowCount > 0) {
        resolve("Edition created successfully")
      }
      else{
        reject("Failed to insert edition")
      }
    }
    catch (err) {
      console.error(err)
      reject(err)
    }
  })
}

export const updateEditionInfoHandler = async (editionData) => {
  const { editionTitle, editionYear, coverImg, editionId } = editionData
  const conn = getDB()
  return new Promise(async (resolve, reject) => {
    try {
      const res = await conn.query(`
        UPDATE editions
        SET title = $1,
        edition_year = $2,
        cover_img = $3
        WHERE id = $4
        RETURNING 1`, [editionTitle, Number(editionYear), "img", editionId])
      if (res.rowCount > 0) {
        resolve("Edition created successfully")
      }
      else {
        reject("Failed to insert edition")
      }
    }
    catch (err) {
      console.error(err)
      reject(err)
    }
  })
}