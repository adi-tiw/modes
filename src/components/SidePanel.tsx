interface SidePanelProps {
  activeTab: "profiles" | "appearance";
  setActiveTab: (tab: "profiles" | "appearance") => void;
}

export const SidePanel = ({ activeTab, setActiveTab }: SidePanelProps) => {
  return (
    <div className="side-panel">
      <div 
        className={`panel-item ${activeTab === "profiles" ? "active" : ""}`}
        onClick={() => setActiveTab("profiles")}
      >
        {activeTab === "profiles" && <span className="diagonal-stripes"></span>}
        Profiles
      </div>
      <div 
        className={`panel-item ${activeTab === "appearance" ? "active" : ""}`}
        onClick={() => setActiveTab("appearance")}
      >
        Appearance
      </div>
      <div className="more-settings-spacer">
        <div className="vertical-text">More settings later</div>
      </div>
    </div>
  );
};