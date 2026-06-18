# CONFORMITAS (SGI)
## MOD-INT-001 — Integrações

**Versão:** 1.0
**Data:** 16/06/2026
**Autor:** Gerado por IA
**Status:** Rascunho

---

## 1. IDENTIFICAÇÃO DO MÓDULO

| Campo | Valor |
|-------|-------|
| **ID do Módulo** | MOD-INT-001 |
| **Nome do Módulo** | Integrações e Catálogo de Integrações |
| **Domínio Funcional** | Integrações |
| **Prioridade** | Should |
| **Complexidade** | Alta |
| **Onda de Implementação** | 3 |
| **Dependências** | MOD-ADM-001 |
| **Estimativa (homem-dia)** | 10 dias |

---

## 2. OBJETIVO E CONTEXTO

### 2.1 Propósito do Módulo
Gerencia o catálogo de integrações do CONFORMITAS com sistemas corporativos do TJCE e entidades externas. Implementa conectores para sistemas de ouvidoria, orçamento, financeiro, pessoal e patrimônio, além de canais de comunicação com órgãos de controle externo (CNJ, TCE). Suporta também a integração com o SIAUD-Jud para Ações Coordenadas de Auditoria.

### 2.2 Escopo do Módulo

#### Dentro do Escopo
- Catálogo de integrações com metadados (sistema, protocolo, autenticação, SLAs)
- Conectores para sistemas corporativos do TJCE
- Integração com ouvidoria (canal de denúncias e reclamações)
- Integração com sistemas de orçamento, financeiro e pessoal
- Integração com bases de dados de patrimônio
- Comunicação eletrônica com TCE e CNJ (envio de relatórios, determinações)
- Integração com portal de transparência do TJCE (publicação automática)
- SIAUD-Jud: Ações Coordenadas de Auditoria (CNJ 308, arts. 13-14)
- Monitoramento de saúde das integrações (status, erros, retry)
- Logs de integração com rastreabilidade

#### Fora do Escopo
- Implementação de APIs dos sistemas externos (responsabilidade de cada sistema)
- SSO corporativo (usado via MOD-ADM-001, mas a implementação do SSO é externa)

---

## 3. REQUISITOS FUNCIONAIS

| ID | Funcionalidade | Descrição | Prioridade |
|----|---------------|-----------|------------|
| RF-INT-001 | Catálogo de Integrações | Registrar sistemas integrados com tipo, protocolo, endpoint, autenticação | Should |
| RF-INT-002 | Integração Ouvidoria | Consumir denúncias e reclamações para subsidiar planejamento (CNJ 309 art. 34 §3º) | Should |
| RF-INT-003 | Integração Sistemas Corporativos | Conectar com orçamento, financeiro, pessoal e patrimônio do TJCE | Could |
| RF-INT-004 | Comunicação TCE/CNJ | Enviar relatórios, receber determinações e recomendações | Should |
| RF-INT-005 | Publicação em Portal de Transparência | Publicar PAA, PALP e relatório anual automaticamente (CNJ 308 art. 5º §3º) | Should |
| RF-INT-006 | Ações Coordenadas SIAUD-Jud | Suportar auditorias simultâneas coordenadas pelo CNJ (CPA aprova, Comitê propõe) | Should |
| RF-INT-007 | Dashboard de Saúde | Monitorar status de cada integração, erros e latência | Could |
| RF-INT-008 | Logs de Integração | Registrar requisições, respostas e erros de integrações | Should |

### 3.2 Casos de Uso (Gherkin)

#### RF-INT-002: Integração Ouvidoria

**Cenário Principal:**
```gherkin
Dado que a integração com a Ouvidoria do TJCE está configurada
Quando o Auditor-Chefe acessa o painel de planejamento
Então o sistema exibe denúncias e reclamações relevantes para o universo auditável
E permite selecionar itens para consideração no PAA/PALP
```

#### RF-INT-006: Ações Coordenadas SIAUD-Jud

