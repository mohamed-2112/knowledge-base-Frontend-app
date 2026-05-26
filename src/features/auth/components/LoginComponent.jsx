import React from 'react';
import useAuth from '../security/useAuth';
export default function LoginComponent() {

    const { login } = useAuth();


    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow p-4" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="card-body text-center">
          <h2 className="mb-3">Knowledge Base</h2>

          <p className="text-muted mb-4">
            Sign in with your Google account to continue.
          </p>

          <button
            className="btn btn-primary w-100"
            onClick={login}
          >
            Login with Google
          </button>
        </div>
      </div>
    </div>
    );
}

