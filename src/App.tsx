import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 
import { ThemeProvider } from './pages/theme/theme-provider';

import { Toaster } from 'sonner';
import { Error } from './pages/error';
import { Home } from './pages/home';
import { LoadingPage } from './utils/loading-page';
import { Login } from './pages/login';
import { Dashboard } from './pages/dashboard';
import { AppLayout } from './pages/theme/AppLayout';
import { ForumTurma } from './pages/dashboard/forum-turma';
import { Conquistas } from './pages/dashboard/conquistas';
import { Perfil } from './pages/dashboard/perfil';
import { Tarefas } from './pages/dashboard/tarefas';
export function App() {

  return (

    <>

  <ThemeProvider storageKey='sym' defaultTheme='dark'>
    <Toaster position='top-center' className='bg-[#171717]' />
      <Router>
          <Routes>

            <Route path='/' element={<Home/>}/>

            <Route element={<AppLayout />}>

              <Route path='/loading' element={<LoadingPage/>}/>

              <Route path='/dashboard' element={<Dashboard/>}/>

              <Route path='/dashboard/forum-turma' element={<ForumTurma/>}/>

              <Route path='/dashboard/conquistas' element={<Conquistas/>}/>

              <Route path='/dashboard/tarefas' element={<Tarefas/>}/>

              <Route path='/dashboard/perfil' element={<Perfil/>}/>

              <Route path='/login' element={<Login/>}/>

              <Route path='*' element={<Error />} />
              
            </Route>

          </Routes>
      </Router>
  </ThemeProvider>
    </>
  
)
}

