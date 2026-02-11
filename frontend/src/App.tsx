/**
 * Main App Component
 *
 * Pre-wrapped with DialogProvider and ToastContextProvider.
 * Uses React Router for page navigation.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DialogProvider, ToastContextProvider, Toaster } from '@/components/ui'
import { HomePage } from '@/pages/HomePage'
import { BrandPage } from '@/pages/BrandPage'
import { CarDetailPage } from '@/pages/CarDetailPage'

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <a href="/" className="text-xl font-bold text-[var(--color-accent)]">
            Vintage Cars
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] mt-auto">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-[var(--color-muted)]">
            Vintage Car Marketplace - Curating extraordinary automobiles for discerning collectors.
          </p>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ToastContextProvider>
        <DialogProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/brand/:brandId" element={<BrandPage />} />
              <Route path="/car/:carId" element={<CarDetailPage />} />
            </Routes>
          </AppLayout>
          <Toaster />
        </DialogProvider>
      </ToastContextProvider>
    </BrowserRouter>
  )
}

export default App
