import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import About from './routes/about';
import Home from './routes/home';

function App() {
  return (
    <BrowserRouter>
      <h1>Lista de Filmes Favoritos</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/Sobre">Sobre</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/Sobre' element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
