const { contextBridge, ipcRenderer } = require("electron");

// Событие, которое срабатывает, когда DOM полностью загружен
window.addEventListener("DOMContentLoaded", () => {
	// Функция для замены текста в элементе с указанным селектором
	const replaceText = (selector, text) => {
		const element = document.getElementById(selector);
		if (element) element.innerText = text; // Устанавливаем текст, если элемент найден
	};

	// Замена текста в элементах на странице для версий Chrome, Node и Electron
	for (const type of ["chrome", "node", "electron"]) {
		replaceText(`${type}-version`, process.versions[type]);
	}

	// Определяем API, которое будет доступно в рендерере
	contextBridge.exposeInMainWorld("api", {
		// Метод для получения версии Electron через IPC
		getVersion: () => ipcRenderer.invoke("get-version"),
	});
});
