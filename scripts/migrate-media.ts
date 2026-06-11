import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";

// Load .env.local from the repo root, setting only keys not already present in
// the environment. tsx does not auto-load this file, so the script owns it.
function loadEnvLocal(): void {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIdx = line.indexOf("=");
    if (eqIdx === -1) continue;
    const key = line.slice(0, eqIdx).trim();
    let value = line.slice(eqIdx + 1).trim();
    // Strip surrounding quotes ("value" or 'value')
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

// Recursively collect every file under a directory, skipping dotfiles.
function collectFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir)) {
    if (entry.startsWith(".")) continue;
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      results.push(...collectFiles(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

async function main(): Promise<void> {
  loadEnvLocal();

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error(
      "Add BLOB_READ_WRITE_TOKEN to .env.local — copy the snippet from the Blob store's Quickstart in the Vercel dashboard."
    );
    process.exit(1);
  }

  const publicImagesDir = path.resolve(process.cwd(), "public/images");
  const files = collectFiles(publicImagesDir);

  let successCount = 0;
  let totalBytes = 0;
  const failures: string[] = [];
  let baseUrl = "";

  for (const filePath of files) {
    // Pathname relative to public/ (e.g. images/home/hero-lifestyle.png)
    const pathname = path.relative(
      path.resolve(process.cwd(), "public"),
      filePath
    );

    try {
      const fileBuffer = fs.readFileSync(filePath);
      const blob = await put(pathname, fileBuffer, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 31536000,
      });

      const fileSize = fs.statSync(filePath).size;
      totalBytes += fileSize;
      successCount++;

      console.log(`${pathname} -> ${blob.url}`);

      // Derive base URL from the first successful upload:
      // everything before /images/ in the returned URL.
      if (!baseUrl) {
        const idx = blob.url.indexOf("/images/");
        if (idx !== -1) {
          baseUrl = blob.url.slice(0, idx);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      failures.push(`${pathname}: ${message}`);
    }
  }

  console.log("");
  console.log("--- Summary ---");
  console.log(`Files uploaded: ${successCount} of ${files.length}`);
  console.log(`Total bytes (successful uploads): ${totalBytes.toLocaleString()} bytes`);
  if (baseUrl) {
    console.log(`NEXT_PUBLIC_MEDIA_BASE_URL=${baseUrl}  (use this as NEXT_PUBLIC_MEDIA_BASE_URL)`);
  }

  if (failures.length > 0) {
    console.error("");
    console.error("--- Failed uploads ---");
    for (const f of failures) {
      console.error(f);
    }
    process.exit(1);
  }
}

main();
