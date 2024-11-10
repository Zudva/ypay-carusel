from pynput import keyboard, mouse
import logging

# Настройка логирования
logging.basicConfig(filename="input_log.txt", level=logging.INFO, format="%(asctime)s - %(message)s")

def on_key_press(key):
    try:
        logging.info(f"Key pressed: {key.char}")
    except AttributeError:
        logging.info(f"Special key pressed: {key}")

def on_key_release(key):
    logging.info(f"Key released: {key}")
    if key == keyboard.Key.esc:
        return False

def on_click(x, y, button, pressed):
    if pressed:
        logging.info(f"Mouse clicked at ({x}, {y}) with {button}")
    else:
        logging.info(f"Mouse released at ({x}, {y}) with {button}")

def on_scroll(x, y, dx, dy):
    logging.info(f"Mouse scrolled at ({x}, {y}) with delta ({dx}, {dy})")

try:
    # Запуск слушателей клавиатуры и мыши
    with keyboard.Listener(on_press=on_key_press, on_release=on_key_release) as key_listener, \
         mouse.Listener(on_click=on_click, on_scroll=on_scroll) as mouse_listener:
        key_listener.join()
        mouse_listener.join()
except KeyboardInterrupt:
    logging.info("Script terminated by Ctrl + C")
    print("\nScript terminated by Ctrl + C")
