import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 
import { ThemeProvider } from './pages/theme/theme-provider';

import { Toaster } from 'sonner';
import { Error } from './pages/error';
import { Home } from './pages/home';
import { LoadingPage } from './utils/loading-page';
import { Login } from './pages/login';
export function App() {

  return (

    <>

  <ThemeProvider storageKey='sym' defaultTheme='dark'>
    <Toaster position='top-center' className='bg-[#171717]' />
      <Router>
          <Routes>

            <Route path='/loading' element={<LoadingPage/>}/>

            <Route path='/' element={<Home/>}/>

            <Route path='/login' element={<Login/>}/>

            <Route path='*' element={<Error />} />

          </Routes>
      </Router>
  </ThemeProvider>
    </>
  
)
}

