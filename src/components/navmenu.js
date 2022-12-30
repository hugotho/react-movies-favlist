import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import FavoritesContext from "../context/FavoritesContext";

export default function NavMenu(props) {
  const [token, setToken] = useContext(AuthContext);
  const [favorites, setFavorites] = useContext(FavoritesContext);
  const [pathname, setPathname] = useState(window.location.pathname);
  const [me, setMe] = useState(null);
  const location = useLocation();
  const navigateTo = useNavigate();

  const apiBaseUrl = props.api;

  if (false) {
    console.log(favorites);
  }

  useEffect(() => {
    setPathname(location.pathname);
  }, [location]);

  useEffect(() => {
    async function fetchMe() {
      if (token !== '') {
        const res = await fetch(apiBaseUrl + 'auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const json = await res.json();
          setMe(json);
        }
      }
    }
    fetchMe();
  }, [token, apiBaseUrl])

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
            {me && (<span>Olá {me.name.split(' ')[0]}!</span>)}
            <button onClick={(event) => {
              event.preventDefault();
              localStorage.setItem('token', '');
              setFavorites([]);
              setToken('');
            }}> Sair </button>
          </>
        )}
      </nav>
    );
  }

  return (
    <nav>
      <Link onClick={() => { navigateTo(-1) }}>&laquo; Voltar</Link>
    </nav>
  );
}