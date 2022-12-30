import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import MovieSvg from '../img/emptyposter.svg';

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Details(props) {
  const [token] = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);

  const movieId = useParams().id;
  const omdbApiBaseUrl = props.omdbApi;
  const userApiBaseUrl = props.userApi;

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
      console.debug(json.reviews);
      setReviews(json.reviews);
    }
  }

  useEffect(() => {
    getMovieData();
    getMovieReviews();
  }, [])

  return (
    <div>
      {movie && (
        <>
          <h2>{movie.Title}</h2>
          <div className="flex-container">
            <div className="details-poster-container">
              {movie.Poster !== "N/A" && (
                <img className="details-poster" src={movie.Poster} alt={"Poster de '" + movie.Title + "'"}></img>
              )}
              {movie.Poster === "N/A" && (
                <img className="details-poster" src={MovieSvg} alt={"Poster não disponibilizado"}></img>
              )}
            </div>
            <div className="details-movie-data">
              <em>
                {movie.Type === "movie" ? "Filme" : movie.Type === "series" ? "Série" : movie.Type === "episode" ? "Episódio" : capitalize(movie.Type)}
              </em>
              <div><strong><em>Ano: </em></strong>{movie.Year}</div>
              <div className="flex-container">
                <strong style={{ "paddingRight": "4px" }}><em>Gênero(s):</em></strong>
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
                <div><strong><em>Duração: </em></strong>{movie.Runtime}</div>
              )}
            </div>
          </div>
          <h3>Comentários:</h3>
          {reviews && reviews.map(review =>
            <div key={review.user.name} style={{"margin": "8px 0"}}>
              <strong>{review.user.name}:</strong>
              <div>{review.comment}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}