const { app, BrowserWindow, globalShortcut, screen } = require('electron');
const path = require('path');

// Оптимизированные флаги командной строки для графики
app.commandLine.appendSwitch('enable-gpu'); // Включение использования GPU
app.commandLine.appendSwitch('enable-webgl2'); // Включение поддержки WebGL 2.0
app.commandLine.appendSwitch('force_high_performance_gpu'); // Принудительное использование дискретного GPU (если доступен)
app.commandLine.appendSwitch('ignore-gpu-blacklist'); // Игнорирование черного списка GPU для включения всех возможностей
app.commandLine.appendSwitch('enable-zero-copy'); // Улучшение производительности GPU с нулевым копированием
app.commandLine.appendSwitch('enable-gpu-rasterization'); // Включение GPU-растеризации
app.commandLine.appendSwitch('enable-accelerated-video-decode'); // Включение аппаратного ускорения видео-декодирования

function createWindow() {
  // Получаем информацию о дисплее
  const displays = screen.getAllDisplays();
  const externalDisplay = displays.length > 1 ? displays[1] : displays[0];

  // Создаем окно приложения с разрешением 3840x2160
  const win = new BrowserWindow({
    x: externalDisplay.bounds.x, // Устанавливаем положение окна на втором мониторе
    y: externalDisplay.bounds.y,
    width: 3840, // Разрешение экрана (ширина)
    height: 2160, // Разрешение экрана (высота)
    fullscreen: true, // Полноэкранный режим
    kiosk: true, // Включение режима киоска (KIOSK)
    autoHideMenuBar: true, // Автоматическое скрытие меню
    frame: false, // Безрамочное окно
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Путь к preload-скрипту
      contextIsolation: true, // Изоляция контекста для безопасности
      nodeIntegration: false, // Отключение интеграции Node.js в рендерере
      enableRemoteModule: false // Отключение удаленного модуля
    },
    icon: path.join(__dirname, 'icon.jpg') // Иконка приложения
  });

  // Скрытие строки меню
  win.setMenuBarVisibility(false);

  // Загрузка HTML-файла
  win.loadFile(path.join(__dirname, 'index.html'));

  // Применение полноэкранного режима и запрещение изменения размера окна
  win.on('enter-full-screen', () => {
    win.setFullScreen(true);
    win.setResizable(false); // Запрещаем изменение размера окна
  });

  // Обработка ошибок путей file://
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error(`Failed to load URL: ${validatedURL} with error: ${errorDescription} (code: ${errorCode})`);
  });

  // Исправление путей для протокола file://
  win.webContents.on('did-finish-load', () => {
    win.webContents.executeJavaScript(`
      document.querySelectorAll('img, audio, video').forEach((el) => {
        if (el.src.startsWith('file://')) {
          el.src = el.src.replace('file://', '');
        }
      });
    `);
  });

  // Регистрация глобального сочетания клавиш для открытия DevTools (опционально для режима киоска)
  globalShortcut.register('Ctrl+Shift+I', () => {
    win.webContents.openDevTools(); // Открытие инструментов разработчика
  });

  // Скрытие курсора мыши и отключение выделения текста
  win.webContents.on('did-finish-load', () => {
    win.webContents.insertCSS(`
      * {
        -webkit-user-select: none; /* Отключение выделения текста */
        -webkit-app-region: no-drag; /* Запрет перетаскивания окна */
      }
      body {
        cursor: none; /* Скрытие курсора */
      }
    `);
  });

  // Обработка события сворачивания окна
  win.on('minimize', (event) => {
    event.preventDefault();  // Предотвращение минимизации (опционально)
    console.log('Окно свернуто');
  });

  // Принудительное восстановление полноэкранного режима при восстановлении окна
  win.on('restore', () => {
    win.setFullScreen(true);
    console.log('Окно восстановлено');
  });

  // Логирование потери фокуса окна (опционально)
  win.on('blur', () => {
    console.log('Окно потеряло фокус');
    win.focus(); // Автоматически возвращаем фокус на окно
  });

  // Логирование получения фокуса окном (опционально)
  win.on('focus', () => {
    console.log('Окно получило фокус');
  });
}

// Запуск приложения после его готовности
app.whenReady().then(() => {
  createWindow();

  // Создание окна при активации приложения (например, при его восстановлении)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Завершение работы приложения при закрытии всех окон
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { // Для платформы не darwin (не macOS)
    app.quit(); // Завершение работы приложения
  }
});