**Cenário Principal:**
```gherkin
Dado que o Comitê SIAUD-Jud propôs uma Ação Coordenada de Auditoria
E a CPA aprovou a ação
Quando o CONFORMITAS recebe a notificação da ação coordenada
Então o sistema cria uma auditoria especial no PAA com escopo e metodologia padronizados
E permite ao Auditor-Chefe designar equipe e cronograma
E reporta resultados à CPA ao final
```

---

## 4. REGRAS DE NEGÓCIO

| ID | Regra | Descrição | Gatilho | Ação |
|----|-------|-----------|---------|------|
| RN-INT-001 | Comunicação com Ouvidoria | AUDIN deve manter canal permanente com ouvidorias (CNJ 309 art. 34 §3º) | Consulta periódica | Sincronização de dados |
| RN-INT-002 | Publicação no prazo | Planos e relatório anual publicados no portal em até 30 dias após aprovação/deliberação (CNJ 308 art. 5º §3º, CNJ 309 art. 32 §2º) | Aprovação do documento | Alerta de prazo de publicação |
| RN-INT-003 | Ações Coordenadas obrigatórias | Ações Coordenadas aprovadas pela CPA são de participação obrigatória | Recebimento de ação coordenada | Inclusão automática no PAA |
| RN-INT-004 | Confidencialidade nas integrações | Dados transferidos via integração mantêm classificação de sigilo original | Transferência de dados | Herança de classificação |

---

## 5. MODELO DE DADOS DO MÓDULO

#### Integracao
| Campo | Tipo | Obrigatório | Descrição | Restrições |
|-------|------|-------------|-----------|------------|
| `id` | UUID | Sim | Identificador único | PK |
| `nome` | String | Sim | Nome da integração | Unique |
| `sistema_externo` | String | Sim | Sistema de origem/destino | — |
| `tipo` | Enum | Sim | ENTRADA, SAIDA, BIDIRECIONAL | — |
| `protocolo` | Enum | Sim | REST, SOAP, SFTP, EMAIL, WEBHOOK | — |
| `endpoint` | String | Sim | URL ou caminho do endpoint | — |
| `metodo_autenticacao` | Enum | Sim | API_KEY, OAUTH2, BASIC, CERTIFICADO, NONE | — |
| `credenciais_id` | UUID | Não | ID do vault de credenciais | — |
| `frequencia` | Enum | Sim | TEMPO_REAL, DIARIA, SEMANAL, MENSAL, SOB_DEMANDA | — |
| `status` | Enum | Sim | ATIVA, INATIVA, ERRO, EM_CONFIGURACAO | — |
| `ultima_sincronizacao` | DateTime | Não | Data da última execução bem-sucedida | — |
| `health_status` | Enum | Não | OK, DEGRADED, DOWN | — |

#### AcaoCoordenada
| Campo | Tipo | Obrigatório | Descrição | Restrições |
|-------|------|-------------|-----------|------------|
| `id` | UUID | Sim | Identificador único | PK |
| `codigo_siaud` | String | Sim | Código no SIAUD-Jud | Unique |
| `titulo` | String | Sim | Título da ação coordenada | — |
| `descricao` | Text | Sim | Descrição e escopo | — |
| `metodologia` | Text | Sim | Metodologia padronizada | — |
| `data_aprovacao_cpa` | Date | Sim | Data de aprovação pela CPA | — |
| `prazo_execucao` | Date | Sim | Prazo para conclusão | — |
| `status` | Enum | Sim | PENDENTE, EM_EXECUCAO, CONCLUIDA, REPORTADA | — |
| `auditoria_id` | UUID | Não | Auditoria vinculada no CONFORMITAS | FK → Auditoria |
| `resultado_reportado` | Text | Não | Resultados reportados à CPA | — |

#### LogIntegracao
| Campo | Tipo | Obrigatório | Descrição | Restrições |
|-------|------|-------------|-----------|------------|
| `id` | UUID | Sim | Identificador único | PK |
| `integracao_id` | UUID | Sim | Integração | FK → Integracao |
| `status` | Enum | Sim | SUCESSO, ERRO, TIMEOUT | — |
| `requisicao` | JSON | Não | Dados da requisição (sem credenciais) | — |
| `resposta` | JSON | Não | Dados da resposta resumida | — |
| `erro` | Text | Não | Mensagem de erro | — |
| `duracao_ms` | Integer | Sim | Duração em ms | — |
| `created_at` | DateTime | Sim | Timestamp | Auto |

