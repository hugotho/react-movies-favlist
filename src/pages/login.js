import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useContext(AuthContext);
  const navigateTo = useNavigate()

  const apiBaseUrl = props.api;

  // Usuário já logado => Redireciona para Home
  useEffect(() => {
    if (token !== '') {
      navigateTo('/');
    }
  }, [token, navigateTo]);

  return (
    <div>
      <h2>Login</h2>

      <form>
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
            email,
            password,
          }
          const res = await fetch(apiBaseUrl + 'auth/signin', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          if (res.ok) {
            const json = await res.json();
            setToken(json.user.token);
            localStorage.setItem('token', json.user.token);
            navigateTo('/');
          } else {
            const json = await res.json();
            alert(json.msg);
          }
        }}>Entrar</button>
      </form>

      <div>Não possui cadastro?</div>
      <Link to="/Cadastrar">Cadastrar</Link>
    </div>
  );
}