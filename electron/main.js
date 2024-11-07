import { app, BrowserWindow, globalShortcut, ipcMain } from "electron";
import path from "path";

// Добавляем оптимизированные флаги командной строки для графики
app.commandLine.appendSwitch("enable-gpu"); // Включение использования GPU
app.commandLine.appendSwitch("enable-webgl2"); // Включение поддержки WebGL 2.0

function createWindow() {
	// Создаем окно приложения
	const win = new BrowserWindow({
		fullscreen: true, // Включение полноэкранного режима
		webPreferences: {
			preload: path.join(__dirname, "preload.js"), // Путь к preload-скрипту
			contextIsolation: true, // Изоляция контекста для безопасности
			nodeIntegration: false, // Отключение интеграции Node.js в рендерере
			enableRemoteModule: false, // Отключение удаленного модуля
		},
		icon: path.join(__dirname, "icon.jpg"), // Иконка приложения
	});

	// Скрытие строки меню
	win.setMenuBarVisibility(false);

	// Полноэкранный режим
	win.setFullScreen(true);

	// Загрузка HTML-файла
	win.loadFile(path.join(__dirname, "index.html"));

	// Регистрация глобального сочетания клавиш для открытия DevTools
	globalShortcut.register("Ctrl+Shift+I", () => {
		win.webContents.openDevTools(); // Открытие инструментов разработчика
	});

	// Обработчик события входа в полноэкранный режим
	win.on("enter-full-screen", () => {
		// Устанавливаем окно в полноэкранный режим и делаем его нерезайзабельным
		win.setFullScreen(true);
		win.setResizable(false);
	});

	// Скрытие курсора мыши и отключение выделения текста
	win.webContents.on("did-finish-load", () => {
		win.webContents.insertCSS(`
      * {
        -webkit-user-select: none; /* Отключение выделения текста */
        -webkit-app-region: no-drag; /* Запрет перетаскивания окна */
      }
    `);
	});
}

// Запуск приложения после его готовности
app.whenReady().then(() => {
	createWindow();

	// Создание окна при активации приложения
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

// Завершение работы приложения при закрытии всех окон
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		// Для платформы не darwin (не macOS)
		app.quit(); // Завершение работы приложения
	}
});
