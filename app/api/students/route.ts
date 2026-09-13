import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  const data = await readFile(
    path.join(process.cwd(), "data", "students.json"),
    "utf8",
  );
  const students = JSON.parse(data);

  return NextResponse.json(students);
}
