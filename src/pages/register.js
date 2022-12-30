import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Register(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token] = useContext(AuthContext);
  const navigateTo = useNavigate();

  
  const apiBaseUrl = props.api;

  // Usuário já logado => Redireciona para Home
  useEffect(() => {
    if (token !== '') {
      navigateTo('/');
    }
  }, [token, navigateTo]);

  return (
    <div>
      <h2>Cadastrar</h2>

      <form>
      <label htmlFor="name">Nome:</label>
        <input id="name" type="text" value={name} onChange={(event) =>{
          setName(event.target.value)
        }} />

        <label htmlFor="username">e-mail:</label>
        <input id="username" type="text" value={email} onChange={(event) =>{
          setEmail(event.target.value)
        }} />

        <label htmlFor="password">password:</label>
        <input id="password" type="password" value={password} onChange={(event) => {
          setPassword(event.target.value)
        }} />

        <button onClick={async (event) => {
          event.preventDefault();
          const data = {
            name,
            email,
            password,
          };
          const res = await fetch(apiBaseUrl + 'auth/signup', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          if (res.ok) {
            alert("Usuário Criado com Sucesso!\nPor favor realize o Login")
            navigateTo(-1);
          } else {
            const json = await res.json();
            alert(json.msg);
          }
        }}>Cadastrar</button>
      </form>
    </div>
  );
}