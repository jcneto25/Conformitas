# Manual do Usuário — CONFORMITAS 3.0

**Versão:** 1.0 | **Data:** 2026-06-16 | **Status:** Esqueleto (a preencher na execução)

---

## 1. Sobre este Manual

Este manual descreve como utilizar o CONFORMITAS 3.0 — Sistema Integrado de Gestão de Auditoria Interna da AUDIN/TJCE. Ele é organizado por módulo e por perfil de usuário. Cada página descreve uma funcionalidade específica com instruções passo a passo.

**Como usar este manual:**
- **Por tarefa:** Navegue pela seção 4 (Módulos) para encontrar a funcionalidade que precisa.
- **Por perfil:** Consulte a seção 3 (Guias por Perfil) para ver as páginas relevantes ao seu cargo.
- **Primeiro acesso:** Comece por `visao-geral.md`.

---

## 2. Convenções

| Convenção | Significado |
|-----------|-------------|
| **Negrito** | Nome de botão, campo ou elemento da tela |
| `código` | Caminho de menu, atalho ou comando |
| ⚠️ | Atenção — ação com consequências importantes |
| 💡 | Dica útil |
| P01-P10 | Perfis de acesso (ver seção 3) |

---

## 3. Guias por Perfil

### P01 — Auditor-Chefe
Responsável pela supervisão completa da AUDIN. Aprova planos e relatórios, gerencia qualidade.

**Páginas relevantes:**
- `planejamento/universo-auditavel.md` — Gerenciar áreas e processos auditáveis
- `planejamento/matriz-priorizacao.md` — Priorizar auditorias por risco
- `planejamento/palp-paa.md` — Criar e aprovar PALP e PAA
- `planejamento/forca-trabalho.md` — Dimensionar equipe
- `execucao/abrir-auditoria.md` — Abrir auditoria a partir do PAA
- `achados/registrar-achado.md` — Registrar achados de auditoria
- `relatorios/relatorio-preliminar.md` — Emitir Relatório Preliminar
- `relatorios/relatorio-final.md` — Emitir Relatório Final com recomendações
- `monitoramento/painel-recomendacoes.md` — Acompanhar implementação
- `qualidade/avaliacoes.md` — Gerenciar PQAUD
- `governanca/determinacoes-externas.md` — Registrar determinações TCE/CNJ

### P02 — Auditor
Executa auditorias designadas, coleta evidências, registra achados.

**Páginas relevantes:**
- `execucao/programa-auditoria.md` — Elaborar programa de auditoria
- `execucao/evidencias.md` — Fazer upload de evidências
- `execucao/papeis-trabalho.md` — Criar papéis de trabalho
- `execucao/requisicoes.md` — Emitir requisições à unidade
- `achados/registrar-achado.md` — Registrar achados
- `achados/enviar-manifestacao.md` — Enviar achado para manifestação
- `relatorios/relatorio-preliminar.md` — Gerar Relatório Preliminar

### P03 — Presidente do TJCE
Aprova PAA/PALP, recebe comunicações de obstrução e fraudes.

**Páginas relevantes:**
- `planejamento/aprovar-paa.md` — Aprovar Plano Anual de Auditoria
- `execucao/comunicados-obstrucao.md` — Visualizar comunicações de obstrução
- `governanca/fraudes.md` — Receber comunicações de fraude

### P04 — Órgão Colegiado
Recebe e delibera sobre o Relatório Anual de Atividades da AUDIN.

**Páginas relevantes:**
- `relatorios/relatorio-anual.md` — Visualizar e deliberar sobre Relatório Anual

### P05 — Gestor de Unidade Auditada
Manifesta-se sobre achados de auditoria e implementa recomendações. Acesso restrito à sua unidade.

**Páginas relevantes:**
- `achados/manifestar-achado.md` — Responder a achado de auditoria
- `monitoramento/registrar-providencias.md` — Registrar providências sobre recomendações
- `consultorias/solicitar-consultoria.md` — Solicitar consultoria à AUDIN

### P06 — Gestor de 2ª Linha (Controle Interno)
Monitora implementação de recomendações de forma consolidada.

**Páginas relevantes:**
- `monitoramento/painel-recomendacoes.md` — Painel consolidado de recomendações

### P07 — Avaliador Externo
Conduz avaliações externas de qualidade (PQAUD) com acesso temporário.

**Páginas relevantes:**
- `qualidade/avaliacao-externa.md` — Realizar avaliação externa de qualidade

### P08 — Comitê SIAUD-Jud / P09 — CPA
Acesso a indicadores nacionais e Ações Coordenadas de Auditoria.

**Páginas relevantes:**
- `integracoes/acoes-coordenadas.md` — Visualizar Ações Coordenadas do SIAUD-Jud

### P10 — Administrador do Sistema
Gestão técnica da plataforma. Sem acesso a dados de auditoria.

**Páginas relevantes:**
- `admin/usuarios.md` — Gerenciar usuários
- `admin/perfis.md` — Atribuir perfis de acesso
- `admin/configuracoes.md` — Configurar parâmetros do sistema
- `admin/logs.md` — Consultar logs do sistema

---

## 4. Módulos e Páginas

### Administração e Segurança
| Página | Arquivo | Descrição | Perfil |
|--------|---------|-----------|--------|
| Gerenciar Usuários | `admin/usuarios.md` | Cadastrar, editar e inativar usuários | P10 |
| Atribuir Perfis | `admin/perfis.md` | Vincular usuários a perfis de acesso | P10 |
| Configurações do Sistema | `admin/configuracoes.md` | Ajustar parâmetros (prazos, metas) | P10 |
| Logs do Sistema | `admin/logs.md` | Consultar eventos de segurança | P01, P10 |

