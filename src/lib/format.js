const won = new Intl.NumberFormat('ko-KR')

// 45000 → "45,000원"
export const formatPrice = (price) => (typeof price === 'number' ? `${won.format(price)}원` : '')
