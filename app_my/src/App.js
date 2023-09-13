import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import Cadastro from './components/pages/Cadastro'


function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Cadastro" element={<Cadastro />} />
      </Routes>
      <Footer/>
    </Router>

  )
}

export default App
