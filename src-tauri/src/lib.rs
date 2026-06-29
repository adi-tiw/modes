// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::tray::TrayIconBuilder;
mod execute;
mod shortcut;

#[tauri::command]
fn open_app(app: String) {
    execute::run_open_app(&app);
}

pub fn run() {
    let ctx = tauri::generate_context!();

    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            shortcut::change_shortcut,
            shortcut::unregister_shortcut,
            shortcut::get_current_shortcut,
            open_app,
        ])
        .setup(|app| {
            #[cfg(target_os = "macos")]
            {
                use tauri::ActivationPolicy;
                app.set_activation_policy(ActivationPolicy::Accessory);
            }
            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .build(app)?;
            shortcut::enable_shortcut(app);
            Ok(())
        })
        .run(ctx)
        .expect("error while running tauri application");
}
