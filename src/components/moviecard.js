export default function MovieCard(props) {
  const movie = props.movie
  return (
    <div className="movie">
      <div><em>{movie.Type === "movie" ? "Filme" : movie.Type === "series" ? "Série" : "Episódio"}</em></div>
      <div><em>Título: </em>{movie.Title}</div>
      <div><em>Ano: </em>{movie.Year}</div>
    </div>
  );
}
