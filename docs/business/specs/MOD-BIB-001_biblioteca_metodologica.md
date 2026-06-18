# CONFORMITAS (SGI)
## MOD-BIB-001 — Biblioteca Metodológica

**Versão:** 1.0 | **Data:** 16/06/2026 | **Autor:** Gerado por IA | **Status:** Rascunho

---

## 1. IDENTIFICAÇÃO DO MÓDULO

| Campo | Valor |
|-------|-------|
| **ID do Módulo** | MOD-BIB-001 |
| **Nome do Módulo** | Biblioteca Metodológica |
| **Domínio Funcional** | Biblioteca Metodológica |
| **Prioridade** | Could |
| **Complexidade** | Baixa |
| **Onda de Implementação** | 4 |
| **Dependências** | — |
| **Estimativa (homem-dia)** | 5 dias |

---

## 2. OBJETIVO E CONTEXTO

### 2.1 Propósito do Módulo
Repositório centralizado de normas, manuais, procedimentos, modelos de documentos, templates e checklists utilizados pela AUDIN. Funciona como base de conhecimento institucional, permitindo versionamento, busca e consulta rápida dos referenciais metodológicos que orientam a atividade de auditoria.

### 2.2 Escopo do Módulo
- Catálogo de normas (DIRAUD-Jud, CNJ, IIA, INTOSAI, leis)
- Manuais e procedimentos de auditoria
- Modelos de documentos (templates de comunicado, relatório, achado)
- Checklists de verificação
- Versionamento de documentos metodológicos
- Busca textual no acervo

---

## 3. REQUISITOS FUNCIONAIS

| ID | Funcionalidade | Descrição | Prioridade |
|----|---------------|-----------|------------|
| RF-BIB-001 | Catálogo de Normas | Registrar e categorizar normas aplicáveis | Could |
| RF-BIB-002 | Modelos e Templates | Disponibilizar modelos de documentos padronizados | Could |
| RF-BIB-003 | Versionamento | Controlar versões dos documentos metodológicos | Could |
| RF-BIB-004 | Busca Textual | Buscar no conteúdo dos documentos | Could |

---

## 4. MODELO DE DADOS DO MÓDULO

#### DocumentoMetodologico
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | PK |
| `titulo` | String | Sim | Título |
| `tipo` | Enum | Sim | NORMA, MANUAL, PROCEDIMENTO, TEMPLATE, CHECKLIST, GUIA |
| `categoria` | Enum | Sim | AUDITORIA, ETICA, QUALIDADE, RISCO, CAPACITACAO, ADMINISTRATIVO |
| `versao` | String | Sim | Versão (ex: 2.0) |
| `arquivo_path` | String | Sim | Caminho do arquivo |
| `vigencia_inicio` | Date | Não | Data de início de vigência |
| `vigencia_fim` | Date | Não | Data de fim (se revogado) |
| `status` | Enum | Sim | VIGENTE, REVOGADO, OBSOLETO |

---

## 5. DEFINIÇÃO DE PRONTO (DoD)

- [ ] Todos os RFs implementados e testados
- [ ] Upload e download de documentos com versionamento
- [ ] Cobertura de testes ≥ 80%
- [ ] PR revisado e aprovado
