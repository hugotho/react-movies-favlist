import { useEffect, useState } from "react";
import MovieCard from "../components/moviecard";

function isEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export default function Movies(props) {
  const [isWaiting, setIsWaiting] = useState(false);
  const [downPageDisable, setDownPageDisable] = useState(true);
  const [upPageDisable, setUpPageDisable] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [displayPage, setDisplayPage] = props.memPage;
  const [lastSearchParams, setLastSearchParams] = props.memSearch;
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [type, setType] = useState('');
  const [movies, setMovies] = useState([]);
  const [moviesCount, setMoviesCount] = useState(0);
  const [showErrorText, setShowErrorText] = useState(false);

  const omdbApiBaseUrl = props.omdbApi;
  const userApiBaseUrl = props.userApi;

  useEffect(() => {
    if (title !== "") {
      setSearchParams(Object.assign({ s: title },
        year === "" ? null : { y: year },
        type === "" ? null : { type },
        { apikey: process.env.REACT_APP_OMDB_API_KEY },
      ));
    }
  }, [title, year, type]);

  useEffect(() => {
    setDownPageDisable(displayPage === 1);
    setUpPageDisable(displayPage >= Math.ceil(moviesCount / 10));
  }, [displayPage, moviesCount]);

  useEffect(() => {
    if (!isEmpty(lastSearchParams)) {
      setTitle(lastSearchParams.s);
      setYear(lastSearchParams.hasOwnProperty('year')? lastSearchParams.year : '')
      setType(lastSearchParams.hasOwnProperty('type')? lastSearchParams.type : '')
      let page = displayPage
      getMoviesList(lastSearchParams, page);
    }
  }, [])

  async function getMoviesList(params, page) {
    try {
      setIsWaiting(true);
      const paramsWithPage = Object.assign(params, { page: page });
      console.debug(paramsWithPage);
      const res = await fetch(omdbApiBaseUrl + new URLSearchParams(paramsWithPage));
      if (res.ok) {
        const json = await res.json();

        if (json.Response === "True") {
          setNotFound(false);
          setMovies(json.Search);
          setMoviesCount(json.totalResults);
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
            setDisplayPage(1);
            getMoviesList(searchParams, 1);
            setLastSearchParams(searchParams);
          }
        }}>buscar</button>
      </form>
      {notFound && (
        <div id="not-found">
          <p>Nenhum Título encontrado</p>
        </div>
      )}
      {movies.length !== 0 && (
        <div className="movies">
          <div className="page-selector">
            <button disabled={downPageDisable || isWaiting} onClick={async () => {
              let page = displayPage - 1
              setDisplayPage(page);
              getMoviesList(lastSearchParams, page);
            }}>&laquo;</button>
            <span>Página {displayPage} de {Math.ceil(moviesCount / 10)}</span>
            <button disabled={upPageDisable || isWaiting} onClick={async () => {
              let page = displayPage + 1;
              setDisplayPage(page);
              getMoviesList(lastSearchParams, page);
            }}>&raquo;</button>
            <span>(Mostrando {(displayPage - 1) * 10 + 1}&#8211;{Math.min(displayPage * 10, moviesCount)} de {moviesCount} resultados)</span>
          </div>
          <div className="movies-list">
            {movies && movies.map(movie =>
              <MovieCard key={movie.imdbID} movie={movie} userApi={userApiBaseUrl} />
            )}
          </div>
        </div>
      )}
    </>
  );
}