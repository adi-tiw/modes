// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod execute;
mod shortcut;

#[tauri::command]
fn open_app(app: String) {
    execute::run_open_app(&app);
}

pub fn run() {
    let mut ctx = tauri::generate_context!();

    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            shortcut::change_shortcut,
            shortcut::unregister_shortcut,
            shortcut::get_current_shortcut,
            open_app,
        ])
        .setup(|app| {
            shortcut::enable_shortcut(app);

            Ok(())
        })
        .run(ctx)
        .expect("error while running tauri application");
}
