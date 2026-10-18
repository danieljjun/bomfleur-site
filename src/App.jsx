import client from './data/client.json'
import Header from './components/common/Header.jsx'
import Hero from './components/hero/Hero.jsx'
import About from './components/sections/About.jsx'
import Portfolio from './components/sections/Portfolio.jsx'
import Products from './components/sections/Products.jsx'
import Education from './components/sections/Education.jsx'
import QuoteCard from './components/sections/QuoteCard.jsx'
import Footer from './components/sections/Footer.jsx'

export default function App() {
  const { brand, store, hero, about, portfolio, products, education, quoteForm, footer } = client
  // 구매·신청 링크가 없을 때 쓰는 "문의하기" 연결처
  const contact = { label: store?.contactLabel, url: store?.contactUrl, phone: store?.contactPhone || footer.phone }
  const nav = quoteForm ? [{ label: quoteForm.navLabel, href: '#quote' }] : []

  return (
    <>
      <Header brand={brand} store={store} nav={nav} overlay />
      <main>
        <Hero hero={hero} brand={brand} />
        {about && <About about={about} />}
        {portfolio && <Portfolio portfolio={portfolio} />}
        {products && <Products products={products} store={store} contact={contact} />}
        {education && <Education education={education} store={store} contact={contact} />}
        {quoteForm && <QuoteCard quoteForm={quoteForm} contact={contact} />}
      </main>
      <Footer footer={footer} brand={brand} privacy={client.privacy} />
    </>
  )
}
