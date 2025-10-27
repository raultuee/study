import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 
import { ThemeProvider } from './pages/theme/theme-provider';

import { Toaster } from 'sonner';
import { Error } from './pages/error';
import { Home } from './pages/home';
import { LoadingPage } from './utils/loading-page';
import { Login } from './pages/login';
import { Dashboard } from './pages/dashboard';
import { AppLayout } from './pages/theme/AppLayout';
import { AuthProvider } from './auth/AuthContext';
import { Planos } from './pages/planos';
import { Cadastro } from './pages/cadastro';
import ProtectedRoute from '@/auth/PrivateRoute';
import { Desk } from './pages/desk';

export function App() {
  return (
    // O ThemeProvider pode ficar por fora, sem problemas.
    <ThemeProvider storageKey='study' defaultTheme='dark'>
      {/* CORREÇÃO: O <Router> deve vir ANTES do <AuthProvider> */}
      <Router>
        {/* Agora o AuthProvider está "dentro do carro" e pode usar o useNavigate */}
        <AuthProvider>
          <Toaster position='top-center' className='bg-[#171717]' />
          <Routes>
            <Route element={<AppLayout />}>
              
              {/* Rotas Públicas */}
              <Route path='/' element={<Home/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/cadastro' element={<Cadastro/>}/>
              <Route path='/planos' element={<Planos/>}/>
              <Route path='/loading' element={<LoadingPage/>}/>

              {/* Rotas Protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route path='/dashboard' element={<Dashboard/>}/>
                <Route path='/desk' element={<Desk/>}/>
              </Route>

              {/* Rota de Erro */}
              <Route path='*' element={<Error />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}