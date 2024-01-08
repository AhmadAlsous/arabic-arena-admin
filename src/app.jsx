import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import 'src/global.css';
import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
      <Toaster
        containerStyle={{
          top: 85,
        }}
      />
    </QueryClientProvider>
  );
}
