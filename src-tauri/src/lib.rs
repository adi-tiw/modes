// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod shortcut;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

pub fn run() {
    let mut ctx = tauri::generate_context!();

    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            shortcut::change_shortcut,
            shortcut::unregister_shortcut,
            shortcut::get_current_shortcut,
        ])
        .setup(|app| {
            shortcut::enable_shortcut(app);

            Ok(())
        })
        .run(ctx)
        .expect("error while running tauri application");
}
