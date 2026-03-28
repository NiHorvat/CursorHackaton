import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LanguageProvider } from './i18n/LanguageContext'
import { Header } from './components/Header'
import { Newsletter } from './components/Newsletter'
import { HomePage } from './pages/HomePage'
import { LocationsPage } from './pages/LocationsPage'
import { EventsPage } from './pages/EventsPage'
import { TonightRecommendPage } from './pages/TonightRecommendPage'
import './zagreb-events.css'

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <div className="ze-app">
          <Header />
          <main className="ze-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/lokacije" element={<LocationsPage />} />
              <Route path="/eventovi/tonight" element={<TonightRecommendPage />} />
              <Route path="/eventovi" element={<EventsPage />} />
            </Routes>
          </main>
          <Newsletter />
        </div>
      </LanguageProvider>
    </BrowserRouter>
  )
}
