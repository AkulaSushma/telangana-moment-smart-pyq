import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
export const runtime = "nodejs";
export async function GET() {
  try {
    const bytes = await readFile(
      resolve(process.cwd(), "../sources/TS_Police_SI_2016.pdf"),
    );
    return new Response(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="TS_Police_SI_2016.pdf"',
      },
    });
  } catch {
    return Response.json(
      { error: "Source paper is not available on this host." },
      { status: 404 },
    );
  }
}
