import { invoke } from "@tauri-apps/api/core";

export default async function ExecuteCommand(command: string) {
  console.log("Executing:", command);
  try {
    await invoke("open_app", { app: command });
    await invoke("hide_app_after_cmd");
  } catch (error) {
    console.error("Failed to run command:", error);
  }
}
