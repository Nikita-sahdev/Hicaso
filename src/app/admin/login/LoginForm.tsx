"use client";

import { useActionState, useState } from "react";
import { loginAction } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});
  const [shown, setShown] = useState(false);
  return (
    <form action={action} style={{ display: "grid", gap: "1rem", maxWidth: "24rem" }}>
      <label>
        Email
        <input name="email" type="email" autoComplete="username" maxLength={200} required />
      </label>
      <label>
        Password
        <input name="password" type={shown ? "text" : "password"} autoComplete="current-password" maxLength={200} required />
      </label>
      <button className="btn btn--secondary" type="button" aria-pressed={shown} onClick={() => setShown((v) => !v)} style={{ justifySelf: "start" }}>
        {shown ? "Hide password" : "Show password"}
      </button>
      {state.error ? <p role="alert">{state.error}</p> : null}
      <button className="btn btn--primary" type="submit" disabled={pending}>
        Sign in
      </button>
    </form>
  );
}
