import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import FavoritesContext from "../context/FavoritesContext";

export default function Home() {
  const [token] = useContext(AuthContext);
  const [favorites] = useContext(FavoritesContext);

  return (
    <div>
      <h2>Meus favoritos</h2>
      {token !== '' && (
        <>
          {favorites.length > 0 && (favorites.map(fav =>
            <div key={fav}>{fav}</div>
          ))}
        </>
      )}
      {token === '' && (
        <div>
          <p>
            Para ter acesso a esta funcionalidade realize seu <Link to="/Entrar">login</Link>.<br />
            Não possui credenciais? <Link to="/Cadastrar">faça seu cadastro</Link>.
          </p>
        </div>
      )}
    </div>
  );
}