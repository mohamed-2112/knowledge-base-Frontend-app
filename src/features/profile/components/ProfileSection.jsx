import React from 'react';
import useAuth from '../../auth/security/useAuth';
import "../styles/profile.css";

export default function ProfileSection() {

    const { user, logout } = useAuth();
    
    return (
        <section className="app-section">
            <div className="profile-header">
                <div className="profile-user">
                    <img src="https://lh3.googleusercontent.com/a/ACg8ocL21TFDLj5B6xRgf98x7pd2ZqKBqRYAq2vJRbpexmFXlHub4ldb=s96-c" alt="Profile" className="profile-avatar" />
                    <div>
                        <h2 className="profile-name">{user?.name}</h2>
                        <p className="profile-email">{user?.email}</p>
                        <span className="app-badge">{user?.role}</span>
                    </div>
                </div>
                <button className="btn-app-outline" onClick={logout}>
                    Logout
                </button>
            </div>
        </section>
    );
}

