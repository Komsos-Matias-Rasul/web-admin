import { NextResponse } from "next/server"

export const POST = async (req, res) => {
  const data = await req.json()
  console.log(JSON.stringify(data));
  return NextResponse.json({ message: "wuhuu" }, { status: 200 })
}