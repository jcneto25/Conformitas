# CONFORMITAS (SGI) — REGRAS DE NEGÓCIO

**Versão:** 1.0 | **Data:** 16/06/2026 | **Responsável:** IA (Step 1)

---

## 1. Objetivo

Este volume consolida todas as regras de negócio do CONFORMITAS, extraídas dos módulos validados no Step 0.5 e das normas aplicáveis (Lei 18.561/2023, CNJ 308/2020, CNJ 309/2020).

---

## 2. Convenções

| Campo | Descrição |
|---|---|
| **ID** | RN-[DOMÍNIO]-[NUM] |
| **Criticidade** | Alta / Média / Baixa |
| **Origem** | Documento/artigo de origem |
| **Entidades** | Entidades afetadas |

---

## 3. Regras de Negócio por Domínio

### 3.1 Administração e Segurança (RN-ADM)

**RN-ADM-001.** Política de senhas: mínimo 8 caracteres, maiúscula, minúscula, número e símbolo. Expiração a cada 90 dias. Histórico de 5 senhas não reutilizável. **Criticidade:** Alta. **Origem:** MOD-ADM-001. **Entidades:** Usuario.

**RN-ADM-002.** Sessão expira após 30 minutos de inatividade. Refresh token válido por 8 horas. **Criticidade:** Média. **Origem:** MOD-ADM-001. **Entidades:** Sessao.

**RN-ADM-003.** Segregação de funções: Usuário não pode ter simultaneamente P01 + outro perfil; P02 + P05 da mesma unidade; P10 + qualquer perfil de negócio. **Criticidade:** Alta. **Origem:** MOD-ADM-001. **Entidades:** Usuario, Perfil.

**RN-ADM-004.** Mandato do Auditor-Chefe: 2 anos, máximo 2 reconduções (6 anos total). Interstício de 1 ano para novo mandato. Destituição apenas por decisão colegiada (CNJ 308 art. 6º). **Criticidade:** Alta. **Origem:** CNJ 308/2020 art. 6º. **Entidades:** MandatoAuditorChefe.

**RN-ADM-005.** Vedação de designação: Não é permitido cadastrar/ativar como Auditor pessoa condenada por TCE, punida em PAD, ou condenada por improbidade (CNJ 308 art. 7º). **Criticidade:** Alta. **Origem:** CNJ 308/2020 art. 7º. **Entidades:** Usuario.

**RN-ADM-006.** Escopo do Gestor de Unidade: P05 só acessa dados da sua própria unidade. **Criticidade:** Média. **Origem:** MOD-ADM-001. **Entidades:** UsuarioPerfil.

**RN-ADM-007.** Acesso de Avaliador Externo: concedido por prazo determinado, apenas leitura, apenas ao escopo da avaliação. **Criticidade:** Média. **Origem:** MOD-ADM-001, CNJ 309 art. 67. **Entidades:** UsuarioPerfil.

---

### 3.2 Planejamento (RN-PLN)

**RN-PLN-001.** PAA deve ser submetido ao Presidente até 30/novembro de cada ano (CNJ 309 art. 32 §1º, II). Alerta a partir de 01/novembro. **Criticidade:** Alta. **Origem:** CNJ 309/2020 art. 32. **Entidades:** PlanoAuditoria.

**RN-PLN-002.** PALP deve ser submetido até 30/novembro do último ano do quadriênio. **Criticidade:** Alta. **Origem:** CNJ 309/2020 art. 32 §1º, I. **Entidades:** PlanoAuditoria.

**RN-PLN-003.** Planos devem ser publicados no portal até o 15º dia útil de dezembro após aprovação (CNJ 309 art. 32 §2º). **Criticidade:** Média. **Origem:** CNJ 309/2020 art. 32. **Entidades:** PlanoAuditoria.

