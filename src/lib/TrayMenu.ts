import { TrayIcon } from "@tauri-apps/api/tray";
import { Menu } from "@tauri-apps/api/menu";

export default function TrayMenu(){

}

const menu = await Menu.new({
    items: [
        {
            id: 'quit',
            text: 'Quit',
            action: () => {
                console.log('quit pressed');
            }
        },
        {
            id: 'app-settings',
            text:'Settings',
        },
    ],
});

const options = {
    menu,
    menuOnLeftClick: true,
};

const tray = await TrayIcon.new(options);