import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useContext(AuthContext);
  const navigateTo = useNavigate()

  // Usuário já logado => Redireciona para Home
  useEffect(() => {
    if (token !== '') {
      navigateTo('/');
    }
  }, []);

  return (
    <div>
      <h2>Login</h2>
      <form>
        <label for="username">e-mail:</label>
        <input id="username" type="text" value={email} />
        <label for="password">password:</label>
        <input id="password" type="text" value={password} />
        <button>Entrar</button>
      </form>
    </div>
  );
}