**RN-PLN-004.** Não é permitido aprovar PAA com horas alocadas > horas disponíveis da força de trabalho. **Criticidade:** Alta. **Origem:** MOD-PLN-001. **Entidades:** PlanoAuditoria, ForcaTrabalho.

**RN-PLN-005.** Mudanças no contexto organizacional podem exigir revisão do PAA, com versionamento e justificativa (CNJ 309 art. 34 §4º). **Criticidade:** Média. **Origem:** CNJ 309/2020 art. 34. **Entidades:** PlanoAuditoria.

---

### 3.3 Execução de Auditoria (RN-EXE)

**RN-EXE-001.** Auditoria só pode ser aberta para itens de PAA aprovado. **Criticidade:** Alta. **Origem:** MOD-EXE-001. **Entidades:** Auditoria, ItemPlano.

**RN-EXE-002.** Qualquer obstrução à auditoria deve ser comunicada imediatamente ao Auditor-Chefe (CNJ 309 art. 45 §2º). **Criticidade:** Alta. **Origem:** CNJ 309/2020 art. 45. **Entidades:** Auditoria.

**RN-EXE-003.** Papéis de trabalho devem permanecer acessíveis por no mínimo 10 anos (CNJ 309 art. 44). **Criticidade:** Alta. **Origem:** CNJ 309/2020 art. 44. **Entidades:** PapelTrabalho.

**RN-EXE-004.** Requisições à unidade auditada devem fixar prazo de resposta obrigatório (CNJ 309 art. 46 §4º). **Criticidade:** Média. **Origem:** CNJ 309/2020 art. 46. **Entidades:** Requisicao.

---

### 3.4 Achados e Resultados (RN-ACH)

**RN-ACH-001.** Todo achado deve ter os 4 atributos obrigatórios: situação encontrada, critério, causa e efeito (CNJ 309 art. 46). **Criticidade:** Alta. **Origem:** CNJ 309/2020 art. 46. **Entidades:** AchadoAuditoria.

**RN-ACH-002.** Manifestações da unidade auditada devem ser incorporadas como elemento do achado (CNJ 309 art. 46 §5º). **Criticidade:** Média. **Origem:** CNJ 309/2020 art. 46. **Entidades:** AchadoAuditoria, Manifestacao.

**RN-ACH-003.** Prazo mínimo de 5 dias úteis para manifestação da unidade auditada sobre achados preliminares (CNJ 309 art. 54 §3º). **Criticidade:** Média. **Origem:** CNJ 309/2020 art. 54. **Entidades:** AchadoAuditoria.

---

### 3.5 Relatórios e Monitoramento (RN-REL)

**RN-REL-001.** Relatório Anual deve ser encaminhado ao órgão colegiado até o final de julho do ano seguinte (CNJ 308 art. 5º §1º). **Criticidade:** Alta. **Origem:** CNJ 308/2020 art. 5º. **Entidades:** RelatorioAnual.

**RN-REL-002.** Ausência de manifestação da unidade auditada não impede a emissão do Relatório Final (CNJ 309 art. 54 §4º). **Criticidade:** Média. **Origem:** CNJ 309/2020 art. 54. **Entidades:** RelatorioAuditoria.

**RN-REL-003.** Monitoramento deve priorizar correção de problemas de natureza grave, com risco de dano ao erário ou comprometimento de metas (CNJ 309 art. 57 §1º). **Criticidade:** Alta. **Origem:** CNJ 309/2020 art. 57. **Entidades:** Recomendacao.

**RN-REL-004.** Auditorias subsequentes sobre o mesmo tema devem verificar recomendações anteriores pendentes (CNJ 309 art. 57 §2º). **Criticidade:** Média. **Origem:** CNJ 309/2020 art. 57. **Entidades:** Recomendacao, Auditoria.

---

### 3.6 Consultorias (RN-CON)

**RN-CON-001.** Auditor não pode praticar ato de gestão em consultoria — vedação à cogestão (CNJ 309 art. 58, I; art. 20). **Criticidade:** Alta. **Origem:** CNJ 309/2020 art. 20, 58. **Entidades:** Consultoria.

