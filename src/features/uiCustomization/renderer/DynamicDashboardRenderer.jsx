import React from "react";

import PersonalInfo from "../../profile/components/PersonalInfo";
import KnowledgeItems from "../../knowledge/components/KnowledgeItems";

import "./dynamicDashboardRenderer.css";

export default function DynamicDashboardRenderer({
  template,
  profileItem,
  knowledgeItems,
  loading,
  error,
  onItemsChanged,
}) {
  if (!isSupportedDashboardTemplate(template)) {
    return (
      <DefaultDashboardGrid
        profileItem={profileItem}
        knowledgeItems={knowledgeItems}
        loading={loading}
        error={error}
        onItemsChanged={onItemsChanged}
      />
    );
  }

  return renderDashboardGrid(template.tree, {
    profileItem,
    knowledgeItems,
    loading,
    error,
    onItemsChanged,
    theme: template.theme,
  });
}

function isSupportedDashboardTemplate(template) {
  return (
    template &&
    template.page === "dashboard" &&
    template.tree &&
    template.tree.type === "dashboardGrid"
  );
}

function DefaultDashboardGrid({
  profileItem,
  knowledgeItems,
  loading,
  error,
  onItemsChanged,
}) {
  return (
    <div className="dashboard-grid">
      <PersonalInfo
        profileItem={profileItem}
        loading={loading}
        error={error}
        onItemsChanged={onItemsChanged}
      />

      <KnowledgeItems
        items={knowledgeItems}
        loading={loading}
        error={error}
        onItemsChanged={onItemsChanged}
      />
    </div>
  );
}

function renderDashboardGrid(node, context) {
  const columns = safeGridColumns(node.props?.columns);
  const gap = safeGridGap(node.props?.gap);
  const density = context.theme?.density || "comfortable";
  const radius = context.theme?.radius || "medium";

  return (
    <div
      className={[
        "dashboard-grid",
        "dynamic-dashboard-grid",
        `dynamic-dashboard-grid--columns-${columns}`,
        `dynamic-dashboard-grid--gap-${gap}`,
        `dynamic-dashboard-grid--density-${density}`,
        `dynamic-dashboard-grid--radius-${radius}`,
      ].join(" ")}
    >
      {Array.isArray(node.children) &&
        node.children.map((childNode, index) =>
          renderDashboardNode(childNode, context, index)
        )}
    </div>
  );
}

function renderDashboardNode(node, context, index) {
  if (!node?.type) {
    return null;
  }

  switch (node.type) {
    case "profileCard":
      return (
        <PersonalInfo
          key={`profileCard-${index}`}
          profileItem={context.profileItem}
          loading={context.loading}
          error={context.error}
          onItemsChanged={context.onItemsChanged}
        />
      );

    case "knowledgeSummaryCard":
      return (
        <KnowledgeItems
          key={`knowledgeSummaryCard-${index}`}
          items={context.knowledgeItems}
          loading={context.loading}
          error={context.error}
          onItemsChanged={context.onItemsChanged}
        />
      );

    case "recentActivityCard":
      return (
        <RecentActivityCard
          key={`recentActivityCard-${index}`}
          limit={node.props?.limit}
          variant={node.props?.variant}
        />
      );

    case "quickActionsCard":
      return (
        <QuickActionsCard
          key={`quickActionsCard-${index}`}
          actions={node.props?.actions}
          variant={node.props?.variant}
        />
      );

    default:
      return (
        <UnsupportedTemplateNode
          key={`unsupported-${index}`}
          type={node.type}
        />
      );
  }
}

function RecentActivityCard({ limit = 5, variant = "default" }) {
  return (
    <section className="app-section dynamic-placeholder-section">
      <div className="dynamic-placeholder-header">
        <div>
          <h2 className="section-title">Recent Activity</h2>
          <p className="section-description">
            Latest activity will appear here.
          </p>
        </div>

        <span className="app-badge">{variant}</span>
      </div>

      <div className="app-card dynamic-placeholder-card">
        <p className="empty-text">
          Recent activity component is not implemented yet. Limit: {limit}
        </p>
      </div>
    </section>
  );
}

function QuickActionsCard({ actions = [], variant = "default" }) {
  const normalizedActions = Array.isArray(actions) ? actions : [];

  return (
    <section className="app-section dynamic-placeholder-section">
      <div className="dynamic-placeholder-header">
        <div>
          <h2 className="section-title">Quick Actions</h2>
          <p className="section-description">
            Common shortcuts for your workspace.
          </p>
        </div>

        <span className="app-badge">{variant}</span>
      </div>

      <div className="app-card dynamic-quick-actions-card">
        {normalizedActions.length === 0 && (
          <p className="empty-text">No quick actions configured.</p>
        )}

        {normalizedActions.map((action) => (
          <span className="dynamic-action-chip" key={action}>
            {formatActionLabel(action)}
          </span>
        ))}
      </div>
    </section>
  );
}

function UnsupportedTemplateNode({ type }) {
  return (
    <section className="app-section dynamic-placeholder-section">
      <div className="app-card">
        <p className="error-text">
          Unsupported dashboard component: {type}
        </p>
      </div>
    </section>
  );
}

function safeGridColumns(value) {
  if ([1, 2, 3].includes(value)) {
    return value;
  }

  return 2;
}

function safeGridGap(value) {
  if (["small", "medium", "large"].includes(value)) {
    return value;
  }

  return "medium";
}

function formatActionLabel(value) {
  const labels = {
    addKnowledge: "Add Knowledge",
    viewProfile: "View Profile",
    openSearch: "Open Search",
  };

  return labels[value] || value;
}




function getAccentPalette(primaryColor) {
  const palettes = {
    green: {
      primary: "#41ff94",
      primarySoft: "#1edc72",
      secondary: "#83ffbd",
      primaryRgb: "65, 255, 148",
    },
    blue: {
      primary: "#60a5fa",
      primarySoft: "#3b82f6",
      secondary: "#93c5fd",
      primaryRgb: "96, 165, 250",
    },
    purple: {
      primary: "#c084fc",
      primarySoft: "#a855f7",
      secondary: "#d8b4fe",
      primaryRgb: "192, 132, 252",
    },
    slate: {
      primary: "#cbd5e1",
      primarySoft: "#94a3b8",
      secondary: "#e2e8f0",
      primaryRgb: "203, 213, 225",
    },
  };

  return palettes[primaryColor] || palettes.green;
}