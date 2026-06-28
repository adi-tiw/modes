use std::process::Command;

pub fn run_open_app(app: &str) {
    let _ = Command::new("open")
        .arg("-a")
        .arg(app)
        .output()
        .expect("failed to execute command");
}
