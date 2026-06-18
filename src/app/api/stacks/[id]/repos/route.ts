import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { addRepoToStack, removeRepoFromStack } from "@/features/agents/storage";

const ALLOWED_EMAILS = ["khacquan2054@gmail.com"];

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !ALLOWED_EMAILS.includes(session.user.email)) return null;
  return session;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { repo } = await req.json();
  if (!repo?.fullName) return NextResponse.json({ error: "repo.fullName is required" }, { status: 400 });
  const updated = await addRepoToStack(id, { ...repo, addedAt: new Date().toISOString() });
  if (!updated) return NextResponse.json({ error: "Stack not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const repoFullName = decodeURIComponent(req.nextUrl.searchParams.get("repo") ?? "");
  if (!repoFullName) return NextResponse.json({ error: "repo query param required" }, { status: 400 });
  const updated = await removeRepoFromStack(id, repoFullName);
  if (!updated) return NextResponse.json({ error: "Stack not found" }, { status: 404 });
  return NextResponse.json(updated);
}
