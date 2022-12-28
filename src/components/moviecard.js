export default function MovieCard(props) {
  const movie = props.movie
  return (
    <div className="movie">
      <img src={movie.Poster} alt={"Poster de '" + movie.Title + "'"}></img>
      <div><em>{movie.Type === "movie" ? "Filme" : movie.Type === "series" ? "Série" : "Episódio"}</em></div>
      <div><em>Título: </em>{movie.Title}</div>
      <div><em>Ano: </em>{movie.Year}</div>
    </div>
  );
}
