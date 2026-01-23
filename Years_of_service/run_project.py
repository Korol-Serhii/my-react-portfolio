
from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).parent.resolve()


def ensure_tool(name: str) -> str:
    """Перевіряє, що інструмент доступний у PATH і повертає повний шлях."""
    # На Windows npm часто знаходиться як npm.cmd
    candidates = [name]
    if os.name == "nt" and not name.endswith(".cmd"):
        candidates.insert(0, f"{name}.cmd")

    for cand in candidates:
        path = shutil.which(cand)
        if path:
            return path

    print(f"[ПОМИЛКА] Не знайдено `{name}`. Встановіть Node.js (містить npm) і додайте в PATH.")
    sys.exit(1)


def install_dependencies(npm_path: str, force: bool, skip: bool) -> None:
    """Ставить npm-залежності за потреби."""
    node_modules = ROOT / "node_modules"
    need_install = force or (not skip and not node_modules.exists())
    if not need_install:
        print("[INFO] Залежності вже встановлені (node_modules існує). Пропускаю npm install.")
        return

    print("[INFO] Виконую npm install ...")
    subprocess.run([npm_path, "install"], cwd=ROOT, check=True)


def run_dev(npm_path: str, host: str, port: int) -> int:
    """Запускає Vite dev-сервер та передає stdout/stderr у поточну консоль."""
    cmd = [npm_path, "run", "dev", "--", "--host", host, "--port", str(port)]
    print(f"[INFO] Стартую dev-сервер: {' '.join(cmd)}")
    try:
        return subprocess.call(cmd, cwd=ROOT)
    except FileNotFoundError as exc:
        print(f"[ПОМИЛКА] Не вдалось запустити команду `{cmd[0]}`. Перевірте PATH або перевстановіть Node.js/npm.")
        print(f"Деталі: {exc}")
        return 1


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Запуск Vite dev-сервера для проєкту.")
    parser.add_argument("--host", default="localhost", help="Хост для dev-сервера (default: localhost)")
    parser.add_argument("--port", type=int, default=5173, help="Порт для dev-сервера (default: 5173)")
    parser.add_argument("--skip-install", action="store_true", help="Не виконувати npm install")
    parser.add_argument("--force-install", action="store_true", help="Примусово перевстановити залежності")
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    node_path = ensure_tool("node")
    npm_path = ensure_tool("npm")
    # Виводимо для наочності, який саме виконуваний файл буде використано
    print(f"[INFO] Використовую node: {node_path}")
    print(f"[INFO] Використовую npm:  {npm_path}")

    install_dependencies(npm_path=npm_path, force=args.force_install, skip=args.skip_install)

    exit_code = run_dev(npm_path=npm_path, host=args.host, port=args.port)
    if exit_code != 0:
        print(f"[ПОМИЛКА] Dev-сервер завершився з кодом {exit_code}", file=sys.stderr)
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