---

## 6. INTERFACES E INTERAÇÕES

### 6.1 APIs do Módulo

| Método | Endpoint | Descrição | Perfis Autorizados |
|--------|----------|-----------|---------------------|
| GET | `/api/v1/integracoes` | Listar catálogo de integrações | P01, P10 |
| POST | `/api/v1/integracoes` | Registrar nova integração | P10 |
| PUT | `/api/v1/integracoes/{id}` | Editar integração | P10 |
| POST | `/api/v1/integracoes/{id}/testar` | Testar conectividade | P10 |
| GET | `/api/v1/integracoes/{id}/logs` | Logs da integração | P01, P10 |
| GET | `/api/v1/integracoes/health` | Status de saúde de todas | P01, P10 |
| GET | `/api/v1/acoes-coordenadas` | Listar ações coordenadas | P01, P08, P09 |
| POST | `/api/v1/acoes-coordenadas` | Registrar ação coordenada | P01 (via integração SIAUD-Jud) |
| GET | `/api/v1/acoes-coordenadas/{id}` | Detalhes da ação | P01, P08, P09 |
| PUT | `/api/v1/acoes-coordenadas/{id}/reportar` | Reportar resultado à CPA | P01 |

### 6.2 Telas e Componentes de UI

| Tela / Componente | Descrição | Perfis com Acesso | Estados |
|--------------------|-----------|--------------------|---------|
| `IntegracaoList` | Catálogo com status de saúde de cada integração | P01, P10 | Carregando, Vazio, Dados |
| `IntegracaoForm` | Cadastro/edição de integração com teste de conectividade | P10 | Carregando, Editando, Erro |
| `IntegracaoDashboard` | Painel de saúde com gráfico de latência e erros | P01, P10 | Carregando, Dados, Erro |
| `AcaoCoordenadaList` | Lista de ações coordenadas do SIAUD-Jud | P01, P08, P09 | Carregando, Vazio, Dados |
| `AcaoCoordenadaDetail` | Detalhes, equipe, cronograma e reporte | P01 | Carregando, Dados, Erro |

### 6.3 Integrações com Outros Módulos

| Módulo de Origem/Destino | Dado Compartilhado | Direção | Mecanismo |
|--------------------------|--------------------|---------|-----------|
| MOD-PLN-001 | Dados da ouvidoria para universo auditável | Saída | API |
| MOD-GOV-001 | Publicação de relatórios no portal | Saída | API |
| MOD-REL-001 | Relatório anual para portal e TCE/CNJ | Saída | API |
| MOD-EXE-001 | Ações coordenadas viram auditorias | Saída | Evento |

---

## 7. REQUISITOS NÃO FUNCIONAIS DO MÓDULO

| ID | Requisito | Descrição | Métrica Alvo |
|----|-----------|-----------|--------------|
| RNF-INT-001 | Timeout de integração | Timeout máximo para chamadas externas | 30s |
| RNF-INT-002 | Retry policy | Política de retry com backoff exponencial | 3 tentativas, 2^n segundos |
| RNF-INT-003 | Segurança | Credenciais em vault, nunca em logs | Criptografadas em repouso |

---

## 8. DEFINIÇÃO DE PRONTO (DoD) DO MÓDULO

- [ ] Todos os RFs implementados e testados
- [ ] Catálogo de integrações funcional
- [ ] Conector de Ouvidoria implementado
- [ ] Ações Coordenadas SIAUD-Jud com workflow completo
- [ ] Dashboard de saúde das integrações
- [ ] Cobertura de testes ≥ 80% (unitários), ≥ 70% (integração)
- [ ] Credenciais em vault seguro
- [ ] PR revisado e aprovado

---

## 9. CONTROLE DE VERSÃO

| Versão | Data | Autor | Alterações |
|--------|------|-------|------------|
| 1.0 | 16/06/2026 | IA | Versão inicial — criado após lacuna identificada no Gate 1 |