**RN-CON-002.** Aceitação de consultoria não pode prejudicar auditorias previstas no PAA (CNJ 309 art. 38, IV). **Criticidade:** Média. **Origem:** CNJ 309/2020 art. 38. **Entidades:** Consultoria, PlanoAuditoria.

**RN-CON-003.** Natureza e escopo da consultoria devem ser acordados previamente com a unidade solicitante (CNJ 309 art. 58, I). **Criticidade:** Média. **Origem:** CNJ 309/2020 art. 58. **Entidades:** SolicitacaoConsultoria.

---

### 3.7 Qualidade (RN-QLD)

**RN-QLD-001.** Toda unidade de auditoria interna deve manter programa de qualidade — PQAUD (CNJ 309 art. 62). **Criticidade:** Alta. **Origem:** CNJ 309/2020 art. 62. **Entidades:** AvaliacaoQualidade.

**RN-QLD-002.** Auditor-Chefe deve homologar controle de qualidade assegurando que padrões foram seguidos (CNJ 309 art. 68). **Criticidade:** Média. **Origem:** CNJ 309/2020 art. 68. **Entidades:** AvaliacaoQualidade.

**RN-QLD-003.** Avaliações recíprocas entre 3 ou mais unidades são consideradas independentes para avaliação externa (CNJ 309 art. 67 §3º). **Criticidade:** Média. **Origem:** CNJ 309/2020 art. 67. **Entidades:** AvaliacaoQualidade.

---

### 3.8 Ética e Independência (RN-ETI)

**RN-ETI-001.** Auditor não pode auditar operações com as quais esteve envolvido nos últimos 12 meses (CNJ 309 art. 15). **Criticidade:** Alta. **Origem:** CNJ 309/2020 art. 15. **Entidades:** Impedimento.

**RN-ETI-002.** Todo integrante da AUDIN deve firmar termo de confidencialidade antes de atuar (CNJ 309 art. 77 § único). **Criticidade:** Alta. **Origem:** CNJ 309/2020 art. 77. **Entidades:** TermoConfidencialidade.

---

### 3.9 Governança e Fraudes (RN-GOV)

**RN-GOV-001.** Relatório anual deve ser publicado na internet até 30 dias após deliberação do órgão colegiado (CNJ 308 art. 5º §3º). **Criticidade:** Média. **Origem:** CNJ 308/2020 art. 5º. **Entidades:** RelatorioAnual.

**RN-GOV-002.** Fraudes: primeiro comunicar ao superior hierárquico; após 60 dias sem resposta, ao TCE (CNJ 309 art. 13). **Criticidade:** Alta. **Origem:** CNJ 309/2020 art. 13. **Entidades:** RegistroFraude.

**RN-GOV-003.** AUDIN deve manter canal permanente de comunicação com ouvidorias (CNJ 309 art. 34 §3º). **Criticidade:** Média. **Origem:** CNJ 309/2020 art. 34. **Entidades:** Integracao.

---

### 3.10 Capacitação (RN-CAP)

**RN-CAP-001.** Meta mínima de 40 horas anuais de capacitação por servidor lotado na AUDIN (CNJ 309 art. 72). **Criticidade:** Média. **Origem:** CNJ 309/2020 art. 72. **Entidades:** Capacitacao.

**RN-CAP-002.** PAC-Aud deve ser submetido após aprovação do PAA (CNJ 309 art. 70). **Criticidade:** Média. **Origem:** CNJ 309/2020 art. 70. **Entidades:** Capacitacao, PlanoAuditoria.

**RN-CAP-003.** Auditor sem capacidade técnica para trabalho específico não participa da auditoria (CNJ 309 art. 70 §2º). **Criticidade:** Alta. **Origem:** CNJ 309/2020 art. 70. **Entidades:** Competencia, Auditoria.

