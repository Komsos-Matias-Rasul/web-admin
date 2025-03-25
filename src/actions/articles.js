"use server"

import { getDB } from "@/lib/db"

export const publishArticle = async (articleId) => {
  const conn = getDB()
  try {
    const res = await conn.query(
      `UPDATE articles
      SET published_date = $1
      WHERE id = $2
      RETURNING 1;
      `, [new Date().toISOString(), Number(articleId)])
    if (res.rowCount > 0) {
      console.log(res.rows[0])
      return "Article updated successfully"
    }
    throw new Error("Update article failed")
  } catch (err) {
    console.error(err)
    return err
  }
}

export const createArticle = async (editionId) => {
  const conn = getDB()
  const UNCATEGORIZED = 1  // id of 'Uncategorized' category in categories table
  try {
    const res = await conn.query(
      `
      INSERT INTO articles (edition_id, title, category_id)
      VALUES ($1, $2, $3)
      RETURNING id
      `, [Number(editionId), 'Untitled Article', UNCATEGORIZED])
    if (res.rowCount > 0) {
      console.log("new article created:", res.rows[0].id)
      return res.rows[0].id
    }
    throw new Error("Update article failed")
  } catch (err) {
    console.error(err)
    return err
  }
}