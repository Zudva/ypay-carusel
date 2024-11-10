from pynput import keyboard, mouse
import logging

# Настройка логирования
logging.basicConfig(filename="input_log.txt", level=logging.INFO, format="%(asctime)s - %(message)s")

def log_event(message):
    """Логирование событий в файл и вывод в консоль"""
    logging.info(message)
    print(message)

def on_key_press(key):
    try:
        log_event(f"Key pressed: {key.char}")
    except AttributeError:
        log_event(f"Special key pressed: {key}")

def on_key_release(key):
    log_event(f"Key released: {key}")
    if key == keyboard.Key.esc:
        return False

def on_click(x, y, button, pressed):
    if pressed:
        log_event(f"Mouse clicked at ({x}, {y}) with {button}")
    else:
        log_event(f"Mouse released at ({x}, {y}) with {button}")

def on_scroll(x, y, dx, dy):
    log_event(f"Mouse scrolled at ({x}, {y}) with delta ({dx}, {dy})")

try:
    # Запуск слушателей клавиатуры и мыши
    with keyboard.Listener(on_press=on_key_press, on_release=on_key_release) as key_listener, \
         mouse.Listener(on_click=on_click, on_scroll=on_scroll) as mouse_listener:
        key_listener.join()
        mouse_listener.join()
except KeyboardInterrupt:
    log_event("Script terminated by Ctrl + C")
    print("\nScript terminated by Ctrl + C")
