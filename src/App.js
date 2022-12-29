import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import AuthContext from './context/AuthContext';
import About from './pages/about';
import Home from './pages/home';
import Movies from './pages/movies';
import Login from './pages/login';
import NavMenu from './components/navmenu';
import Register from './pages/register';
import Details from './pages/details';

function App() {
  const initialToken = localStorage.getItem('token');
  const [token, setToken] = useState(initialToken);

  const userApiUrl = `https://tstapi.ffcloud.com.br/`;
  const omdbApiUrl = `http://www.omdbapi.com/?`;

  return (
    <AuthContext.Provider value={[token, setToken]}>
      <BrowserRouter>
        <h1>Lista de Filmes Favoritos</h1>
        <NavMenu  api={userApiUrl}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Buscar" element={<Movies userApi={userApiUrl} omdbApi={omdbApiUrl}/>} />
          <Route path="/Sobre" element={<About />} />
          <Route path="/Entrar" element={<Login api={userApiUrl}/>} />
          <Route path="/Cadastrar" element={<Register api={userApiUrl}/>} />
          <Route path="/Detalhes/:id" element={<Details userApi={userApiUrl} omdbApi={omdbApiUrl}/>}/>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
