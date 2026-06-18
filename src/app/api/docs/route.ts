import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const DOC_FILES: Record<string, string> = {
  mainflow: "src/app/projects/inmap/docs/technical_documents/02-main-flows.md",
  functional: "src/app/projects/inmap/docs/technical_documents/03-functional-requirements.md",
};

export async function GET(req: NextRequest) {
  const slug = new URL(req.url).searchParams.get("slug") ?? "";
  const rel = DOC_FILES[slug];
  if (!rel) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const content = fs.readFileSync(path.join(process.cwd(), rel), "utf-8");
    return new NextResponse(content, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return NextResponse.json({ error: "File error" }, { status: 500 });
  }
}
