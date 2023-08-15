import { useState } from "react";

// Hashes the submission and compares it to the hash defined for the environment
// This is not secure at all, it's just enough to be confusing
const digestMessage = async (message) => {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export const StagingLogin = ({ setAuthed }) => {
  const [loading, setLoading] = useState(false);

  const evaulatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const password = document.getElementById("password").value;

    if (
      (await digestMessage(password)) ===
      process.env.REACT_APP_SITE_GATING_MATCH
    )
      setAuthed(true);
    else alert("Incorrect password");
    setLoading(false);
  };

  return (
    <form>
      <p>This site requires a password to view.</p>
      <input id="password" type="password" />
      &nbsp;&nbsp;
      <input
        type="submit"
        disabled={loading}
        onClick={evaulatePassword}
        value={loading ? "Loading" : "Login"}
      />
    </form>
  );
};
