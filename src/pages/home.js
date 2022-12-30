import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/moviecard";
import AuthContext from "../context/AuthContext";
import FavoritesContext from "../context/FavoritesContext";

export default function Home(props) {
  const [token] = useContext(AuthContext);
  const [favorites] = useContext(FavoritesContext);
  const [movies, setMovies] = useState([]);

  const omdbApiBaseUrl = props.omdbApi;
  const userApiBaseUrl = props.userApi;

  async function transformFavToMovies() {
    const favMovies = await Promise.all(favorites.map(async (fav) => {
      try {
        const params = {
          i: fav,
          apikey: process.env.REACT_APP_OMDB_API_KEY,
        }

        const res = await fetch(omdbApiBaseUrl + new URLSearchParams(params));
        if (res.ok) {
          const json = await res.json();

          if (json.Response === "True") {
            return json;
          }
        }
      } catch (err) {
        console.error(err);
      }
    }));
    console.debug(favMovies);
    setMovies(favMovies);
  }

  useEffect(() => {
    transformFavToMovies();
  }, [favorites]);

  return (
    <div>
      <h2>Meus favoritos</h2>
      {token !== '' && (
        <div className="movies-list">
          {movies.length > 0 && (movies.map(movie =>
            <MovieCard key={movie.imdbID} movie={movie} userApi={userApiBaseUrl}
              updateParent={transformFavToMovies} />
          ))}
          {favorites.length === 0 && (
            <p>
              Você ainda não favoritou nenhum título, que tal <Link to="/Buscar">buscar um filme</Link> de seu interesse?
            </p>
          )}
        </div>
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