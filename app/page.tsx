import { LanguageProvider } from '@/components/language';
import { VisualEffects } from '@/components/visual-effects';
import { Navigation, Hero, Portfolio, Services, About, Contact, Footer } from '@/components/portfolio';
export default function Home() { return <LanguageProvider><VisualEffects /><Navigation /><main id="content"><Hero /><Portfolio /><Services /><About /><Contact /></main><Footer /></LanguageProvider>; }
