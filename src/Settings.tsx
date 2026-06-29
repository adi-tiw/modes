import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { SidePanel } from "./components/SidePanel";
import "./Settings.css";

interface Profile {
  name: string;
  apps: string[];
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profiles" | "appearance">("profiles");
  const [profiles, setProfiles] = useState<Profile[]>([
    { name: "Work", apps: ["Visual Studio Code", "Slack", "Google Chrome", "Terminal"] },
    { name: "Personal", apps: ["Spotify", "Discord", "Steam"] },
    { name: "Study", apps: ["Notion", "Anki", "Safari"] },
  ]);
  const [selectedProfileName, setSelectedProfileName] = useState<string>("Work");
  const [newAppName, setNewAppName] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

  const selectedProfile = profiles.find((p) => p.name === selectedProfileName) || profiles[0];

  const handleAddApp = () => {
    if (!newAppName.trim()) return;
    setProfiles(
      profiles.map((p) => {
        if (p.name === selectedProfileName) {
          if (!p.apps.includes(newAppName.trim())) {
            return { ...p, apps: [...p.apps, newAppName.trim()] };
          }
        }
        return p;
      })
    );
    setNewAppName("");
    setIsAdding(false);
  };

  const handleRemoveApp = (appName: string) => {
    setProfiles(
      profiles.map((p) => {
        if (p.name === selectedProfileName) {
          return { ...p, apps: p.apps.filter((a) => a !== appName) };
        }
        return p;
      })
    );
  };

  const handleCreateProfile = () => {
    const name = prompt("Enter new profile name:");
    if (name && name.trim()) {
      const trimmed = name.trim();
      if (!profiles.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
        setProfiles([...profiles, { name: trimmed, apps: [] }]);
        setSelectedProfileName(trimmed);
      }
    }
  };

  const handleDeleteProfile = () => {
    if (profiles.length <= 1) {
      alert("You must keep at least one profile.");
      return;
    }
    if (confirm(`Are you sure you want to delete profile "${selectedProfileName}"?`)) {
      const remaining = profiles.filter((p) => p.name !== selectedProfileName);
      setProfiles(remaining);
      setSelectedProfileName(remaining[0].name);
    }
  };

  return (
    <div className="settings-window">
      <SidePanel activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="main-content">
        {activeTab === "profiles" ? (
          <div className="profiles-content">
            <div className="control-header">
              <div className="dropdown-wrapper">
                <select
                  value={selectedProfileName}
                  onChange={(e) => setSelectedProfileName(e.target.value)}
                  className="profile-select"
                >
                  {profiles.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <div className="select-arrow">▼</div>
              </div>

              <div className="search-app-wrapper">
                <input
                  type="text"
                  placeholder={isAdding ? "Type app name..." : "Search App"}
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddApp()}
                  className="search-app-input"
                  onFocus={() => setIsAdding(true)}
                  onBlur={() => {
                    // Small timeout to allow button clicks
                    setTimeout(() => {
                      if (!newAppName) setIsAdding(false);
                    }, 200);
                  }}
                />
              </div>

              <div className="action-buttons">
                <button className="icon-btn add-btn" onClick={handleCreateProfile} title="New Profile">+</button>
                <button className="icon-btn remove-btn" onClick={handleDeleteProfile} title="Delete Profile">-</button>
              </div>
            </div>

            <div className="apps-list-container">
              <h3>Apps in {selectedProfileName} Mode</h3>
              <div className="apps-grid">
                {selectedProfile.apps.length > 0 ? (
                  selectedProfile.apps.map((app) => (
                    <div key={app} className="app-item">
                      <span className="app-name">{app}</span>
                      <button
                        className="app-remove-btn"
                        onClick={() => handleRemoveApp(app)}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="empty-apps">No apps added. Click + or search to add.</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="appearance-content">
            <h2>Appearance Settings</h2>
            <div className="appearance-options">
              <div className="option-row">
                <span>Theme Mode</span>
                <select className="ui-select" defaultValue="dark">
                  <option value="dark">Blood Red Dark</option>
                  <option value="light">Sleek Light</option>
                </select>
              </div>
              <div className="option-row">
                <span>Font Family</span>
                <span className="current-font">IBM Plex Mono</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Render the application to the root element
const rootEl = document.getElementById("root");
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <SettingsPage />
    </React.StrictMode>
  );
}