/**
 * Draws the extension icon, a white V on a rounded square in the primary colour, and
 * writes it as PNG at every size the manifest lists. Run with `npm run icons`.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { crc32, deflateSync } from "node:zlib";
import { palette } from "../src/core/palette.ts";

const SIZES = [16, 32, 48, 128];
const SAMPLES = 4;

type Point = readonly [number, number];

// Shapes on a 128-unit canvas.
const SQUARE = { inset: 8, radius: 26 };
const V: Point[] = [
    [34, 38],
    [52, 38],
    [64, 74],
    [76, 38],
    [94, 38],
    [72, 94],
    [56, 94],
];

type Rgb = [number, number, number];

const rgb = (hex: string): Rgb => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as Rgb;

const mix = ([r1, g1, b1]: Rgb, [r2, g2, b2]: Rgb, amount: number): Rgb =>
    [r1 + (r2 - r1) * amount, g1 + (g2 - g1) * amount, b1 + (b2 - b1) * amount].map(Math.round) as Rgb;

function insideSquare(x: number, y: number): boolean {
    const { inset, radius } = SQUARE;
    const min = inset + radius;
    const max = 128 - inset - radius;
    const dx = Math.max(min - x, 0, x - max);
    const dy = Math.max(min - y, 0, y - max);
    return x >= inset && x <= 128 - inset && y >= inset && y <= 128 - inset && dx * dx + dy * dy <= radius * radius;
}

function insidePolygon(x: number, y: number, polygon: Point[]): boolean {
    let inside = false;
    polygon.forEach(([xi, yi], i) => {
        const [xj, yj] = polygon.at(i - 1) ?? [xi, yi];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    });
    return inside;
}

/** RGBA pixels, each averaged over SAMPLES x SAMPLES points so edges are smooth. */
function draw(size: number): Buffer {
    const background = rgb(palette.primary);
    const mark = rgb(palette.white);
    const pixels = Buffer.alloc(size * size * 4);
    for (let py = 0; py < size; py++) {
        for (let px = 0; px < size; px++) {
            let square = 0;
            let letter = 0;
            for (let sy = 0; sy < SAMPLES; sy++) {
                for (let sx = 0; sx < SAMPLES; sx++) {
                    const x = ((px + (sx + 0.5) / SAMPLES) * 128) / size;
                    const y = ((py + (sy + 0.5) / SAMPLES) * 128) / size;
                    if (!insideSquare(x, y)) continue;
                    square++;
                    if (insidePolygon(x, y, V)) letter++;
                }
            }
            const total = SAMPLES * SAMPLES;
            const blend = square ? letter / square : 0;
            const offset = (py * size + px) * 4;
            pixels.set([...mix(background, mark, blend), Math.round((255 * square) / total)], offset);
        }
    }
    return pixels;
}

function chunk(type: string, data: Buffer): Buffer {
    const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const checksum = Buffer.alloc(4);
    checksum.writeUInt32BE(crc32(body));
    return Buffer.concat([length, body, checksum]);
}

function png(size: number, pixels: Buffer): Buffer {
    const header = Buffer.alloc(13);
    header.writeUInt32BE(size, 0);
    header.writeUInt32BE(size, 4);
    header.writeUInt8(8, 8); // bit depth
    header.writeUInt8(6, 9); // colour type: RGBA
    const rows = Buffer.alloc(size * (size * 4 + 1));
    for (let y = 0; y < size; y++) pixels.copy(rows, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
    return Buffer.concat([
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        chunk("IHDR", header),
        chunk("IDAT", deflateSync(rows)),
        chunk("IEND", Buffer.alloc(0)),
    ]);
}

const directory = resolve(import.meta.dirname, "../public/icons");
mkdirSync(directory, { recursive: true });
for (const size of SIZES) writeFileSync(resolve(directory, `${String(size)}.png`), png(size, draw(size)));
console.log(`Wrote ${SIZES.map((size) => `${String(size)}.png`).join(", ")} to public/icons`);
