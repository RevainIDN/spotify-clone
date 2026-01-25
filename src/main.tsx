import './styles/index.css'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from './App.tsx'
import store from './store/index.ts'

const queryClient = new QueryClient();

// Создаём root элемент и рендерим приложение с полным стеком провайдеров.
// Provider оборачивает Redux store для доступа к глобальному состоянию.
// QueryClientProvider предоставляет React Query для управления асинхронными запросами.
// BrowserRouter включает маршрутизацию на клиенте.
createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
)
