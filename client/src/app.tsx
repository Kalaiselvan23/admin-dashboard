import { RouterProvider } from 'react-router-dom'
import router from './router';
import { ThemeProvider } from './components/theme-provider'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from '@/contexts/AuthContext';
const queryClient = new QueryClient();
export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
