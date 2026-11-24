
import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate } from "react-router";

import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

import "../styles/AuthPages.css";

export default function LoginPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await login({
        email: email.trim(),
        password,
      });

      // Atualizar o utilizador autenticado
      setUser(response.user);

      // Redirecionar para os projetos
      navigate("/projects", { replace: true });

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível iniciar sessão."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>

        {/* Cabeçalho */}
        <header className="auth-form__header">
          <span className="auth-form__eyebrow">
            GESTOR DE PROJETOS
          </span>

          <h1>Iniciar sessão</h1>

          <p>
            Bem-vindo de volta! Inicia sessão para
            continuares a gerir os teus projetos e tarefas.
          </p>
        </header>

        {/* Campos */}
        <div className="auth-form__fields">

          <div className="auth-form__field">
            <label htmlFor="login-email">Email</label>

            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="exemplo@email.com"
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="login-password">
              Palavra-passe
            </label>

            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Introduz a tua palavra-passe"
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

        </div>

        {/* Erros */}
        {error && (
          <p className="auth-form__error" role="alert">
            {error}
          </p>
        )}

        {/* Botão de login */}
        <button
          className="auth-form__submit"
          type="submit"
          disabled={loading || !email.trim() || !password}
        >
          {loading ? "A iniciar sessão..." : "Iniciar sessão"}
        </button>

        {/* Navegação para registo */}
        <p className="auth-form__footer">
          Ainda não tens conta?{" "}
          <Link to="/register">Criar conta</Link>
        </p>

      </form>
    </main>
  );
}
