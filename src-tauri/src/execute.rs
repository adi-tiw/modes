use std::process::Command;
use tauri::AppHandle;
use tauri::Manager;

pub fn run_open_app(app: &str) {
    let _ = Command::new("open")
        .arg("-a")
        .arg(app)
        .output()
        .expect("failed to execute command");
}
#[tauri::command]
pub fn hide_app_after_cmd(app: AppHandle) {
    let main_window = app.get_webview_window("main").unwrap();
    if main_window.is_visible().unwrap() {
        main_window.hide().unwrap(); //Hide
    }
}
