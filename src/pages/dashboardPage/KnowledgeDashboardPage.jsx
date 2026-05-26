import React from 'react';
import PersonalInfo from '../../features/profile/components/PersonalInfo';
import KnowledgeItems from '../../features/knowledge/components/KnowledgeItems';
import ProfileSection from '../../features/profile/components/ProfileSection';
import useKnowledgeItems from '../../features/knowledge/hooks/useKnowledgeItems';
import UiCustomizationPanel from '../../features/uiCustomization/components/UiCustomizationPanel';
import useActiveUiTemplate from "../../features/uiCustomization/hooks/useActiveUiTemplate";
import DynamicDashboardRenderer from '../../features/uiCustomization/renderer/DynamicDashboardRenderer';
import { createThemeStyle } from "../../features/uiCustomization/renderer/dynamicThemeUtils";



export default function KnowledgeDashboardPage() {

    const {
        profileItem,
        knowledgeItems,
        loading,
        error,
        refresh,
    } = useKnowledgeItems();

    const {
        activeTemplate,
        loadingActiveTemplate,
        activeTemplateError,
        reloadActiveTemplate,
    } = useActiveUiTemplate("dashboard");
    
    return (
        <main className="app-page dynamic-theme-scope"
        style={activeTemplate ? createThemeStyle(activeTemplate.theme) : undefined}>
            <div className="app-container">
                <header className="hero-section">
                    <h1 className="app-title">Knowledge Base</h1>
                    <p className="app-subtitle">Manage your knowledge and information</p>
                </header>
                <ProfileSection />

                {activeTemplateError && (
                    <div className="app-card" style={{ marginTop: "1.5rem" }}>
                        <p className="error-text">{activeTemplateError}</p>
                    </div>
                )}

                {loadingActiveTemplate && (
                    <div className="app-card" style={{ marginTop: "1.5rem" }}>
                        <p className="empty-text">Loading interface preferences...</p>
                    </div>
                )}

                {!loadingActiveTemplate && (
                    <DynamicDashboardRenderer
                        template={activeTemplate}
                        profileItem={profileItem}
                        knowledgeItems={knowledgeItems}
                        loading={loading}
                        error={error}
                        onItemsChanged={refresh}
                    />
                )}

                {/* <div className="dashboard-grid">
                    <PersonalInfo 
                    profileItem={profileItem} 
                    loading={loading}
                    error={error}
                    onItemsChanged={refresh}
                    />

                    <KnowledgeItems 
                    items={knowledgeItems}
                    loading={loading}
                    error={error}
                    onItemsChanged={refresh}
                    />

                </div> */}

                <UiCustomizationPanel onTemplateApplied={reloadActiveTemplate}/>

                
                
            </div>
        </main>
    );
}

