import { useState } from "react";

export default function Movies() {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [type, setType] = useState('movie')

  return (
    <div>
      <h2>Buscar Filmes</h2>

      <form className="search">
        <label>
          Título:
          <input placeholder="Digite um título completo ou parcial" type="text" value={title} onChange={(event) => {
            setTitle(event.target.value);
          }} />
        </label>
        <label>
          Ano:
          <input type="number" value={year} onChange={(event) => {
            event.preventDefault();
            setYear(event.target.value);
          }} />
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
        <button onClick={(event) => {
          event.preventDefault();
          console.log('title', title);
          console.log('year', year);
          console.log('type', type);
        }}>buscar</button>
      </form>
    </div >
  );
}