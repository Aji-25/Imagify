import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Generate from './pages/Generate.jsx'
import Pricing from './pages/Pricing.jsx'
import History from './pages/History.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Login from './pages/Login.jsx'
import { AppContext } from './context/AppContext.jsx'

const App = () => {
  const { showLogin } = useContext(AppContext)
  return (
    <div className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50'>
      <Navbar/>
      {showLogin && <Login/>}
      <Routes>
        <Route path={'/'} element={<Home />} />
        <Route path={'/generate'} element={<Generate />} />
        <Route path={'/pricing'} element={<Pricing />} />
        <Route path={'/history'} element={<History />} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
