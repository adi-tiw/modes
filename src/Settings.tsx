import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import { SidePanel } from "./components/SidePanel";
import "./Settings.css";

interface Profile {
  name: string;
  apps: string[];
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profiles" | "appearance">("profiles");
  const [newAppName, setNewAppName] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load profiles from localStorage or fall back to default
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem("modes_profiles");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse saved profiles:", e);
      }
    }
    return [{ name: "Work", apps: [] }];
  });

  // Load selected profile name from localStorage or fall back to default
  const [selectedProfileName, setSelectedProfileName] = useState<string>(() => {
    const saved = localStorage.getItem("modes_selected_profile");
    if (saved) {
      return saved;
    }
    return "Work";
  });

  // Sync profiles to localStorage
  useEffect(() => {
    localStorage.setItem("modes_profiles", JSON.stringify(profiles));
  }, [profiles]);

  // Sync selectedProfileName to localStorage
  useEffect(() => {
    if (selectedProfileName) {
      localStorage.setItem("modes_selected_profile", selectedProfileName);
    }
  }, [selectedProfileName]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Compute selected profile with robust fallback structure
  const selectedProfile =
    profiles.find((p) => p.name === selectedProfileName) ||
    profiles[0] ||
    { name: "", apps: [] };

  const handleAddApp = () => {
    if (!newAppName.trim()) return;
    setProfiles(
      profiles.map((p) => {
        if (p.name === selectedProfile.name) {
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
        if (p.name === selectedProfile.name) {
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
      } else {
        alert("A profile with this name already exists.");
      }
    }
  };

  const handleDeleteProfile = () => {
    if (profiles.length <= 1) {
      alert("You must keep at least one profile.");
      return;
    }
    if (confirm(`Are you sure you want to delete profile "${selectedProfile.name}"?`)) {
      const remaining = profiles.filter((p) => p.name !== selectedProfile.name);
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
              <div className="profile-selector-container" ref={dropdownRef}>
                <button
                  className="profile-dropdown-trigger"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  title="Select Profile"
                >
                  ▼
                </button>
                <span className="profile-title">{selectedProfile.name}</span>
                {isDropdownOpen && (
                  <div className="profile-dropdown-menu">
                    {profiles.map((p) => (
                      <div
                        key={p.name}
                        className={`profile-dropdown-item ${p.name === selectedProfile.name ? "active" : ""}`}
                        onClick={() => {
                          setSelectedProfileName(p.name);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {p.name}
                      </div>
                    ))}
                  </div>
                )}
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
              <h3>Apps in {selectedProfile.name} Mode</h3>
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