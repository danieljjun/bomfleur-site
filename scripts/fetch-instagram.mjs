// 인스타그램 피드 수집 스크립트 (npm run build 때 자동 실행, 단독 실행: npm run instagram)
//
// Behold JSON 피드(client.json의 portfolio.instagram.feedUrl)를 빌드할 때 한 번만 받아
// 갤러리에 필요한 값만 src/data/instagram-feed.json 에 저장한다. 사이트는 이 파일만 읽으므로
// 방문자 브라우저는 피드를 요청하지 않는다 (Behold 무료 플랜: 피드 요청 월 1,200회 제한).
//
// 실패해도 빌드는 멈추지 않는다: 직전에 저장된 피드를 그대로 쓰고, 그것도 없으면 빈 목록
// (→ 사이트는 portfolio.items 이미지로 대체).
import { readFile, writeFile } from 'node:fs/promises'
import { postToTile } from '../src/lib/instagram.js'

const OUT = 'src/data/instagram-feed.json'
const RETRIES = 2 // 429·5xx·네트워크 오류 시 재시도 횟수
const TIMEOUT = 15000

const client = JSON.parse(await readFile('src/data/client.json', 'utf-8'))
const feedUrl = client.portfolio?.instagram?.feedUrl
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function readPrevious() {
  try {
    return JSON.parse(await readFile(OUT, 'utf-8'))
  } catch {
    return null
  }
}

async function fetchFeed(url) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT) })
      if (res.ok) return await res.json()
      const retryable = res.status === 429 || res.status >= 500
      if (!retryable || attempt >= RETRIES) throw new Error(`HTTP ${res.status}`)
    } catch (error) {
      if (attempt >= RETRIES || /^HTTP 4/.test(error.message)) throw error
    }
    await sleep(2000 * (attempt + 1))
  }
}

async function save(data) {
  await writeFile(OUT, JSON.stringify(data, null, 2) + '\n')
}

if (!feedUrl) {
  await save({ fetchedAt: null, username: null, tiles: [] })
  console.log('- 인스타그램 피드 주소가 없어 portfolio 이미지를 사용합니다.')
} else {
  try {
    const data = await fetchFeed(feedUrl)
    const tiles = (data.posts ?? [])
      .filter((p) => p.permalink && p.sizes && p.visibility !== 'hidden')
      .map(postToTile)
    if (!tiles.length) throw new Error('게시물이 없습니다')
    await save({ fetchedAt: new Date().toISOString(), username: data.username ?? null, tiles })
    console.log(`✓ 인스타그램 피드 ${tiles.length}개 저장 (@${data.username})`)
  } catch (error) {
    const previous = await readPrevious()
    if (previous?.tiles?.length) {
      console.warn(`! 인스타그램 피드를 받지 못해 이전 피드(${previous.fetchedAt})를 그대로 씁니다: ${error.message}`)
    } else {
      await save({ fetchedAt: null, username: null, tiles: [] })
      console.warn(`! 인스타그램 피드를 받지 못해 portfolio 이미지를 사용합니다: ${error.message}`)
    }
  }
}
