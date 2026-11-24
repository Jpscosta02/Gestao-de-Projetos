
import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate } from "react-router";

import { register } from "../services/authService";
import { useAuth } from "../context/AuthContext";

import "../styles/AuthPages.css";

export default function RegisterPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (password !== passwordConfirmation) {
      setError("As palavras-passe não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });

      // Atualizar o utilizador autenticado
      setUser(response.user);

      // Redirecionar para os projetos
      navigate("/projects", { replace: true });

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Não foi possível registar o utilizador."
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

          <h1>Criar conta</h1>

          <p>
            Regista-te gratuitamente e começa a organizar
            os teus projetos e tarefas num só lugar.
          </p>
        </header>

        {/* Campos */}
        <div className="auth-form__fields">

          {/* Nome */}
          <div className="auth-form__field">
            <label htmlFor="register-name">Nome</label>

            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="O teu nome"
              autoComplete="name"
              maxLength={255}
              required
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className="auth-form__field">
            <label htmlFor="register-email">Email</label>

            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="exemplo@email.com"
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          {/* Palavra-passe */}
          <div className="auth-form__field">
            <label htmlFor="register-password">
              Palavra-passe
            </label>

            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mínimo de 8 caracteres"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={loading}
            />
          </div>

          {/* Confirmação */}
          <div className="auth-form__field">
            <label htmlFor="register-password-confirmation">
              Confirmar palavra-passe
            </label>

            <input
              id="register-password-confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(event) =>
                setPasswordConfirmation(event.target.value)
              }
              placeholder="Repete a palavra-passe"
              autoComplete="new-password"
              minLength={8}
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

        {/* Botão de registo */}
        <button
          className="auth-form__submit"
          type="submit"
          disabled={
            loading ||
            !name.trim() ||
            !email.trim() ||
            password.length < 8 ||
            password !== passwordConfirmation
          }
        >
          {loading ? "A criar conta..." : "Criar conta"}
        </button>

        {/* Navegação para login */}
        <p className="auth-form__footer">
          Já tens conta?{" "}
          <Link to="/login">Iniciar sessão</Link>
        </p>

      </form>
    </main>
  );
}
