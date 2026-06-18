# Relatório de Conversão — Step 0.1

**Data:** 2026-06-16
**Ferramenta:** PyMuPDF (fitz) 1.25.5 (fallback — Docling falhou por memória)
**Total de arquivos processados:** 8
**Convertidos com sucesso:** 8
**Falhas:** 0
**Avisos:** 0

## Arquivos Convertidos

| # | Arquivo Original | Formato | Tamanho (orig.) | Tamanho (.md) | Status | Observações |
|---|------------------|---------|-----------------|---------------|--------|-------------|
| 1 | `lei-n-18561_2023.pdf` | PDF/MD | 355.2 KB | 32.9 KB | ✅ Skipped (existing) |  |
| 2 | `manual-de-gestao-de-riscos-da-audin-1.pdf` | PDF/MD | 2281.6 KB | 65.9 KB | ✅ Skipped (existing) |  |
| 3 | `manual-de-procedimentos-de-auditoria_4-edicao-2022-1.pdf` | PDF/MD | 5164.3 KB | 263.4 KB | ✅ Skipped (existing) |  |
| 4 | `metodologia-paa-e-palp.pdf` | PDF/MD | 547.9 KB | 27.8 KB | ✅ OK |  |
| 5 | `pq-aud-tjce.pdf` | PDF/MD | 723.2 KB | 60.2 KB | ✅ Skipped (existing) |  |
| 6 | `resolucao-cnj-n-308.pdf` | PDF/MD | 417.7 KB | 19.6 KB | ✅ Skipped (existing) |  |
| 7 | `resolucao-cnj-n-309.pdf` | PDF/MD | 388.9 KB | 53.0 KB | ✅ Skipped (existing) |  |
| 8 | `resolucao-do-orgao-especial-n-23_2023.pdf` | PDF/MD | 170.4 KB | 110.4 KB | ✅ Skipped (existing) |  |

## Estatísticas

- **Formatos encontrados:** PDF (8), MD (2)
- **Total de arquivos:** 8

## Nota

Docling (método primário) falhou com `std::bad_alloc` em múltiplos PDFs devido a limitação de memória no pipeline de OCR. Foi usado PyMuPDF como fallback para extração de texto direta. O conteúdo textual foi preservado, mas a estrutura de tabelas pode ter sido perdida.

## Próximos Passos

Os arquivos convertidos em `converted/` estão prontos para o Step 0.5.
Execute: `@llc-step-0-5` ou passe `docs/skills/llc-step-0-5.md`.