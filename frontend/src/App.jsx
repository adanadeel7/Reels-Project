import { useState } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home.jsx'
import UserLogin from './pages/UserLogin.jsx'
import UserRegister from './pages/UserRegister.jsx'
import PartnerLogin from './pages/PartnerLogin.jsx'
import PartnerRegister from './pages/PartnerRegister.jsx'
import PartnerDashboard from './pages/PartnerDashboard.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Toaster position='top-center'/> 
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<UserLogin/>}/>
          <Route path='/register' element={<UserRegister/>}/>
          <Route path='/partner/login' element={<PartnerLogin/>}/>
          <Route path='/partner/register' element={<PartnerRegister/>}/>
          <Route path='/partner/dashboard' element={<PartnerDashboard/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