---

### 3.11 Sigilo (RN-SIG)

**RN-SIG-001.** Auditor não divulga informações dos trabalhos sem anuência da autoridade competente (CNJ 309 art. 11). **Criticidade:** Alta. **Origem:** CNJ 309/2020 art. 11. **Entidades:** ClassificacaoDocumento.

**RN-SIG-002.** Auditorias com informações sensíveis que possam comprometer investigações → consulta ao Presidente sobre sigilo (CNJ 309 art. 50). **Criticidade:** Alta. **Origem:** CNJ 309/2020 art. 50. **Entidades:** Auditoria, ClassificacaoDocumento.

**RN-SIG-003.** Direito de acesso a documentos de auditoria assegurado após assinatura do relatório final (CNJ 309 art. 55 §2º). **Criticidade:** Média. **Origem:** CNJ 309/2020 art. 55. **Entidades:** Documento.

---

### 3.12 Integrações (RN-INT)

**RN-INT-001.** Ações Coordenadas aprovadas pela CPA são de participação obrigatória para a AUDIN. **Criticidade:** Alta. **Origem:** CNJ 308/2020 art. 14. **Entidades:** AcaoCoordenada.

**RN-INT-002.** Dados transferidos via integração mantêm a classificação de sigilo original. **Criticidade:** Média. **Origem:** MOD-INT-001. **Entidades:** Integracao.

**RN-INT-003.** Planos e relatório anual devem ser publicados no portal em até 30 dias após aprovação/deliberação (CNJ 308 art. 5º §3º, CNJ 309 art. 32 §2º). **Criticidade:** Média. **Origem:** CNJ 308/2020 art. 5º; CNJ 309/2020 art. 32. **Entidades:** Integracao.

---

## 4. Resumo Estatístico

| Domínio | Código | Quantidade | Alta | Média |
|---|---|---|---|---|
| Administração e Segurança | RN-ADM | 7 | 4 | 3 |
| Planejamento | RN-PLN | 5 | 3 | 2 |
| Execução | RN-EXE | 4 | 3 | 1 |
| Achados | RN-ACH | 3 | 1 | 2 |
| Relatórios e Monitoramento | RN-REL | 4 | 2 | 2 |
| Consultorias | RN-CON | 3 | 1 | 2 |
| Qualidade | RN-QLD | 3 | 1 | 2 |
| Ética | RN-ETI | 2 | 2 | 0 |
| Governança e Fraudes | RN-GOV | 3 | 1 | 2 |
| Capacitação | RN-CAP | 3 | 1 | 2 |
| Sigilo | RN-SIG | 3 | 2 | 1 |
| Integrações | RN-INT | 3 | 1 | 2 |
| **TOTAL** | | **43** | **22** | **21** |

---

## 5. Referências Normativas

| Referência | Regras Relacionadas |
|---|---|
| Lei 18.561/2023 | RN-ADM-003 (3 linhas de defesa) |
| CNJ 308/2020 | RN-ADM-004, RN-ADM-005, RN-REL-001, RN-GOV-001, RN-INT-001 |
| CNJ 309/2020 (DIRAUD-Jud) | RN-PLN-001 a 005, RN-EXE-001 a 004, RN-ACH-001 a 003, RN-REL-002 a 004, RN-CON-001 a 003, RN-QLD-001 a 003, RN-ETI-001, RN-ETI-002, RN-GOV-002, RN-GOV-003, RN-CAP-001 a 003, RN-SIG-001 a 003 |
| MOD-ADM-001 | RN-ADM-001, RN-ADM-002, RN-ADM-006, RN-ADM-007 |
| MOD-INT-001 | RN-INT-002 |

---

## Histórico de Versões

| Versão | Data | Responsável | Descrição |
|---|---|---|---|
| 1.0 | 16/06/2026 | IA (Step 1) | Versão inicial — 43 regras em 12 domínios |
