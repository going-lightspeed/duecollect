import { promises as fs } from "fs";
import { isAdminLoggedIn } from "@/lib/auth";
import { evidencePath } from "@/lib/settle";

export const runtime = "nodejs";

const TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  pdf: "application/pdf",
};

/** Admin-only: view the bill a customer emailed in. */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ name: string }> },
) {
  if (!(await isAdminLoggedIn())) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { name } = await ctx.params;
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (!TYPES[ext]) return new Response("Not found", { status: 404 });
  try {
    const buf = await fs.readFile(evidencePath(name));
    return new Response(new Uint8Array(buf), {
      headers: { "Content-Type": TYPES[ext] },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
