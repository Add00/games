import { copyFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const root = process.env["PWD"];

const files = {
    'node_modules/litecanvas/dist/dist.js': 'common/litecanvas.js'
}

for (const [from, to] of Object.entries(files)) {
    const dir = dirname(`${root}/${to}`)
    await mkdir(dir, { recursive: true })
    await copyFile(`${root}/${from}`, `${root}/${to}`)
}