### Planejamento de Auditoria
| Página | Arquivo | Descrição | Perfil |
|--------|---------|-----------|--------|
| Universo Auditável | `planejamento/universo-auditavel.md` | Cadastrar áreas e processos auditáveis | P01, P02 |
| Matriz de Priorização | `planejamento/matriz-priorizacao.md` | Visualizar ranking de prioridades | P01, P02 |
| PALP e PAA | `planejamento/palp-paa.md` | Criar e gerenciar planos de auditoria | P01 |
| Aprovar PAA | `planejamento/aprovar-paa.md` | Aprovar Plano Anual como Presidente | P03 |
| Força de Trabalho | `planejamento/forca-trabalho.md` | Dimensionar horas da equipe | P01 |

### Execução de Auditoria
| Página | Arquivo | Descrição | Perfil |
|--------|---------|-----------|--------|
| Abrir Auditoria | `execucao/abrir-auditoria.md` | Abrir auditoria a partir do PAA | P01 |
| Programa de Auditoria | `execucao/programa-auditoria.md` | Definir escopo, testes e cronograma | P01, P02 |
| Evidências | `execucao/evidencias.md` | Fazer upload de documentos comprobatórios | P02 |
| Papéis de Trabalho | `execucao/papeis-trabalho.md` | Documentar verificações e conclusões | P02 |
| Requisições | `execucao/requisicoes.md` | Solicitar informações à unidade auditada | P02 |

### Achados e Resultados
| Página | Arquivo | Descrição | Perfil |
|--------|---------|-----------|--------|
| Registrar Achado | `achados/registrar-achado.md` | Documentar achado com 4 atributos | P01, P02 |
| Enviar para Manifestação | `achados/enviar-manifestacao.md` | Encaminhar achado à unidade auditada | P01, P02 |
| Manifestar Achado | `achados/manifestar-achado.md` | Responder como gestor da unidade | P05 |
| Quadro de Achados | `achados/quadro-achados.md` | Visualizar todos os achados da auditoria | P01, P02 |

### Relatórios e Monitoramento
| Página | Arquivo | Descrição | Perfil |
|--------|---------|-----------|--------|
| Relatório Preliminar | `relatorios/relatorio-preliminar.md` | Gerar relatório com achados preliminares | P01, P02 |
| Relatório Final | `relatorios/relatorio-final.md` | Emitir relatório com recomendações | P01 |
| Relatório Anual | `relatorios/relatorio-anual.md` | Relatório anual ao órgão colegiado | P01, P03, P04 |
| Painel de Recomendações | `monitoramento/painel-recomendacoes.md` | Acompanhar status das recomendações | P01, P06 |
| Registrar Providências | `monitoramento/registrar-providencias.md` | Informar ações tomadas | P05 |

### Consultorias
| Página | Arquivo | Descrição | Perfil |
|--------|---------|-----------|--------|
| Solicitar Consultoria | `consultorias/solicitar-consultoria.md` | Pedir assessoramento à AUDIN | P05 |
| Gerenciar Consultorias | `consultorias/gerenciar-consultorias.md` | Analisar e registrar consultorias | P01 |

### Qualidade e PQAUD
| Página | Arquivo | Descrição | Perfil |
|--------|---------|-----------|--------|
| Avaliações de Qualidade | `qualidade/avaliacoes.md` | Autoavaliações e monitoramento contínuo | P01 |
| Avaliação Externa | `qualidade/avaliacao-externa.md` | Realizar avaliação externa | P07 |
| Não Conformidades | `qualidade/nao-conformidades.md` | Gerenciar planos de ação corretiva | P01 |

### Integrações
| Página | Arquivo | Descrição | Perfil |
|--------|---------|-----------|--------|
| Ações Coordenadas | `integracoes/acoes-coordenadas.md` | Auditorias coordenadas pelo SIAUD-Jud | P01, P08, P09 |

### Dashboards
| Página | Arquivo | Descrição | Perfil |
|--------|---------|-----------|--------|
| Dashboard PAA | `dashboards/paa.md` | Acompanhar execução do plano anual | P01 |
| Dashboard Recomendações | `dashboards/recomendacoes.md` | Visão consolidada de recomendações | P01, P06 |

---

## 5. Glossário do Usuário

Ver `docs/business/specs/glossario.md` para a lista completa de termos. Abaixo os termos mais relevantes ao uso diário:

| Termo | Definição resumida |
|-------|-------------------|
| **PAA** | Plano Anual de Auditoria — define quais auditorias serão feitas no ano |
| **PALP** | Plano de Auditoria de Longo Prazo — planejamento para 4 anos |
| **Achado** | Fato relevante identificado na auditoria (positivo ou negativo) |
| **Manifestação** | Resposta do gestor da unidade auditada sobre um achado |
| **Recomendação** | Proposta de ação corretiva emitida pela AUDIN |
| **Evidência** | Documento que comprova uma verificação de auditoria |
| **PQAUD** | Programa de Qualidade da atividade de auditoria |

---

## 6. Suporte

Em caso de dúvidas sobre o uso do sistema, contate:
- **AUDIN/TJCE:** [email-audin]
- **Suporte Técnico:** [email-ti-tjce]

---

**Versão:** 1.0 | **Data:** 2026-06-16
