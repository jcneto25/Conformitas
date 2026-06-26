#!/usr/bin/env python3
"""
Valida se um arquivo de sessão ACE pode ser criado sem sobrescrever arquivos existentes.

Uso:
    python .ace/scripts/validate-session-write.py --filename 2026-06-26-001.md
    python .ace/scripts/validate-session-write.py --filename 2026-06-26-003.md

Comportamento:
    - Lê index.json para determinar o próximo número de sequência disponível
    - Se o arquivo já existir em disco, retorna erro com o próximo número disponível
    - Se não existir, retorna sucesso

Saída (JSON):
    {"status": "ok", "filename": "2026-06-26-003.md", "next_available": 3}
    {"status": "error", "error": "Arquivo 2026-06-26-001.md já existe", "existing": ["001", "002"], "next_available": "2026-06-26-003.md"}
"""

import argparse
import json
import os
import re
import sys
from datetime import date
from pathlib import Path

ACE_DIR = Path(__file__).resolve().parent.parent
SESSIONS_DIR = ACE_DIR / "sessions"
INDEX_FILE = ACE_DIR / "index.json"


def get_next_sequence(today: str) -> str:
    """Determina o próximo número de sequência disponível para a data."""
    if not SESSIONS_DIR.exists():
        return f"{today}-001.md"

    pattern = re.compile(rf"^{re.escape(today)}-(\d{{3}})\.md$")
    existing_numbers = []

    for f in SESSIONS_DIR.iterdir():
        if f.is_file():
            m = pattern.match(f.name)
            if m:
                existing_numbers.append(int(m.group(1)))

    if not existing_numbers:
        return f"{today}-001.md"

    next_num = max(existing_numbers) + 1
    return f"{today}-{next_num:03d}.md"


def main():
    parser = argparse.ArgumentParser(description="Valida escrita de sessão ACE")
    parser.add_argument("--filename", help="Nome do arquivo de sessão pretendido")
    parser.add_argument(
        "--check-latest",
        action="store_true",
        help="Verifica qual é o próximo arquivo disponível",
    )
    args = parser.parse_args()

    today = date.today().isoformat()

    if args.check_latest:
        next_file = get_next_sequence(today)
        print(json.dumps({"status": "ok", "next_available": next_file, "date": today}))
        sys.exit(0)

    if not args.filename:
        # Sem argumento — sugerir o próximo disponível
        next_file = get_next_sequence(today)
        print(
            json.dumps({
                "status": "info",
                "message": "Nenhum --filename fornecido. Use --check-latest para obter o próximo.",
                "suggestion": next_file,
                "date": today,
            })
        )
        sys.exit(0)

    filepath = SESSIONS_DIR / args.filename

    if filepath.exists():
        # Listar todos os arquivos existentes para esta data
        existing = sorted(
            f.name for f in SESSIONS_DIR.iterdir()
            if f.is_file() and f.name.startswith(today)
        )
        next_file = get_next_sequence(today)
        print(
            json.dumps({
                "status": "error",
                "error": f"Arquivo {args.filename} já existe em {SESSIONS_DIR}",
                "existing": existing,
                "next_available": next_file,
                "suggestion": f"Use {next_file} em vez de {args.filename}",
            })
        )
        sys.exit(1)

    print(json.dumps({"status": "ok", "filename": args.filename}))


if __name__ == "__main__":
    main()
