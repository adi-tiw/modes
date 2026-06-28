import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import ExecuteCommand from "./lib/Execute";

function App() {
  const [command, setCommand] = useState("");
  useEffect(() => {
    invoke("get_current_shortcut").then((res) => console.log(res));
    console.log("toggle");
  }, []);

  return (
    <div className="container">
      <input
        className="search-input"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            ExecuteCommand(command);
            setCommand("");
          }
        }}
        placeholder="Enter a command..."
        autoFocus
      />
    </div>
  );
}

export default App;
