import React, {useState} from 'react';
import PersonalInfoFormModal from './PersonalInfoFormModal';
import "../styles/profile.css";

export default function PersonalInfo({profileItem, loading, error, onItemsChanged}) {

    const [isFormOpen, setIsFormOpen] = useState(false);
    const personalInfo = profileItem?.attributes?.user || {};
    const hasPersonalInfo = Object.keys(personalInfo).length > 0;
    
    return (

        <section className="app-section">

            <div className="personal-info-section-header">
                <div>
                    <h2 className="section-title">Personal Information</h2>
                    <p className="section-description">
                        Profile related Knowledge.
                    </p>

                </div>

                {!loading && (
                    <button
                        type="button"
                        className="btn-app-primary"
                        onClick={() => setIsFormOpen(true)}
                    >
                        {profileItem ? "Edit Personal Info" : "Add Personal Info"}
                    </button>
                )}

            </div>

            

            <div className="app-card personal-info-card">
                {loading && <p className="empty-text">Loading personal information...</p>}

                {!loading && error && (
                <p className="error-text">{error}</p>
                )}

                {!loading && !error && !hasPersonalInfo && (
                <p className="empty-text">No personal information available.</p>
                )}

                {!loading && !error && hasPersonalInfo && (
                <div className="personal-info-list">
                    {Object.entries(personalInfo).map(([key, value]) => (
                        <div className="personal-info-row" key={key}>
                            <span className="personal-info-key">{formatLabel(key)}</span>
                            <span className="personal-info-value">{String(value)}</span>
                        </div>
                    ))}
                </div>    
                )}
            </div>

            <PersonalInfoFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSaved={onItemsChanged}
                profileItem={profileItem}
            />
            
        </section>
    );
}

function formatLabel(value) {
    return value.replace(/([A-Z])/g, ' $1').replace(/_/g, " ").replace(/^./, (char) => char.toUpperCase());
}