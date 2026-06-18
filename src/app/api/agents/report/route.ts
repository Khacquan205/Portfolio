/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { NextRequest, NextResponse } from "next/server";
import { getLatestReport, getReportByDate } from "@/features/agents/storage";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  try {
    const report = date
      ? await getReportByDate(date)
      : await getLatestReport();

    if (!report) {
      return NextResponse.json(
        { error: "Chưa có bản tin nào. Hãy chạy agent trước." },
        { status: 404 }
      );
    }

    return NextResponse.json(report);
  } catch (err) {
    const error = err instanceof Error ? err.message : "Lỗi không xác định";
    return NextResponse.json({ error }, { status: 500 });
  }
}
