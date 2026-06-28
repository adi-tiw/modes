import { invoke } from "@tauri-apps/api/core";

export default async function ExecuteCommand(command: string) {
  console.log("Executing:", command);
  try {
    await invoke("open_app", { app: command });
  } catch (error) {
    console.error("Failed to run command:", error);
  }
}
