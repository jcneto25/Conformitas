# ESPECIFICAÇÃO TÉCNICO-FUNCIONAL

# SISTEMA CONFORMITAS

## VOLUME XVII – REQUISITOS NÃO FUNCIONAIS

### Versão 3.0

---

# 1. Objetivo

Este volume consolida os requisitos não funcionais do CONFORMITAS, reunindo especificações de performance, disponibilidade, segurança, escalabilidade, integração, usabilidade, manutenibilidade, conformidade legal, rastreabilidade, compatibilidade e inteligência artificial. Os requisitos foram extraídos dos PRDs, volumes funcionais e especificações formais, complementados com valores de referência onde a documentação original era omissa.

---

# 2. Convenções

| Marca | Significado |
|-------|-------------|
| **[PRD]** | Requisito explicitamente declarado na documentação original |
| **[Inferido]** | Requisito derivado ou com valor de referência sugerido |

Cada requisito possui: ID, descrição, métrica/valor alvo, criticidade (Alta/Média/Baixa) e origem.

---

# 3. Performance (RNF-PERF)

**RNF-PERF-001.** As páginas de listagem deverão carregar em até **2 segundos** para conjuntos de até 1.000 registros. **[Inferido]**

**RNF-PERF-002.** Formulários de cadastro e edição deverão carregar em até **1 segundo**. **[Inferido]**

**RNF-PERF-003.** A geração de relatórios simples deverá ocorrer em até **10 segundos**; relatórios complexos (consolidados anuais, RMA) em até **5 minutos**. **[PRD - Vários volumes]**

**RNF-PERF-004.** Dashboards deverão ser atualizados em até **5 segundos**, com indicadores calculados em tempo real ou near-real-time. **[PRD - Vol. XV/XVII]**

**RNF-PERF-005.** O sistema deverá suportar no mínimo **100 usuários simultâneos**, com pico de **200 usuários** durante períodos de fechamento de plano ou relatórios. **[Inferido]**

**RNF-PERF-006.** O sistema deverá suportar volume de dados equivalente a **10 ou mais exercícios anuais** sem degradação perceptível de performance. **[PRD]**

**RNF-PERF-007.** Upload de arquivos deverá suportar documentos de até **100 MB** por arquivo, com armazenamento total escalável. **[Inferido]**

**RNF-PERF-008.** Busca textual completa deverá retornar resultados em até **2 segundos** em qualquer entidade do sistema. **[Inferido]**

**RNF-PERF-009.** APIs de integração deverão responder em até **2 segundos** por requisição, com throughput de **1.000 requisições/minuto**. **[PRD - Vol. XIII/XVI]**

---

# 4. Disponibilidade e Confiabilidade (RNF-DISP)

**RNF-DISP-001.** O sistema deverá ter disponibilidade mínima de **99,5%** durante horário comercial (8h–20h em dias úteis). **[PRD - Vol. XII/XVII]**

**RNF-DISP-002.** Módulos críticos (execução de auditorias, monitoramento de recomendações) deverão ter disponibilidade de **99,9%**. **[PRD - Vol. XIX]**

**RNF-DISP-003.** Janelas de manutenção deverão ser agendadas fora do horário comercial, com comunicação prévia de no mínimo 24 horas. **[Inferido]**

**RNF-DISP-004.** Backup deverá ser realizado com frequência **diária (incremental)** e **semanal (completa)**, com cópia offsite. **[PRD - Vol. XII]**

**RNF-DISP-005.** O objetivo de tempo de recuperação (RTO) deverá ser inferior a **4 horas**. **[Inferido]**

**RNF-DISP-006.** O objetivo de ponto de recuperação (RPO) deverá ser inferior a **1 hora**. **[Inferido]**

**RNF-DISP-007.** Deverá existir plano de continuidade de negócio (BCP) específico para o sistema, com procedimentos documentados para falhas de infraestrutura, dados e segurança. **[PRD - Vol. XII]**

---

# 5. Segurança da Informação (RNF-SEGF)

**RNF-SEGF-001.** O sistema deverá suportar autenticação via **LDAP/AD** institucional e **SSO** (SAML 2.0 ou OIDC). **[PRD]**

**RNF-SEGF-002.** Login local deverá ser permitido **apenas para contingência**, devidamente parametrizado e auditado. **[PRD]**

**RNF-SEGF-003.** **MFA** deverá ser obrigatório para perfis críticos (Administrador, Secretário, Coordenador, Presidência). **[PRD]**

**RNF-SEGF-004.** O controle de acesso deverá ser híbrido **RBAC + ABAC**, com restrições contextuais por unidade, participação na auditoria, nível de sigilo e papel no processo. **[PRD]**

**RNF-SEGF-005.** O sistema deverá garantir **segregação de funções**, impedindo: auditor aprovar próprio trabalho, autor aprovar próprio relatório, avaliador avaliar própria execução. **[PRD]**

**RNF-SEGF-006.** O sistema deverá classificar informações em níveis: **público, restrito, confidencial e sigiloso**. **[PRD - Vol. XIV]**

