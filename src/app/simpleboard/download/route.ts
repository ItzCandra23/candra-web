import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const filename = searchParams.get("filename");

  if (!tag || !filename) return new NextResponse(null, { status: 404 });

  const url = `https://github.com/NusaMC/SimpleBoard-RP/releases/download/${tag}/${filename}`;

  const response = await fetch(url);
  const data = await response.arrayBuffer();
  
  return new NextResponse(data, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  });
}