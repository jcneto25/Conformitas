import fitz
import os
import sys
from pathlib import Path

INGESTION_DIR = Path("docs/business/ingestion")
OUTPUT_DIR = INGESTION_DIR / "converted"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

pdfs = sorted(INGESTION_DIR.glob("*.pdf"))
mds = sorted(INGESTION_DIR.glob("*.md"))

results = []
success = 0
failures = 0
warnings = 0

for pdf_path in pdfs:
    pdf_name = pdf_path.name
    out_name = pdf_path.stem + ".md"
    out_path = OUTPUT_DIR / out_name

    # Skip already converted
    if out_path.exists():
        results.append((pdf_name, f"{pdf_path.stat().st_size / 1024:.1f} KB", out_path.stat().st_size, "Skipped (existing)"))
        success += 1
        continue

    try:
        doc = fitz.open(str(pdf_path))
        pages = []
        has_text = False
        for page_num, page in enumerate(doc):
            text = page.get_text("text")
            if not text.strip():
                blocks = page.get_text("blocks")
                if blocks:
                    lines = []
                    for b in blocks:
                        if len(b) > 4:
                            val = b[4]
                            if isinstance(val, str):
                                lines.append(val)
                            elif isinstance(val, list):
                                for item in val:
                                    if isinstance(item, str):
                                        lines.append(item)
                                    elif isinstance(item, dict):
                                        lines.append(item.get("text", ""))
                    text = "\n".join(l for l in lines if l.strip())
            if text.strip():
                has_text = True
                pages.append(f"# Página {page_num + 1}\n\n{text.strip()}")

        doc.close()

        if not has_text:
            results.append((pdf_name, f"{pdf_path.stat().st_size / 1024:.1f} KB", 0, "FAILED (no text)"))
            failures += 1
            continue

        content = f"# {pdf_path.stem}\n\n" + "\n\n---\n\n".join(pages)
        out_path.write_text(content, encoding="utf-8")

        out_size = out_path.stat().st_size
        status = "OK"
        if out_size < 100:
            status = "LOW_CONTENT"
            warnings += 1
        else:
            success += 1

        results.append((pdf_name, f"{pdf_path.stat().st_size / 1024:.1f} KB", out_size, status))

    except Exception as e:
        results.append((pdf_name, f"{pdf_path.stat().st_size / 1024:.1f} KB", 0, f"ERROR: {e}"))
        failures += 1

# Copy .md files that aren't already in converted
for md_path in mds:
    dest = OUTPUT_DIR / md_path.name
    if not dest.exists():
        content = md_path.read_text(encoding="utf-8")
        dest.write_text(content, encoding="utf-8")
        results.append((md_path.name, f"{md_path.stat().st_size / 1024:.1f} KB", dest.stat().st_size, "COPIED (MD→MD)"))
        success += 1

# Generate report
report_lines = [
    "# Relatório de Conversão — Step 0.1",
    "",
    f"**Data:** 2026-06-16",
    f"**Ferramenta:** PyMuPDF (fitz) 1.25.5 (fallback — Docling falhou por memória)",
    f"**Total de arquivos processados:** {len(results)}",
    f"**Convertidos com sucesso:** {success}",
    f"**Falhas:** {failures}",
    f"**Avisos:** {warnings}",
    "",
    "## Arquivos Convertidos",
    "",
    "| # | Arquivo Original | Formato | Tamanho (orig.) | Tamanho (.md) | Status | Observações |",
    "|---|------------------|---------|-----------------|---------------|--------|-------------|",
]

for i, (name, orig_size, out_size, status) in enumerate(results, 1):
    status_icon = {"OK": "✅", "COPIED (MD→MD)": "✅", "Skipped (existing)": "✅", "LOW_CONTENT": "⚠️", "FAILED (no text)": "❌"}.get(status, "⚠️")
    obs = ""
    if status.startswith("ERROR:"):
        status_icon = "❌"
        obs = status.replace("ERROR: ", "")
    if status == "LOW_CONTENT":
        obs = "Conteúdo extraído muito curto. Verificar original."
    report_lines.append(f"| {i} | `{name}` | PDF/MD | {orig_size} | {out_size / 1024:.1f} KB | {status_icon} {status} | {obs} |")

report_lines.extend([
    "",
    "## Estatísticas",
    "",
    f"- **Formatos encontrados:** PDF ({len(pdfs)}), MD ({len(mds)})",
    f"- **Total de arquivos:** {len(results)}",
    "",
    "## Nota",
    "",
    "Docling (método primário) falhou com `std::bad_alloc` em múltiplos PDFs devido a limitação de memória no pipeline de OCR. Foi usado PyMuPDF como fallback para extração de texto direta. O conteúdo textual foi preservado, mas a estrutura de tabelas pode ter sido perdida.",
    "",
    "## Próximos Passos",
    "",
    "Os arquivos convertidos em `converted/` estão prontos para o Step 0.5.",
    "Execute: `@llc-step-0-5` ou passe `docs/skills/llc-step-0-5.md`."
])

report_path = OUTPUT_DIR / "_CONVERSION_REPORT.md"
report_path.write_text("\n".join(report_lines), encoding="utf-8")

print(f"\nDone! {success} success, {failures} failures, {warnings} warnings")
print(f"Report: {report_path}")
