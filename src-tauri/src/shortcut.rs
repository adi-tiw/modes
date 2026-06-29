use tauri::App;
use tauri::AppHandle;
use tauri::Manager;
use tauri::Runtime;
use tauri_plugin_global_shortcut::GlobalShortcutExt;
use tauri_plugin_global_shortcut::Shortcut;
use tauri_plugin_global_shortcut::ShortcutState;
use tauri_plugin_store::JsonValue;
use tauri_plugin_store::StoreExt;

//Name of tauri storage

const MODES_TAURI_STORE: &str = "modes_tauri_store";

// Key for storing global shortcuts

const MODES_GLOBAL_SHORTCUT: &str = "modes_global_shortcut";

//Default shortcut for macos

#[cfg(target_os = "macos")]
const DEFAULT_SHORTCUT: &str = "command+shift+space";

//Set shortcut during application startup

pub fn enable_shortcut(app: &App) {
    let store = app
        .store(MODES_TAURI_STORE)
        .expect("Creating Store Should not fail");

    //use stored shortcut if it exists
    if let Some(stored_shortcut) = store.get(MODES_GLOBAL_SHORTCUT) {
        let stored_shortcut_str = match stored_shortcut {
            JsonValue::String(str) => str,
            unexpected_type => panic!(
                "MODES Shortcuts should be stored as strings, found type: {}",
                unexpected_type
            ),
        };
        let stored_shortcut = stored_shortcut_str
            .parse::<Shortcut>()
            .expect("Stored shortcut string should be valid");
        _register_shortcut_upon_start(app, stored_shortcut);
    } else {
        store.set(
            MODES_GLOBAL_SHORTCUT,
            JsonValue::String(DEFAULT_SHORTCUT.to_string()),
        );
        let default_shortcut = DEFAULT_SHORTCUT
            .parse::<Shortcut>()
            .expect("Default shortcut should be valid");
        _register_shortcut_upon_start(app, default_shortcut);
    }
}

//Get current shortcut stored as a string
#[tauri::command]
pub fn get_current_shortcut<R: Runtime>(app: AppHandle<R>) -> Result<String, String> {
    let shortcut = _get_shortcut(&app);
    Ok(shortcut)
}
//Unregister the current Shortcut in Tauri
#[tauri::command]
pub fn unregister_shortcut<R: Runtime>(app: AppHandle<R>) {
    let shortcut_str = _get_shortcut(&app);
    let shortcut = shortcut_str
        .parse::<Shortcut>()
        .expect("Stored Shortcut String should be valid");

    //Unregister the shortcut
    app.global_shortcut()
        .unregister(shortcut)
        .expect("Failed to unregister shortcut")
}

//Change the global shortcut
#[tauri::command]
pub fn change_shortcut<R: Runtime>(
    app: AppHandle<R>,
    _window: tauri::Window<R>,
    key: String,
) -> Result<(), String> {
    println!("Key: {}", key);
    let shortcut = match key.parse::<Shortcut>() {
        Ok(shortcut) => shortcut,
        Err(_) => return Err(format!("Invalid shortcut{}", key)),
    };

    //Store the new shortcut
    let store = app
        .get_store(MODES_TAURI_STORE)
        .expect("Store should already be loaded or created");
    store.set(MODES_GLOBAL_SHORTCUT, JsonValue::String(key));

    //Register the new shortcut
    _register_shortcut(&app, shortcut);
    Ok(())
}

//Helper function to register a shortcut, primarily for updating shortcuts
fn _register_shortcut<R: Runtime>(app: &AppHandle<R>, shortcut: Shortcut) {
    let main_window = app.get_webview_window("main").unwrap();
    //Register global shortcut and define its behavior
    app.global_shortcut()
        .on_shortcut(shortcut, move |_app, scut, event| {
            if scut == &shortcut {
                if let ShortcutState::Pressed = event.state() {
                    //Toggle Window Visibility
                    if main_window.is_visible().unwrap() {
                        main_window.hide().unwrap(); //Hide
                    } else {
                        main_window.show().unwrap();
                        main_window.set_focus().unwrap();
                    }
                }
            }
        })
        .map_err(|err| format!("Failed to register the new shortcut'{}' ", err))
        .unwrap();
}
    
//Helper function to register shortcuts during application startup.

fn _register_shortcut_upon_start(app: &App, shortcut: Shortcut) {
    let main_window: tauri::WebviewWindow = app.get_webview_window("main").unwrap();
    //Initialize global shortcut and its handler
    app.handle()
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(move |_app, scut, event| {
                    if scut == &shortcut {
                        if let ShortcutState::Pressed = event.state() {
                            //Toggle window visibility
                            if main_window.is_visible().unwrap() {
                                main_window.hide().unwrap(); //Hide
                            } else {
                                main_window.show().unwrap();
                                main_window.set_focus().unwrap();
                            }
                        }
                    }
                })
                .build(),
        )
        .unwrap();
    app.global_shortcut().register(shortcut).unwrap(); //Register global shortcut
}

//Retrieve the global shortcut as a string

pub fn _get_shortcut<R: Runtime>(app: &AppHandle<R>) -> String {
    let store = app
        .get_store(MODES_TAURI_STORE)
        .expect("Store should already be loaded or created");
    match store
        .get(MODES_GLOBAL_SHORTCUT)
        .expect("Shortcut should already be stored")
    {
        JsonValue::String(str) => str,
        unexpected_type => panic!(
            "MODES Shortcuts should be stored as strings, found type {} ",
            unexpected_type
        ),
    }
}
