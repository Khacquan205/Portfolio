import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getAllStacks, saveStack } from "@/features/agents/storage";
import { randomUUID } from "crypto";

const ALLOWED_EMAILS = ["khacquan2054@gmail.com"];

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !ALLOWED_EMAILS.includes(session.user.email)) return null;
  return session;
}

export async function GET() {
  if (!(await requireAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const stacks = await getAllStacks();
  return NextResponse.json(stacks);
}

export async function POST(req: NextRequest) {
  if (!(await requireAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, description, tags, imageUrl } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const now = new Date().toISOString();
  const stack = {
    id: randomUUID(),
    name: name.trim(),
    description: description?.trim() ?? "",
    tags: Array.isArray(tags) ? tags : [],
    imageUrl: imageUrl?.trim() ?? "",
    repos: [],
    createdAt: now,
    updatedAt: now,
  };
  await saveStack(stack);
  return NextResponse.json(stack, { status: 201 });
}
