# CONFORMITAS (SGI)
## MOD-SIG-001 — Sigilo e Classificação da Informação

**Versão:** 1.0 | **Data:** 16/06/2026 | **Autor:** Gerado por IA | **Status:** Rascunho

---

## 1. IDENTIFICAÇÃO DO MÓDULO

| Campo | Valor |
|-------|-------|
| **ID do Módulo** | MOD-SIG-001 |
| **Nome do Módulo** | Sigilo e Classificação da Informação |
| **Domínio Funcional** | Sigilo e Classificação da Informação |
| **Prioridade** | Must |
| **Complexidade** | Média |
| **Onda de Implementação** | 1 |
| **Dependências** | MOD-ADM-001, MOD-EXE-001 |
| **Estimativa (homem-dia)** | 6 dias |

---

## 2. OBJETIVO E CONTEXTO

### 2.1 Propósito do Módulo
Gerencia a classificação de sigilo de documentos e informações no sistema, conforme a DIRAUD-Jud (CNJ 309/2020, arts. 11-12 e Capítulo V sobre independência) e a Lei 13.709/2018 (LGPD). Controla o tratamento de informações sensíveis e confidenciais obtidas durante as auditorias, garantindo que auditores não divulguem informações sem autorização.

### 2.2 Escopo do Módulo
- Classificação de documentos (Público, Interno, Restrito, Sigiloso)
- Controle de acesso por nível de classificação × perfil
- Tratamento de auditorias sigilosas (art. 50, DIRAUD-Jud)
- Trilhas de auditoria de acesso a documentos sigilosos
- Restrições de divulgação (art. 11, DIRAUD-Jud)

---

## 3. REQUISITOS FUNCIONAIS

| ID | Funcionalidade | Descrição | Prioridade |
|----|---------------|-----------|------------|
| RF-SIG-001 | Classificação de Documentos | Atribuir nível de sigilo a cada documento/registro | Must |
| RF-SIG-002 | Controle de Acesso por Sigilo | Restringir visualização conforme classificação × perfil | Must |
| RF-SIG-003 | Auditoria Sigilosa | Marcar auditoria como sigilosa (art. 50) e restringir acesso | Must |
| RF-SIG-004 | Trilha de Acesso | Registrar quem acessou documentos sigilosos | Must |
| RF-SIG-005 | Termo de Confidencialidade | Integrar com MOD-ETI-001 para validação de confidencialidade | Should |

---

## 4. REGRAS DE NEGÓCIO

| ID | Regra | Descrição |
|----|-------|-----------|
| RN-SIG-001 | Não divulgação | Auditor não divulga informações sem anuência da autoridade competente (art. 11) |
| RN-SIG-002 | Auditoria sigilosa | Informações sensíveis que possam comprometer investigações → consulta ao Presidente (art. 50) |
| RN-SIG-003 | LGPD | Tratamento de dados pessoais conforme Lei 13.709/2018 |
| RN-SIG-004 | Acesso pós-relatório | Acesso a documentos de auditoria assegurado após assinatura do relatório final (art. 55, §2º) |

---

## 5. MODELO DE DADOS DO MÓDULO

#### ClassificacaoDocumento
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | PK |
| `entidade_tipo` | String | Sim | Tipo da entidade (Auditoria, Achado, Relatorio, Evidencia) |
| `entidade_id` | UUID | Sim | ID da entidade |
| `nivel_sigilo` | Enum | Sim | PUBLICO, INTERNO, RESTRITO, SIGILOSO |
| `justificativa` | Text | Não | Justificativa da classificação |
| `classificado_por` | UUID | Sim | Auditor-Chefe |
| `data_classificacao` | DateTime | Sim | Data |

#### LogAcesso
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | PK |
| `usuario_id` | UUID | Sim | Quem acessou |
| `entidade_tipo` | String | Sim | Tipo da entidade acessada |
| `entidade_id` | UUID | Sim | ID da entidade |
| `acao` | Enum | Sim | VISUALIZAR, EDITAR, DOWNLOAD |
| `data_acesso` | DateTime | Sim | Timestamp |

---

## 6. DEFINIÇÃO DE PRONTO (DoD)

- [ ] Todos os RFs implementados e testados
- [ ] Controle de acesso por classificação totalmente funcional
- [ ] Trilha de auditoria de acessos
- [ ] Cobertura de testes ≥ 80%
- [ ] Security review específico para sigilo
- [ ] PR revisado e aprovado
