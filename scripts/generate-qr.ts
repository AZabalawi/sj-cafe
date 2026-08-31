// Generates the ONE universal SJ Cafe QR code, pointing at /menu.
//
// Reads the target domain from NEXT_PUBLIC_SITE_URL (see .env.local / .env.example)
// so nothing is hardcoded. Re-run this any time that value changes:
//
//   npm run generate:qr

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const targetUrl = new URL("/menu", siteUrl).toString();

const outDir = path.join(process.cwd(), "public", "qr");
const brandColor = "#0a2f52";

async function main() {
  await mkdir(outDir, { recursive: true });

  const pngPath = path.join(outDir, "sj-cafe-menu-qr.png");
  const svgPath = path.join(outDir, "sj-cafe-menu-qr.svg");

  await QRCode.toFile(pngPath, targetUrl, {
    type: "png",
    width: 1024,
    margin: 2,
    color: { dark: brandColor, light: "#ffffff" },
  });

  const svg = await QRCode.toString(targetUrl, {
    type: "svg",
    margin: 2,
    color: { dark: brandColor, light: "#ffffff" },
  });
  await writeFile(svgPath, svg, "utf8");

  console.log(`QR code generated for: ${targetUrl}`);
  console.log(`  PNG: ${path.relative(process.cwd(), pngPath)}`);
  console.log(`  SVG: ${path.relative(process.cwd(), svgPath)}`);
  console.log("\nSame QR code everywhere: tables, counter, entrance, cups, flyers, social.");
  console.log("Before printing for real, set the real domain in .env.local and re-run this script.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
