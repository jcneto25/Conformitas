#!/usr/bin/env python3
"""
Verifica consistência entre o estado declarado na documentação (TASKS.md) e
o estado real da implementação no código.

Uso:
    python .ace/scripts/consistency-check.py
    python .ace/scripts/consistency-check.py --json
    python .ace/scripts/consistency-check.py --strict   # exit 1 se divergência

Regras:
- Se TASKS.md marca uma tarefa como ✅ (concluída), o service correspondente
  NÃO pode ser um stub (return [] ou throw pendente).
- Reporta falso-positivo (tarefa marcada concluída mas código é stub).
"""

import argparse
import json
import re
import sys
from pathlib import Path

# Mapeamento PRP → arquivo service que deve existir implementado
PRP_SERVICE_MAP = {
    "PRP-001": {"src/auth/auth.service.ts", "src/usuarios/usuarios.service.ts"},
    "PRP-002": {"src/perfis/perfis.service.ts"},
    "PRP-003": {"src/universo/universo.service.ts"},
    "PRP-004": {"src/planos/planos.service.ts"},
    "PRP-005": {"src/auditorias/auditorias.service.ts"},
    "PRP-006": {"src/achados/achados.service.ts"},
    "PRP-007": {"src/relatorios/relatorios.service.ts"},
    "PRP-008": {"src/recomendacoes/recomendacoes.service.ts"},
    "PRP-009": {"src/etica/etica.service.ts"},
    "PRP-010": {"src/consultorias/consultorias.service.ts"},
    "PRP-011": {"src/qualidade/qualidade.service.ts"},
    "PRP-012": {"src/riscos/riscos.service.ts"},
    "PRP-013": {"src/governanca/governanca.service.ts"},
    "PRP-014": {"src/dashboards/dashboards.service.ts"},
}

STUB_PATTERNS = [
    re.compile(rb"return\s*\[\s*\]\s*;?\s*\n?\s*\}"),           # return [];
    re.compile(rb"throw\s+new\s+\w+\([^)]*pendente[^)]*\)"),    # throw ... pendente
    re.compile(rb"\/\/\s*TODO"),                                 # // TODO
]


def is_stub_service(file_path: Path, api_dir: Path) -> bool:
    """Verifica se um service parece ser um stub (implementação vazia)."""
    full_path = api_dir / file_path
    if not full_path.exists():
        return True  # arquivo não existe = stub

    content = full_path.read_bytes()
    lines = content.split(b"\n")
    significant_lines = [
        l for l in lines
        if l.strip()
        and not l.strip().startswith(b"import ")
        and not l.strip().startswith(b"from ")
        and not l.strip().startswith(b"constructor")
        and not l.strip().startswith(b"private")
        and not l.strip().startswith(b"// ")
        and not l.strip().startswith(b"/*")
        and not l.strip().startswith(b"*")
        and not l.strip().startswith(b"@")
        and not l.strip().startswith(b"export class")
        and not l.strip().startswith(b"}")
    ]

    # Se so tem <= 3 linhas significativas, provavelmente é stub
    if len(significant_lines) <= 3:
        return True

    for pattern in STUB_PATTERNS:
        if pattern.search(content):
            return True

    return False


def extract_completed_prps(tasks_md: Path) -> dict[str, list[str]]:
    """Extrai tarefas concluídas do TASKS.md retornando {prp: [task_ids]}."""
    content = tasks_md.read_text(encoding="utf-8")
    prp_tasks: dict[str, list[str]] = {}
    current_prp = "transversal"

    # Tarefas que NÃO são implementação de backend service:
    # - Telas/Componentes frontend (Tela, Componente)
    # - Testes
    # - Seed
    UI_ONLY_PATTERNS = re.compile(
        r"Tela\s|Componente\s|Testes[: ]|Seed[:]|E2E[: ]", re.IGNORECASE
    )

    for line in content.split("\n"):
        prp_match = re.match(r".*PRP-(\d{3}).*", line)
        if prp_match:
            current_prp = f"PRP-{prp_match.group(1)}"
            if current_prp not in prp_tasks:
                prp_tasks[current_prp] = []

        task_match = re.match(
            r"\|\s*(T-\d+)\s*\|([^|]*)\|.*\|\s*✅\s*\|", line
        )
        if task_match and current_prp in PRP_SERVICE_MAP:
            task_id = task_match.group(1)
            task_desc = task_match.group(2).strip()
            if not UI_ONLY_PATTERNS.search(task_desc):
                prp_tasks[current_prp].append(task_id)

    return prp_tasks


def main():
    parser = argparse.ArgumentParser(
        description="Verifica consistência entre TASKS.md e código implementado"
    )
    parser.add_argument("--json", action="store_true")
    parser.add_argument("--strict", action="store_true",
                        help="Exit code 1 se houver divergência")
    args = parser.parse_args()

    repo_root = Path.cwd()
    api_dir = repo_root / "api"
    tasks_md = repo_root / "docs" / "planning" / "TASKS.md"

    if not tasks_md.exists():
        print("ERROR: TASKS.md não encontrado")
        sys.exit(2)

    completed = extract_completed_prps(tasks_md)
    issues = []

    for prp, services in PRP_SERVICE_MAP.items():
        prp_tasks = completed.get(prp, [])
        if not prp_tasks:
            continue

        for service_path in services:
            if is_stub_service(service_path, api_dir):
                issues.append({
                    "prp": prp,
                    "service": service_path,
                    "tasks_completed": prp_tasks,
                    "severity": "divergence",
                    "message": (
                        f"{prp}: {service_path} é stub, mas TASKS.md marca "
                        f"{', '.join(prp_tasks)} como ✅ concluída(s)"
                    ),
                })

    result = {
        "prps_analyzed": len(PRP_SERVICE_MAP),
        "services_stub": sum(
            1 for svcs in PRP_SERVICE_MAP.values()
            for s in svcs if is_stub_service(s, api_dir)
        ),
        "divergences": len(issues),
        "issues": issues,
    }

    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print(f"{'='*60}")
        print("📋 VERIFICAÇÃO DE CONSISTÊNCIA — TASKS.md vs Código")
        print(f"{'='*60}")
        print(f"PRPs analisados: {result['prps_analyzed']}")
        print(f"Services stub: {result['services_stub']}")
        print(f"Divergências: {result['divergences']}")

        if issues:
            print(f"\n❌ DIVERGÊNCIAS ENCONTRADAS:")
            for issue in issues:
                print(f"  [{issue['prp']}] {issue['service']}")
                print(f"         Tarefas marcadas ✅ mas código é stub: "
                      f"{', '.join(issue['tasks_completed'])}")
        else:
            print("\n✅ Nenhuma divergência — documentação reflete o código.")

        print(f"{'='*60}")

    if args.strict and issues:
        sys.exit(1)
    return 0


if __name__ == "__main__":
    sys.exit(main())
