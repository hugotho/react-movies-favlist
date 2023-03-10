import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import FavoritesContext from '../context/FavoritesContext';
import MovieSvg from '../img/emptyposter.svg';

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function MovieCard(props) {
  const [token] = useContext(AuthContext);
  const [favorites, setFavorites] = useContext(FavoritesContext);
  const [isFavorite, setIsFavorite] = useState(favorites.includes(props.movie.imdbID))

  const movie = props.movie;
  const userApiUrl = props.userApi;

  const updateParent = props.updateParent;

  let apiBlocking = false;

  async function addUserFavorite() {
    if (!apiBlocking) {
      try {
        apiBlocking = true;
        const data = {
          imdbID: movie.imdbID,
        }
        const res = await fetch(userApiUrl + 'favorites', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          }
        })
        if (res.ok) {
          const favoritesLocal = favorites;
          favoritesLocal.push(movie.imdbID);

          setFavorites(favoritesLocal);
          setIsFavorite(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        apiBlocking = false;
      }
    }
  }

  async function removeUserFavorite() {
    if (!apiBlocking) {
      try {
        const res = await fetch(userApiUrl + 'favorites/' + movie.imdbID, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          }
        })
        if (res.ok) {
          const favoritesLocal = favorites;
          const targetIndex = favoritesLocal.indexOf(movie.imdbID);
          favoritesLocal.splice(targetIndex, 1);

          setFavorites(favoritesLocal);
          setIsFavorite(false);
          if (updateParent !== undefined) {
            updateParent();
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        apiBlocking = false;
      }
    }
  }

  return (
    <div className="movie flex-container">
      <div className="poster-container">
        {movie.Poster !== "N/A" && (
          <img className="poster" src={movie.Poster} alt={"Poster de '" + movie.Title + "'"}></img>
        )}
        {movie.Poster === "N/A" && (
          <img className="poster" src={MovieSvg} alt={"Poster n??o disponibilizado"}></img>
        )}
      </div>
      <div className="movie-data">
        <div>
          <div className='movie-header'>
            <em>{movie.Type === "movie" ? "Filme" : movie.Type === "series" ? "S??rie" : movie.Type === "episode" ? "Epis??dio" : capitalize(movie.Type)}</em>
            {token !== "" && (<>
              {isFavorite && (
                <button className='fav-star is-favorite reset-button' onClick={() => {
                  removeUserFavorite();
                }}>&#9733;</button>
              )}
              {!isFavorite && (
                <button className='fav-star reset-button' onClick={() => {
                  addUserFavorite();
                }}>&#9734;</button>
              )}
            </>)}
          </div>
          <div className="flex-container">
            <strong style={{ "paddingRight": "4px" }}><em>T??tulo:</em></strong>
            <span>{movie.Title}</span>
          </div>
          <div><strong><em>Ano: </em></strong>{movie.Year}</div>
        </div>
        <Link className="movie-more-details" to={"/Detalhes/" + movie.imdbID}>+detalhes</Link>
      </div>
    </div>
  );
}
