import { copyFile, mkdir } from "node:fs/promises";

const root = process.env["PWD"];

const files = {
    'node_modules/litecanvas/dist/dist.js': 'litecanvas/dist.js'
}

await mkdir(`${root}/litecanvas`)

for (const [from, to] of Object.entries(files)) {
    await copyFile(`${root}/${from}`, `${root}/${to}`)
}
