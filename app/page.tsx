import { 
  Navigation, 
  Hero, 
  Services,
  About, 
  Portfolio,
  Contact, 
  Footer 
} from "@/components/portfolio"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Services />
      <About />
      <Portfolio />
      <Contact />
      <Footer />
    </main>
  )
}
