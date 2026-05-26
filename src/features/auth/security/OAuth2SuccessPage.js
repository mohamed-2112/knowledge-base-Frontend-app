import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { refreshCsrfToken } from '../../../api/apiClient';

export default function OAuth2SuccessPage() {
    const navigate = useNavigate();

    useEffect(() => {
        async function completeLogin() {
            await refreshCsrfToken();
        navigate("/profile",{replace: true});
        }
        completeLogin();
    }, [navigate]);

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow p-4" style={{ maxWidth: "420px", width: "100%" }}>
                <div className="card-body text-center">
                    <h2 className="mb-3">Login Successful</h2>
                    <p className="text-muted mb-4">
                        You have successfully logged in. Redirecting to your profile...
                    </p>

                </div>
            </div>
        </div>
    );
}