**RNF-SEGF-007.** A comunicação deverá utilizar **TLS 1.3** ou superior para todas as conexões. **[PRD - Vol. XII]**

**RNF-SEGF-008.** Dados sensíveis deverão ser criptografados em repouso com **AES-256** ou equivalente. **[PRD - Vol. XII]**

**RNF-SEGF-009.** O sistema deverá seguir as diretrizes **OWASP ASVS** para desenvolvimento seguro. **[Inferido]**

**RNF-SEGF-010.** O sistema deverá observar **ISO 27001** como referencial de gestão de segurança da informação. **[PRD - Vol. XII]**

**RNF-SEGF-011.** Senhas, quando utilizadas (contingência), deverão seguir política de complexidade institucional, com expiração e histórico. **[Inferido]**

**RNF-SEGF-012.** Sessões deverão ter timeout configurável (padrão: **30 minutos de inatividade**), com renovação segura. **[Inferido]**

**RNF-SEGF-013.** O sistema deverá proteger-se contra as principais vulnerabilidades do **OWASP Top 10**. **[Inferido]**

**RNF-SEGF-014.** Deverá existir controle de acesso baseado em **IP/rede** para funções administrativas. **[Inferido]**

**RNF-SEGF-015.** Integrações com sistemas externos deverão utilizar autenticação mútua (mTLS) ou tokens JWT com rotação. **[Inferido]**

---

# 6. Escalabilidade (RNF-ESCA)

**RNF-ESCA-001.** A arquitetura deverá suportar **escalonamento horizontal** dos serviços de aplicação. **[PRD - Vol. XVII/XIX]**

**RNF-ESCA-002.** O banco de dados deverá suportar estratégias de escalabilidade (read replicas, partitioning, connection pooling). **[Inferido]**

**RNF-ESCA-003.** O armazenamento de arquivos deverá ser escalável independentemente do banco de dados relacional (object storage ou equivalente). **[Inferido]**

---

# 7. Interoperabilidade e Integração (RNF-INTE)

**RNF-INTE-001.** O sistema deverá adotar **arquitetura orientada a serviços e APIs RESTful**, com documentação OpenAPI 3.x. **[PRD]**

**RNF-INTE-002.** Deverá integrar-se com **LDAP/AD** ou **SSO** institucional para autenticação. **[PRD]**

**RNF-INTE-003.** Deverá integrar-se com sistemas corporativos de **RH** (dados funcionais, férias, licenças). **[PRD]**

**RNF-INTE-004.** Deverá integrar-se com sistemas **financeiros** (dados orçamentários, pagamentos). **[PRD]**

**RNF-INTE-005.** Deverá integrar-se com plataformas de **assinatura eletrônica** (ICP-Brasil). **[PRD]**

**RNF-INTE-006.** Deverá integrar-se com ferramentas de **BI** (Power BI, Metabase ou equivalente) para alimentação de dados analíticos. **[PRD]**

**RNF-INTE-007.** Deverá suportar integração com sistemas de **processos** (bases de processos institucionais). **[PRD]**

**RNF-INTE-008.** Integrações assíncronas deverão utilizar filas mensageiras (ex.: RabbitMQ, Kafka) para desacoplamento. **[Inferido]**

**RNF-INTE-009.** Cada integração deverá possuir SLA individual, com monitoramento de disponibilidade e latência. **[Inferido]**

**RNF-INTE-010.** O sistema deverá disponibilizar **webhooks** para notificação de eventos relevantes a sistemas externos. **[Inferido]**

---

# 8. Usabilidade e Acessibilidade (RNF-USAB)

**RNF-USAB-001.** A interface deverá seguir o **e-MAG** (Modelo de Acessibilidade em Governo Eletrônico) e **WCAG 2.1 nível AA**. **[PRD]**

**RNF-USAB-002.** A interface deverá ser **responsiva**, adaptando-se a diferentes resoluções de tela. **[Inferido]**

**RNF-USAB-003.** O idioma padrão deverá ser **português brasileiro (PT-BR)**. **[PRD]**

**RNF-USAB-004.** A navegação deverá ser orientada por **processo**, com fluxos distintos para planejamento, execução, resultados, monitoramento e administração. **[PRD]**

**RNF-USAB-005.** Campos obrigatórios deverão ser visualmente identificados, com mensagens de validação claras. **[Inferido]**

**RNF-USAB-006.** O sistema deverá disponibilizar sistema de **notificações e alertas** por perfil, com indicadores visuais de ações pendentes. **[PRD]**

**RNF-USAB-007.** A interface deverá seguir **padrão visual institucional** do Tribunal. **[PRD]**

---

# 9. Manutenibilidade (RNF-MANU)

**RNF-MANU-001.** O sistema deverá adotar **arquitetura modular**, com módulos independentes e interfaces bem definidas. **[PRD]**

**RNF-MANU-002.** O design deverá ser **API-first**, com todas as funcionalidades acessíveis via API documentada. **[Inferido]**

