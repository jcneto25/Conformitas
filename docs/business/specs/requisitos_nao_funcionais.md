# CONFORMITAS (SGI) — REQUISITOS NÃO FUNCIONAIS

**Versão:** 1.0 | **Data:** 16/06/2026 | **Responsável:** IA (Step 1)

---

## 1. Objetivo

Este volume consolida os requisitos não funcionais do CONFORMITAS (SGI), extraídos dos módulos validados no Step 0.5 e complementados com valores de referência baseados em boas práticas para sistemas corporativos do Poder Judiciário.

---

## 2. Convenções

| Marca | Significado |
|-------|-------------|
| **[Especificação]** | Requisito explicitamente declarado nos módulos |
| **[Inferido]** | Requisito derivado com valor de referência sugerido |

---

## 3. Performance (RNF-PERF)

**RNF-PERF-001.** Páginas de listagem (auditorias, planos, achados, recomendações) deverão carregar em p95 < 500ms para conjuntos de até 200 registros. **[Inferido]**

**RNF-PERF-002.** O cálculo da matriz de priorização do PAA deverá ser concluído em p95 < 2s. **[Especificação — MOD-PLN-001]**

**RNF-PERF-003.** O painel de monitoramento de recomendações deverá carregar em p95 < 2s. **[Especificação — MOD-REL-001]**

**RNF-PERF-004.** O quadro de achados de uma auditoria deverá carregar em p95 < 1s. **[Especificação — MOD-ACH-001]**

**RNF-PERF-005.** Upload de evidências deverá suportar arquivos de até 25MB com p95 < 3s. **[Especificação — MOD-EXE-001]**

---

## 4. Disponibilidade e Confiabilidade (RNF-DISP)

**RNF-DISP-001.** O sistema deverá ter disponibilidade mínima de 99,5% durante horário comercial (8h-18h em dias úteis). **[Especificação — MOD-PLN-001]**

**RNF-DISP-002.** Módulos críticos (Administração, Execução, Achados, Relatórios) deverão ter disponibilidade de 99,5%. **[Inferido]**

**RNF-DISP-003.** Janelas de manutenção deverão ser agendadas fora do horário comercial, com comunicação prévia de no mínimo 48h. **[Inferido]**

**RNF-DISP-004.** Backup deverá ser realizado com frequência diária (incremental) e semanal (completa), com cópia offsite. **[Inferido]**

**RNF-DISP-005.** O objetivo de tempo de recuperação (RTO) deverá ser inferior a 4 horas. **[Inferido]**

**RNF-DISP-006.** O objetivo de ponto de recuperação (RPO) deverá ser inferior a 1 hora. **[Inferido]**

**RNF-DISP-007.** Deverá existir plano de continuidade de negócio (BCP) específico para o sistema. **[Inferido]**

---

## 5. Segurança da Informação (RNF-SEGF)

**RNF-SEGF-001.** O sistema deverá suportar autenticação local com JWT. Integração com SSO corporativo do TJCE deverá ser suportada como extensão. **[Especificação — MOD-ADM-001]**

**RNF-SEGF-002.** Login local deverá ser permitido com política de complexidade de senha (mín. 8 caracteres, maiúscula, minúscula, número, símbolo). **[Especificação — MOD-ADM-001]**

**RNF-SEGF-003.** MFA via TOTP deverá ser obrigatório para perfis críticos (P01, P02, P10). **[Especificação — MOD-ADM-001]**

**RNF-SEGF-004.** O controle de acesso deverá ser RBAC (10 perfis) com restrições contextuais por unidade e nível de sigilo. **[Especificação — MOD-ADM-001]**

**RNF-SEGF-005.** O sistema deverá garantir segregação de funções: P01 não acumulável; P02 + P05 mesma unidade vedado; P10 + perfil de negócio vedado. **[Especificação — MOD-ADM-001]**

**RNF-SEGF-006.** O sistema deverá classificar informações em níveis: Público, Interno, Restrito, Sigiloso. **[Especificação — MOD-SIG-001]**

**RNF-SEGF-007.** A comunicação deverá utilizar TLS 1.3 para todas as conexões. **[Inferido]**

**RNF-SEGF-008.** Dados sensíveis (senhas, credenciais de integração) deverão ser criptografados em repouso com AES-256. **[Inferido]**

