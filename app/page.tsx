import { ScrollJourney } from '@/components/scroll-journey';
import { LanguageProvider } from '@/components/language';
import { VisualEffects } from '@/components/visual-effects';
import { Navigation, Portfolio, Services, About, Contact, Footer } from '@/components/portfolio';
export default function Home() { return <LanguageProvider><VisualEffects /><Navigation /><main id="content"><ScrollJourney><Portfolio /></ScrollJourney><Services /><About /><Contact /></main><Footer /></LanguageProvider>; }
