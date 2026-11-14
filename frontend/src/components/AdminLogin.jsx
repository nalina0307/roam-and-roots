
import { useState } from "react";

function AdminLogin({ onLogin, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

 async function handleSubmit(event) {
  event.preventDefault();

  const success = await onLogin(username, password);

  if (!success) {
    setError("Invalid username or password");
  }
}

  return (
    <div className="roam-modal-backdrop">
      <section className="roam-modal admin-login">
        <header className="roam-modal-header">
          <div>
            <span>ROAM & ROOTS</span>
            <h2>Admin Login</h2>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit} className="roam-form">
          <label>
            Username
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && (
            <p className="admin-login-error">{error}</p>
          )}

          <div className="roam-form-actions">
            <button
              type="button"
              className="form-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="form-save">
              Login
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AdminLogin;