**RNF-SEGF-009.** O sistema deverá seguir as diretrizes OWASP ASVS para desenvolvimento seguro. **[Inferido]**

**RNF-SEGF-010.** O sistema deverá observar a LGPD (Lei 13.709/2018) para tratamento de dados pessoais. **[Especificação — MOD-SIG-001]**

**RNF-SEGF-011.** Senhas deverão expirar a cada 90 dias com histórico das últimas 5 senhas. **[Especificação — MOD-ADM-001]**

**RNF-SEGF-012.** Sessões deverão ter timeout de 30 minutos de inatividade. **[Especificação — MOD-ADM-001]**

**RNF-SEGF-013.** O sistema deverá proteger-se contra as principais vulnerabilidades do OWASP Top 10. **[Inferido]**

**RNF-SEGF-014.** Credenciais de integração deverão ser armazenadas em vault seguro, nunca em logs ou código. **[Especificação — MOD-INT-001]**

---

## 6. Escalabilidade (RNF-ESCA)

**RNF-ESCA-001.** A arquitetura deverá suportar escalonamento horizontal dos serviços de aplicação. **[Inferido]**

**RNF-ESCA-002.** O banco de dados deverá suportar estratégias de escalabilidade (read replicas, connection pooling). **[Inferido]**

**RNF-ESCA-003.** O armazenamento de arquivos (evidências, papéis de trabalho, relatórios) deverá ser escalável independentemente do banco relacional. **[Inferido]**

---

## 7. Interoperabilidade e Integração (RNF-INTE)

**RNF-INTE-001.** O sistema deverá adotar arquitetura orientada a serviços e APIs RESTful, com documentação OpenAPI 3.x. **[Inferido]**

**RNF-INTE-002.** Deverá integrar-se com a Ouvidoria do TJCE para recebimento de denúncias (CNJ 309 art. 34 §3º). **[Especificação — MOD-INT-001]**

**RNF-INTE-003.** Deverá integrar-se com o portal de transparência do TJCE para publicação automática de planos e relatórios. **[Especificação — MOD-INT-001]**

**RNF-INTE-004.** Deverá integrar-se com o SIAUD-Jud para Ações Coordenadas de Auditoria. **[Especificação — MOD-INT-001]**

**RNF-INTE-005.** Deverá suportar integração futura com sistemas corporativos do TJCE (orçamento, financeiro, pessoal, patrimônio). **[Especificação — MOD-INT-001]**

**RNF-INTE-006.** Integrações assíncronas deverão utilizar filas mensageiras para desacoplamento. **[Inferido]**

**RNF-INTE-007.** Cada integração deverá possuir timeout de 30s, retry com backoff exponencial (3 tentativas) e circuit breaker. **[Especificação — MOD-INT-001]**

**RNF-INTE-008.** O sistema deverá disponibilizar webhooks para notificação de eventos relevantes. **[Inferido]**

---

## 8. Usabilidade e Acessibilidade (RNF-USAB)

**RNF-USAB-001.** A interface deverá seguir o e-MAG / WCAG 2.1 nível AA. **[Inferido]**

**RNF-USAB-002.** A interface deverá ser responsiva, adaptando-se a diferentes resoluções de tela (desktop principal). **[Inferido]**

**RNF-USAB-003.** O idioma padrão deverá ser português brasileiro (PT-BR). **[Especificação — PRD]**

**RNF-USAB-004.** Campos obrigatórios deverão ser visualmente identificados, com mensagens de validação claras. **[Inferido]**

**RNF-USAB-005.** O sistema deverá disponibilizar sistema de notificações e alertas por perfil, com indicadores visuais de ações pendentes. **[Especificação — MOD-ADM-001]**

---

## 9. Manutenibilidade (RNF-MANU)

**RNF-MANU-001.** O sistema deverá adotar arquitetura modular, com módulos independentes e interfaces bem definidas. **[Inferido]**

**RNF-MANU-002.** O design deverá ser API-first, com todas as funcionalidades acessíveis via API documentada. **[Inferido]**

**RNF-MANU-003.** O sistema deverá manter versionamento nativo dos objetos versionáveis: planos (PAA/PALP), relatórios, documentos metodológicos. **[Especificação — Módulos]**

