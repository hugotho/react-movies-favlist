import { useEffect, useState } from "react";

export default function Movies(props) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [isWaiting, setIsWaiting] = useState(false);
  const [downPageDisable, setDownPageDisable] = useState(true);
  const [upPageDisable, setUpPageDisable] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [lastSearchParams, setLastSearchParams] = useState({});
  const [movies, setMovies] = useState([]);
  const [moviesCount, setMoviesCount] = useState(0);
  const [showErrorText, setShowErrorText] = useState(false);

  const omdbApiBaseUrl = props.omdbApi;

  useEffect(() => {
    if (title !== "") {
      setSearchParams(Object.assign({ s: title },
        year === "" ? null : { y: year },
        type === "" ? null : { type },
        { apikey: process.env.REACT_APP_OMDB_API_KEY },
        { page: 1 },
      ));
    }
  }, [title, year, type]);

  useEffect(() => {
    setDownPageDisable(page === 1);
    setUpPageDisable(page >= Math.ceil(moviesCount / 10));
  }, [page, moviesCount]);

  return (
    <>
      <h2>Buscar Filmes</h2>

      <form className="search">
        <label>
          Título:
          <input type="text" value={title} required placeholder="Digite um título completo ou parcial"
            onInvalid={() => this.setCustomValidity('Enter User Name Here')} onChange={(event) => {
              if (showErrorText && event.target.value.length) {
                setShowErrorText(false);
              }
              setTitle(event.target.value);
            }} />
        </label>
        {showErrorText && (
          <div role="alert" style={{ fontSize: "0.8em", color: "rgb(255, 0, 0)" }}>
            Insira um título
          </div>
        )}
        <label>
          Ano:
          <input type="number" value={year} placeholder="Ex.: 2000"
            onChange={(event) => {
              setYear(event.target.value);
            }} />
        </label>
        <label className="radio">
          <input type="radio" value=""
            checked={type === ""}
            onChange={(event) => { setType(event.target.value) }} />
          Tudo
        </label>
        <label className="radio">
          <input type="radio" value="movie"
            checked={type === 'movie'}
            onChange={(event) => { setType(event.target.value) }} />
          Filmes
        </label>
        <label className="radio">
          <input type="radio" value="series"
            checked={type === 'series'}
            onChange={(event) => { setType(event.target.value) }} />
          Séries
        </label>
        <label className="radio">
          <input type="radio" value="episode"
            checked={type === 'episode'}
            onChange={(event) => { setType(event.target.value) }} />
          Episódios
        </label>
        <input type="hidden" name="page" value={1} />
        <button type="submit" disabled={isWaiting} onClick={async (event) => {
          event.preventDefault();
          if (title === "") {
            setShowErrorText(true);
          } else {
            setIsWaiting(true);
            try {
              const res = await fetch(omdbApiBaseUrl + new URLSearchParams(searchParams));
              if (res.ok) {
                const json = await res.json();
                console.log(json);
                if (json.Response === "True") {
                  setNotFound(false);
                  setMovies(json.Search);
                  setPage(1);
                  setMoviesCount(json.totalResults);
                  setLastSearchParams(searchParams);
                } else {
                  setMovies([]);
                  setNotFound(true);
                }
              }
            } catch (err) {
              console.error(err);
            } finally {
              setIsWaiting(false);
            }
          }
        }}>buscar</button>
      </form>
      {notFound && (
        <div id="not-found">
          <p>Nenhum Título encontrado</p>
        </div>
      )}
      {movies.length !== 0 && (
        <div id="movies-list">
          <button disabled={downPageDisable} onClick={() => {
            setPage(page - 1);
          }}>&laquo;</button>
          <span>Página {page} de {Math.ceil(moviesCount / 10)}</span>
          <button disabled={upPageDisable} onClick={() => {
            setPage(page + 1);
          }}>&raquo;</button>
          <span>(Mostrando {(page - 1) * 10 + 1}&#8211;{Math.min(page * 10, moviesCount)} de {moviesCount} resultados)</span>
        </div>
      )}
    </>
  );
}