import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import './App.css';
import AuthContext from './context/AuthContext';
import About from './pages/about';
import Home from './pages/home';
import Movies from './pages/movies';
import Login from './pages/login';

function App() {
  return (
    <AuthContext.Provider>
      <BrowserRouter>
        <h1>Lista de Filmes Favoritos</h1>
        <nav>
          <Link to="/">Meus Favoritos</Link>
          <Link to="/Buscar">Buscar Filmes</Link>
          <Link to="/Sobre">Sobre</Link>
          <span>Olá visitante!</span>
          <Link to="/Entrar">Entrar</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Buscar" element={<Movies />} />
          <Route path="/Sobre" element={<About />} />
          <Route path="/Entrar" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