**RNF-MANU-004.** Deverá existir segregação de ambientes (desenvolvimento, homologação, produção). **[Inferido]**

**RNF-MANU-005.** A cobertura de testes automatizados deverá ser de no mínimo 80% para lógica de negócio (unitários) e 70% (integração). **[Especificação — Todos os módulos]**

**RNF-MANU-006.** Parâmetros do sistema (prazos, metas, períodos) deverão ser parametrizáveis sem alteração de código. **[Especificação — MOD-ADM-001]**

---

## 10. Conformidade Legal e Normativa (RNF-CONF)

**RNF-CONF-001.** O sistema deverá observar a LGPD (Lei 13.709/2018) para tratamento de dados pessoais. **[Especificação]**

**RNF-CONF-002.** O sistema deverá estar aderente à Lei 18.561/2023 (Sistema de Controle Interno do TJCE). **[Especificação — Visão Estratégica]**

**RNF-CONF-003.** O sistema deverá estar aderente às Resoluções CNJ 308/2020 (SIAUD-Jud) e 309/2020 (DIRAUD-Jud). **[Especificação — Visão Estratégica]**

**RNF-CONF-004.** O sistema deverá seguir as Normas Internacionais IIA/IPPF e o modelo IA-CM. **[Especificação — Visão Estratégica §2.10]**

**RNF-CONF-005.** O sistema deverá observar a ISO 31000 para gestão de riscos. **[Especificação — MOD-RIS-001]**

---

## 11. Auditoria e Rastreabilidade (RNF-AUDI)

**RNF-AUDI-001.** Toda operação relevante (CRUD, transições de status, aprovações, acessos) deverá gerar log auditável com: data/hora, usuário, IP, operação, entidade e identificador. **[Especificação — MOD-ADM-001, MOD-EXE-001, MOD-SIG-001]**

**RNF-AUDI-002.** Logs de auditoria deverão ser imutáveis (append-only). **[Inferido]**

**RNF-AUDI-003.** Logs deverão ser retidos por no mínimo 10 anos, conforme exigência para papéis de trabalho. **[Especificação — MOD-EXE-001, CNJ 309 art. 44]**

**RNF-AUDI-004.** Toda exclusão deverá ser lógica (soft delete). **[Inferido]**

**RNF-AUDI-005.** O sistema deverá manter trilha de decisões (aprovações, rejeições, publicações) vinculada ao objeto e agente decisor. **[Especificação — Módulos]**

---

## 12. Compatibilidade (RNF-COMP)

**RNF-COMP-001.** O sistema deverá suportar navegadores Chrome, Firefox e Edge em suas versões mais recentes. **[Inferido]**

**RNF-COMP-002.** O sistema deverá ser uma aplicação web, sem necessidade de instalação de software cliente. **[Inferido]**

**RNF-COMP-003.** Relatórios e documentos deverão ser exportáveis em PDF e XLSX. **[Especificação — MOD-DSH-001, MOD-REL-001]**

**RNF-COMP-004.** Dados deverão ser disponibilizáveis para consumo por ferramentas de BI corporativas. **[Inferido]**

---

## 13. Resumo por Criticidade

| Criticidade | Quantidade | Categorias |
|-------------|-----------|------------|
| **Alta** | 31 | Performance (5), Disponibilidade (1), Segurança (14), Conformidade (5), Auditoria (5), Interoperabilidade (1) |
| **Média** | 18 | Disponibilidade (6), Escalabilidade (3), Interoperabilidade (5), Usabilidade (1), Manutenibilidade (3) |
| **Baixa** | 11 | Usabilidade (4), Manutenibilidade (3), Compatibilidade (4) |

**Total: 60 RNFs**

---

## 14. Considerações

Os requisitos marcados como **[Inferido]** são baseados em boas práticas de sistemas corporativos do setor público e devem ser validados com a equipe técnica do TJCE. Os marcados como **[Especificação]** são derivados diretamente dos módulos validados no Step 0.5.

---

## Histórico de Revisões

| Versão | Data | Autor | Descrição |
|--------|------|-------|-----------|
| 1.0 | 16/06/2026 | IA (Step 1) | Criação a partir dos módulos (Step 0.5) |
