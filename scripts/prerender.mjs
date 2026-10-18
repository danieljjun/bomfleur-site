// 빌드 후 각 페이지의 HTML을 미리 렌더링해 dist/*.html 의 <!--app-html--> 자리에 넣는다.
// JS가 실행되기 전에도 내용이 보여 첫 화면이 빨라지고, 검색엔진이 내용을 읽을 수 있다.
import { readFile, rm, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const ssrDir = path.resolve('dist-ssr')
const { render, pageFiles } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

for (const file of pageFiles) {
  const target = path.join('dist', file)
  const html = await readFile(target, 'utf-8')
  if (!html.includes('<!--app-html-->')) throw new Error(`${file}에 <!--app-html--> 자리가 없습니다.`)
  // React가 본문에 넣는 이미지 preload는 vite.config.js가 <head>에 이미 넣었으므로 뺀다
  const body = render(file).replace(/<link rel="preload" as="image"[^>]*>/g, '')
  await writeFile(target, html.replace('<!--app-html-->', body))
  console.log(`✓ prerendered ${file}`)
}

await rm(ssrDir, { recursive: true, force: true })
