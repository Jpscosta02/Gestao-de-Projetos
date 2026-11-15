
import { useState } from "react";
import type { SubmitEvent } from "react";

import { register } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { setUser } = useAuth();

  // Estados do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPassword_confirmation] = useState("");

  // Estados de controlo
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError("");

    // Verificar se as palavras-passe coincidem
    if (password !== password_confirmation) {
      setError("As palavras-passe não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation,
      });

      // Atualizar o utilizador autenticado
      setUser(response.user);

      // Limpar os campos após o registo
      setName("");
      setEmail("");
      setPassword("");
      setPassword_confirmation("");
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
    <main className="register-page">
      <form className="ui-form register-form" onSubmit={handleSubmit}>
        <div className="ui-form__header">
          <span className="eyebrow">GESTOR DE PROJETOS</span>

          <h1>Criar conta</h1>

          <p>
            Regista-te para começares a organizar os teus
            projetos e tarefas.
          </p>
        </div>

        {/* Nome */}
        <div className="form-field">
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
        <div className="form-field">
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
        <div className="form-field">
          <label htmlFor="register-password">Palavra-passe</label>

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

        {/* Confirmar palavra-passe */}
        <div className="form-field">
          <label htmlFor="register-password-confirmation">
            Confirmar palavra-passe
          </label>

          <input
            id="register-password-confirmation"
            type="password"
            value={password_confirmation}
            onChange={(event) =>
              setPassword_confirmation(event.target.value)
            }
            placeholder="Repete a palavra-passe"
            autoComplete="new-password"
            minLength={8}
            required
            disabled={loading}
          />
        </div>

        {/* Mensagem de erro */}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {/* Botão de registo */}
        <button
          className="ui-btn ui-btn--primary"
          type="submit"
          disabled={
            loading ||
            !name.trim() ||
            !email.trim() ||
            password.length < 8 ||
            password !== password_confirmation
          }
        >
          {loading ? "A criar conta..." : "Criar conta"}
        </button>
      </form>
    </main>
  );
}
