import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 
import { ThemeProvider } from './pages/theme/theme-provider';

import { Toaster } from 'sonner';
import { Error } from './pages/error';
import { Home } from './pages/home';
import { LoadingPage } from './utils/loading-page';
import { Login } from './pages/login';
import { Dashboard } from './pages/dashboard';
import { AppLayout } from './pages/theme/AppLayout';
import { PrivateRoute } from './auth/PrivateRoute';
import { AuthProvider } from './auth/AuthContext';
import { Planos } from './pages/planos';
export function App() {

  return (

    <>

  <AuthProvider>
    <ThemeProvider storageKey='study' defaultTheme='dark'>
      <Toaster position='top-center' className='bg-[#171717]' />
        <Router>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route element={<AppLayout />}>
                <Route path='/loading' element={<LoadingPage/>}/>
                <Route path='/dashboard' element={
                    <PrivateRoute>
                      <Dashboard/>
                    </PrivateRoute>
                }/>
                <Route path='/planos' element={<Planos/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='*' element={<Error />} />
    
              </Route>
            </Routes>
        </Router>
    </ThemeProvider>
  </AuthProvider>
    </>
  
)
}

