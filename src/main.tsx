import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApiClient, shouldRetry } from './shared/api/client'
import { ApiProvider } from './shared/api/context'
import { credentialSession } from './shared/auth/session'
import { ConfigError, loadRuntimeConfig } from './shared/config/runtime-config'
import { Card } from './shared/ui/card'
import { routeTree } from './routeTree.gen'
import './styles.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: shouldRetry, refetchOnWindowFocus: false } },
})

function mount() {
  const root = createRoot(document.getElementById('root')!)
  try {
    const config = loadRuntimeConfig()
    const api = new ApiClient(config, () => {
      credentialSession.clear()
      queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== 'build-info' })
    })
    const router = createRouter({ routeTree, defaultPreload: 'intent' })
    root.render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <ApiProvider value={api}>
            <RouterProvider router={router} />
          </ApiProvider>
        </QueryClientProvider>
      </StrictMode>,
    )
  } catch (error) {
    const message =
      error instanceof ConfigError ? error.message : 'Runtime configuration could not be loaded.'
    root.render(
      <main id="main-content" className="mx-auto max-w-2xl p-8">
        <Card role="alert" className="border-rose-900">
          <p className="eyebrow">Configuration error</p>
          <h1 className="mt-3 text-3xl font-semibold">Okoscope cannot start</h1>
          <p className="mt-4 text-slate-300">{message}</p>
        </Card>
      </main>,
    )
  }
}

mount()
