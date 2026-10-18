// client.json의 brand.colors를 CSS 변수(--color-*) 선언으로 바꾼다.
// 예: { primary: '#8B5A3C' } → ":root{--color-primary:#8B5A3C}"
// vite.config.js가 이 결과를 <head>에 넣어, JS가 실행되기 전부터 업체 색상이 적용된다.
export function themeCss(colors = {}) {
  const vars = Object.entries(colors)
    .filter(([name, value]) => /^[a-z]+$/i.test(name) && /^#[0-9a-f]{3,8}$/i.test(value ?? ''))
    .map(([name, value]) => `--color-${name}:${value}`)
  return `:root{${vars.join(';')}}`
}
