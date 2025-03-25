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