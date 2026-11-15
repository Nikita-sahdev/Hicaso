"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});
  return (
    <form action={action} style={{ display: "grid", gap: "1rem", maxWidth: "24rem" }}>
      <label>
        Email
        <input name="email" type="email" autoComplete="username" maxLength={200} required />
      </label>
      <label>
        Password
        <input name="password" type="password" autoComplete="current-password" maxLength={200} required />
      </label>
      {state.error ? <p role="alert">{state.error}</p> : null}
      <button className="btn btn--primary" type="submit" disabled={pending}>
        Sign in
      </button>
    </form>
  );
}
