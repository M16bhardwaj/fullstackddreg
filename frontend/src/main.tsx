// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Router } from '@/router';
import { UserProvider } from '@/contexts/user.context';

import '@/styles/index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <UserProvider>
                <Router />
            </UserProvider>
        </BrowserRouter>
    </QueryClientProvider>,
);
