import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function NavMenu() {
  const [token, setToken] = useContext(AuthContext);
  const [pathname, setPathname] = useState(window.location.pathname)
  const location = useLocation();
  const navigateTo = useNavigate()

  useEffect(() => {
    setPathname(location.pathname)
  }, [location]);

  if (pathname !== "/Entrar" && pathname !== "/Cadastrar") {
    return (
      <nav><Link to="/">Meus Favoritos</Link>
        <Link to="/Buscar">Buscar Filmes</Link>
        <Link to="/Sobre">Sobre</Link>
        {token === '' && (
          <>
            <span>Olá visitante!</span>
            <button onClick={(event) => {
              event.preventDefault();
              navigateTo("/Entrar")
            }}>Entrar</button>
          </>
        )}
        {token !== '' && (
          <>
            <span></span>
            <button onClick={(event) => {
              event.preventDefault();
              localStorage.setItem('token', '');
              setToken('');
            }}> Sair </button>
          </>
        )}
      </nav>
    );
  } else {
    return (
      <nav>
        <Link onClick={() => { navigateTo(-1) }}>&laquo; Voltar</Link>
      </nav>
    );
  }
}