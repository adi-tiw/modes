import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    invoke("get_current_shortcut").then((res) => console.log(res));
    console.log("toggle");
  }, []);

  return (
    <div>
      <input placeholder="Type a command..." autoFocus />
    </div>
  );
}

export default App;