**RNF-MANU-003.** O sistema deverá manter **versionamento nativo** dos objetos versionáveis (PALP, PAA, programas, papéis, relatórios, planos de ação). **[PRD]**

**RNF-MANU-004.** Deverá existir **segregação de ambientes** (desenvolvimento, homologação, produção) com processos formais de promoção. **[Inferido]**

**RNF-MANU-005.** A cobertura de testes automatizados deverá ser de no mínimo **80%** para lógica de negócio crítica. **[Inferido]**

**RNF-MANU-006.** Parâmetros de configuração (tipos de auditoria, status, templates, fluxos) deverão ser **parametrizáveis sem alteração de código**. **[PRD]**

---

# 10. Conformidade Legal e Normativa (RNF-CONF)

**RNF-CONF-001.** O sistema deverá observar a **LGPD** (Lei nº 13.709/2018) para tratamento de dados pessoais. **[PRD]**

**RNF-CONF-002.** O sistema deverá estar aderente às **Resoluções CNJ** aplicáveis (309/2020, 332/2020, 370/2021, 396/2021). **[PRD]**

**RNF-CONF-003.** O sistema deverá observar a **Lei de Acesso à Informação** (Lei nº 12.527/2011) para classificação e disponibilização de informações. **[PRD]**

**RNF-CONF-004.** O sistema deverá seguir as **Normas Globais de Auditoria Interna** do IIA, o modelo **IA-CM** e o referencial **COSO**. **[PRD]**

**RNF-CONF-005.** O sistema deverá observar as **políticas institucionais** de segurança da informação, gestão de riscos e governança do Tribunal. **[PRD]**

---

# 11. Auditoria e Rastreabilidade (RNF-AUDI)

**RNF-AUDI-001.** Toda operação relevante deverá gerar **log auditável** contendo: data/hora, usuário, IP de origem, operação realizada, entidade e identificador do registro. **[PRD]**

**RNF-AUDI-002.** Logs de auditoria deverão ser **imutáveis e permanentes** (política WORM — Write Once Read Many). **[PRD - Vol. XII]**

**RNF-AUDI-003.** Logs deverão ser retidos por no mínimo **10 anos**, conforme requisitos institucionais e normativos. **[Inferido]**

**RNF-AUDI-004.** Toda exclusão deverá ser **lógica** (soft delete), sem remoção física de registros relevantes. **[PRD]**

**RNF-AUDI-005.** O sistema deverá manter **trilha de decisões** (aprovações, rejeições, publicações, encerramentos) vinculada ao respectivo objeto e ao agente decisor. **[PRD]**

---

# 12. Compatibilidade (RNF-COMP)

**RNF-COMP-001.** O sistema deverá suportar os navegadores **Chrome, Firefox e Edge** em suas versões mais recentes. **[Inferido]**

**RNF-COMP-002.** O sistema deverá ser uma **aplicação web**, sem necessidade de instalação de software cliente. **[PRD]**

**RNF-COMP-003.** Relatórios e documentos deverão ser exportáveis em **PDF, DOCX, XLSX e HTML**. **[PRD]**

**RNF-COMP-004.** Dados deverão ser disponibilizáveis para consumo por ferramentas de **BI** corporativas. **[PRD]**

**RNF-COMP-005.** O sistema deverá suportar **publicação em portal institucional** para documentos públicos. **[PRD]**

---

# 13. Inteligência Artificial (RNF-IART)

**RNF-IART-001.** Consultas baseadas em **RAG** (Retrieval-Augmented Generation) deverão responder em até **10 segundos**. **[PRD - Vol. XVI]**

**RNF-IART-002.** O sistema deverá suportar **múltiplos provedores de LLM**, com abstração de infraestrutura. **[PRD - Vol. XVI]**

**RNF-IART-003.** Modelos de IA deverão poder operar **on-premises** para dados sigilosos. **[PRD - Vol. XVI]**

**RNF-IART-004.** O banco de dados vetorial deverá escalar para **milhões de documentos** indexados. **[Inferido]**

**RNF-IART-005.** Classificações e sugestões geradas por IA deverão ser passíveis de **revisão humana** (human-in-the-loop). **[PRD]**

**RNF-IART-006.** O sistema deverá fornecer **explicabilidade (XAI)** para decisões automatizadas. **[Inferido]**

**RNF-IART-007.** O uso de IA deverá observar as **Resoluções CNJ sobre IA** no Poder Judiciário. **[PRD]**

---

# 14. Resumo por Criticidade

| Criticidade | Quantidade | Categorias |
|-------------|-----------|------------|
| **Alta** | 45+ | Segurança, Disponibilidade, Auditoria, Conformidade Legal |
| **Média** | 25+ | Performance, Integração, Escalabilidade |
| **Baixa** | 10+ | Usabilidade, Compatibilidade, IA |

---

# 15. Considerações

Os requisitos marcados como **[Inferido]** são sugestões baseadas em boas práticas de sistemas corporativos do setor público brasileiro. Devem ser validados com a equipe técnica do Tribunal antes da implementação. Os requisitos marcados como **[PRD]** são derivados diretamente da documentação funcional existente.
