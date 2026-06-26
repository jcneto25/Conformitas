---
name: llc-step-11
description: Pipeline LLC — Execução dos PRPs com TDD, ACE e validações de gate. Use quando iniciar a implementação do Step 11 ou rodar `llc run --step 11`.
version: 1.0.0
tags: [execution, prp, tdd, ace, implementation, llc-pipeline]
---

# LLC Skill: Step 11 — Execução dos PRPs

**Pipeline:** Live and Let Code (LLC)  
**Fase:** Execution  
**Depende de:** Steps 3 (PRPs), 4 (Planejamento), 6 (Tasks), 8 (Setup), 10 (Project Docs), 11-Security (gate pré-execução quando aplicável)  
**Mantenedor:** Equipe LLC

## Como usar esta Skill

1. Coloque este arquivo em `.claude/skills/` ou na pasta `docs/skills/` do projeto.
2. Invoque no chat usando: `@llc-step-11` ou "Execute a skill llc-step-11".
3. Use esta skill para implementar um PRP, uma tarefa da onda atual ou um conjunto pequeno de tarefas claramente relacionadas.
4. Use `llc-step-11-security` antes da execução quando o projeto ainda não tiver passado pelo gate de segurança inicial.
5. Use `llc-step-11-owasp-security` depois da implementação para hardening e revisão OWASP.

## Pré-requisitos

- [ ] `docs/prps/PRP-*.md` disponíveis e atualizados
- [ ] `docs/planning/EXECUTION_WAVES.md` com a onda atual definida
- [ ] `docs/planning/TASKS.md` com tarefas acionáveis para o PRP
- [ ] `docs/architecture/ARCHITECTURE.md` para padrões técnicos e decisões de stack
- [ ] `README.md` e `AGENTS.md` alinhados com o contexto do projeto
- [ ] Ambiente local funcional (build/test/lint executáveis)
- [ ] Sessão ACE iniciada com `initialize_session.py`

---

## PROMPT DE EXECUÇÃO

Você está executando a skill `llc-step-11` do pipeline LLC. Seu objetivo é implementar tarefas do projeto a partir dos PRPs aprovados, seguindo TDD, registrando contexto via ACE e preservando alinhamento com a documentação do repositório.

Esta skill cobre a execução principal do Step 11. Ela não substitui:

- `llc-step-11-security` para auditoria pré-execução
- `llc-step-11-owasp-security` para hardening pós-implementação
- `llc-step-12-null-safety` para validação documental de nulabilidade

### 1. Leia as Entradas

- `AGENTS.md` — protocolo operativo do projeto, restrições e critérios de escalonamento
- `README.md` — visão geral do estado atual do projeto
- `docs/prps/PRP-*.md` — contrato do PRP em execução
- `docs/planning/EXECUTION_WAVES.md` — contexto da onda atual
- `docs/planning/TASKS.md` — tarefas vinculadas ao PRP
- `docs/architecture/ARCHITECTURE.md` — arquitetura-alvo e padrões
- código fonte afetado — apenas os módulos necessários para a tarefa

### 2. Delimite o Escopo

Antes de editar qualquer arquivo:

1. Identifique o PRP alvo.
2. Identifique quais tarefas do `TASKS.md` serão tratadas nesta sessão.
3. Liste os arquivos prováveis de mudança.
4. Se a alteração tocar múltiplos módulos, autenticação, schema, CI/CD ou interfaces públicas, classifique como arquitetural e peça decisão humana.

### 3. Siga o Ciclo de Implementação

#### Etapa A: Preparação

- Inicialize ou confirme a sessão ACE.
- Se o trabalho estiver em zona amarela/vermelha, execute o `impact-analyzer.py` antes da mudança.
- Releia o PRP e extraia:
  - critérios de aceite
  - contratos de entrada/saída
  - regras de negócio
  - restrições de segurança

#### Etapa B: TDD Obrigatório

Para cada unidade de trabalho:

1. Escreva o teste primeiro.
2. Execute o teste e confirme falha.
3. Implemente o mínimo para passar.
4. Execute novamente os testes.
5. Refatore sem quebrar o verde.

Nunca implemente antes do teste quando a tarefa exigir código novo ou mudança comportamental relevante.

#### Etapa C: Implementação

- Mantenha o escopo pequeno e aderente ao PRP.
- Reutilize padrões e estruturas já existentes.
- Não introduza dependências, automações ou refactors laterais sem necessidade explícita.
- Preserve isolamento de dados, RBAC, soft delete e validação de entrada conforme o projeto.

#### Etapa D: Verificação

Ao concluir:

- execute testes focados da área alterada
- execute lint/type-check se o escopo justificar
- valide se a implementação continua coerente com PRP, Tasks e Architecture
- registre tarefas concluídas na sessão ACE usando `<task_completed ...>`

### 4. Regras Críticas

- **Anti-alucinação:** não invente requisitos fora de `AGENTS.md`, `README.md`, PRPs e specs.
- **Escopo mínimo:** implemente apenas o necessário para a tarefa atual.
- **Transparência:** se algo falhar, pare e exponha erro bruto, teoria, próximo passo e expectativa.
- **Segurança:** trate autenticação, autorização, segredos e logs como áreas críticas.
- **Append-only em ACE:** registre deltas e contexto de encerramento sem perder o histórico.

### 5. Output Esperado

Ao final da sessão de execução, espera-se:

```text
- código implementado para o PRP/tarefa
- testes escritos e executados
- sessão ACE atualizada em .ace/sessions/YYYY-MM-DD-NNN.md
- context_seed final no formato de 4 campos
- task_completed registrados quando aplicável
```

### 6. Checklist de Encerramento

- [ ] O comportamento implementado está previsto no PRP
- [ ] Os testes foram escritos antes da implementação
- [ ] Os testes relevantes passaram
- [ ] O escopo ficou limitado aos arquivos necessários
- [ ] O impacto documental foi avaliado quando aplicável
- [ ] A sessão ACE contém ações, gate, blockers e context_seed

### 7. Context Seed Obrigatório

Ao concluir o step, gere um `context_seed` com exatamente estes campos:

```text
state: [ações concluídas, arquivos alterados]
pending: [tarefas incompletas ou follow-ups]
blockers: [impedimentos ativos]
next_action: [próximo passo recomendado]
```
