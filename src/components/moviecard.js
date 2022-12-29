import React from 'react';
import { Link } from 'react-router-dom';
import MovieSvg from '../emptyposter.svg';

export default function MovieCard(props) {
  const movie = props.movie

  return (
    <div className="movie flex-container">
      <div className="poster-container">
        {movie.Poster !== "N/A" && (
          <img className="poster" src={movie.Poster} alt={"Poster de '" + movie.Title + "'"}></img>
        )}
        {movie.Poster === "N/A" && (
          <img className="poster" src={MovieSvg} alt={"Poster não disponibilizado"}></img>
        )}
      </div>
      <div className="movie-data">
        <div>
          <div><em>{movie.Type === "movie" ? "Filme" : movie.Type === "series" ? "Série" : "Episódio"}</em></div>
          <div className="flex-container">
            <strong style={{ "paddingRight": "4px" }}><em>Título:</em></strong>
            <span>{movie.Title}</span>
          </div>
          <div><strong><em>Ano: </em></strong>{movie.Year}</div>
        </div>
        <Link className="movie-more-details" to={"/Detalhes/" + movie.imdbID}>+detalhes</Link>
      </div>
    </div>
  );
}
