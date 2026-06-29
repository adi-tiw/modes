import { TrayIcon } from "@tauri-apps/api/tray";
import { Menu } from "@tauri-apps/api/menu";

export default function TrayMenu(){

}

const _menu = await Menu.new({
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

const _options = {
    menu: _menu,
    menuOnLeftClick: true,
};

export const tray = await TrayIcon.new(_options);