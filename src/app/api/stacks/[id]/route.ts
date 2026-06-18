import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getStack, saveStack, deleteStack } from "@/features/agents/storage";

const ALLOWED_EMAILS = ["khacquan2054@gmail.com"];

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !ALLOWED_EMAILS.includes(session.user.email)) return null;
  return session;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const stack = await getStack(id);
  if (!stack) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(stack);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const stack = await getStack(id);
  if (!stack) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { name, description, tags, imageUrl } = await req.json();
  const updated = {
    ...stack,
    name: name?.trim() ?? stack.name,
    description: description?.trim() ?? stack.description,
    tags: Array.isArray(tags) ? tags : stack.tags,
    imageUrl: imageUrl?.trim() ?? stack.imageUrl,
    updatedAt: new Date().toISOString(),
  };
  await saveStack(updated);
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await deleteStack(id);
  return new NextResponse(null, { status: 204 });
}
