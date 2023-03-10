import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import FavoritesContext from "../context/FavoritesContext";
import MovieSvg from '../img/emptyposter.svg';

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Details(props) {
  const movieId = useParams().id;

  const [token] = useContext(AuthContext);
  const [favorites, setFavorites] = useContext(FavoritesContext);
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(favorites.includes(movieId))
  const [reviews, setReviews] = useState([]);
  const [myself, setMyself] = useState(null);
  const [myReview, setMyReview] = useState(null);
  const [otherReviews, setOtherReviews] = useState([]);
  const [reviewInput, setReviewInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const omdbApiBaseUrl = props.omdbApi;
  const userApiBaseUrl = props.userApi;

  let apiBlocking = false;

  async function getMovieData() {
    try {
      const params = {
        i: movieId,
        apikey: process.env.REACT_APP_OMDB_API_KEY,
      }

      const res = await fetch(omdbApiBaseUrl + new URLSearchParams(params));
      if (res.ok) {
        const json = await res.json();

        if (json.Response === "True") {
          setMovie(json);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function getMyself() {
    if (token !== '') {
      const res = await fetch(userApiBaseUrl + 'auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const json = await res.json();
        setMyself(json);
      }
    }
  };

  async function addUserFavorite() {
    if (!apiBlocking) {
      try {
        apiBlocking = true;
        const data = {
          imdbID: movie.imdbID,
        }
        const res = await fetch(userApiBaseUrl + 'favorites', {
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
        const res = await fetch(userApiBaseUrl + 'favorites/' + movie.imdbID, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + token,
          }
        })
        if (res.ok) {
          const favoritesLocal = favorites;
          const targetIndex = favoritesLocal.indexOf(movie.imdbID);
          favoritesLocal.splice(targetIndex, 1);

          setFavorites(favoritesLocal);
          setIsFavorite(false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        apiBlocking = false;
      }
    }
  }

  async function getMovieReviews() {
    const res = await fetch(userApiBaseUrl + 'reviews/' + movieId, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    if (res.ok) {
      const json = await res.json();

      setReviews(json.reviews);
    }
  }

  async function addReview() {
    try {
      apiBlocking = true;
      const data = {
        comment: reviewInput,
        stars: 5
      }
      const res = await fetch(userApiBaseUrl + 'reviews/' + movieId, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        }
      })
      if (res.ok) {
        setMyReview(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      apiBlocking = false;
    }
  }

  async function removeReview() {
    if (!apiBlocking) {
      try {
        const res = await fetch(userApiBaseUrl + 'reviews/' + movie.imdbID, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + token,
          }
        })
        if (res.ok) {
          setMyReview(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        apiBlocking = false;
      }
    }
  }

  async function alterReview() {
    await removeReview();
    await addReview();
    setIsEditing(false);
  }

  useEffect(() => {
    getMovieReviews();
  }, [myReview]);

  useEffect(() => {
    if (token) {
      getMyself();
    }
    getMovieReviews();
    getMovieData();

  }, []);

  useEffect(() => {
    const allReviews = reviews;
    const myReviewLocal = allReviews.find((review) => {
      return review.user.name === myself.name
    })
    const otherPeopleReviews = allReviews.filter((review) => {
      return review.user.name !== myself.name
    })
    setMyReview(myReviewLocal);
    setOtherReviews(otherPeopleReviews);
  }, [myself]);

  return (
    <div>
      {movie && (
        <>
          {!token && (
            <h2>{movie.Title}</h2>
          )}
          {token && (
            <div className="flex-container">
              <h2 style={{ "marginRight": "8px" }}>{movie.Title}</h2>
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
            </div>
          )}
          <div className="flex-container">
            <div className="details-poster-container">
              {movie.Poster !== "N/A" && (
                <img className="details-poster" src={movie.Poster} alt={"Poster de '" + movie.Title + "'"}></img>
              )}
              {movie.Poster === "N/A" && (
                <img className="details-poster" src={MovieSvg} alt={"Poster n??o disponibilizado"}></img>
              )}
            </div>
            <div className="details-movie-data">
              <em>
                {movie.Type === "movie" ? "Filme" : movie.Type === "series" ? "S??rie" : movie.Type === "episode" ? "Epis??dio" : capitalize(movie.Type)}
              </em>
              <div><strong><em>Ano: </em></strong>{movie.Year}</div>
              <div className="flex-container">
                <strong style={{ "paddingRight": "4px" }}><em>G??nero(s):</em></strong>
                <span>{movie.Genre}</span>
              </div>
              {movie.Director !== "N/A" && (
                <div className="flex-container">
                  <strong style={{ "paddingRight": "4px" }}><em>Diretor(es):</em></strong>
                  <span>{movie.Director}</span>
                </div>
              )}
              {movie.Actors !== "N/A" && (
                <div className="flex-container">
                  <strong style={{ "paddingRight": "4px" }}><em>Ator(es):</em></strong>
                  <span>{movie.Actors}</span>
                </div>
              )}
              {movie.Runtime !== "N/A" && (
                <div><strong><em>Dura????o: </em></strong>{movie.Runtime}</div>
              )}
            </div>
          </div>
          <h3>Coment??rios:</h3>
          {!token && reviews && reviews.map(review =>
            <div key={review.user.name} style={{ "margin": "8px 0" }}>
              <strong><em>{review.user.name}:</em></strong>
              <div>{review.comment}</div>
            </div>
          )}
          {token && (
            <>
              <h4 style={{ "color": "black" }}>Seu comet??rio:</h4>
              {!myReview && (
                <>
                  <form id="review-form">
                    <textarea placeholder="Escreva seu coment??rio aqui" value={reviewInput} onChange={(event) => {
                      setReviewInput(event.target.value);
                    }} />
                    <button type="submit" onClick={(event) => {
                      event.preventDefault();
                      addReview();
                    }}>Inserir</button>
                  </form>
                </>
              )}
              {myReview && (
                <>
                  {!isEditing && (
                    <>
                      <div>{myReview.comment}</div>
                      <button className="reset-button buttonToLink" onClick={(event) => {
                        event.preventDefault();
                        setReviewInput(myReview.comment);
                        setIsEditing(true);
                      }}>Editar</button>
                      <button className="reset-button buttonToLink" onClick={(event) => {
                        event.preventDefault();
                        event.preventDefault();
                        removeReview();
                      }}>Apagar</button>
                    </>
                  )}
                  {isEditing && (
                    <>
                      <form id="review-form">
                        <textarea placeholder="Escreva seu coment??rio aqui" value={reviewInput} onChange={(event) => {
                          setReviewInput(event.target.value);
                        }} />
                        <div className="flex-container">
                          <button type="Cancelar" onClick={(event) => {
                            event.preventDefault();
                            setIsEditing(false);
                          }}>Cancelar</button>
                          <button type="submit" onClick={(event) => {
                            event.preventDefault();
                            alterReview();
                          }}>Inserir altera????es</button>
                        </div>
                      </form>
                    </>
                  )}
                </>
              )}
              {otherReviews && (
                <>
                  <hr />
                  <h4>Demais coment??rios:</h4>
                  {otherReviews.map(review =>
                    <div key={review.user.name} style={{ "margin": "8px 0" }}>
                      <strong><em>{review.user.name}:</em></strong>
                      <div>{review.comment}</div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}