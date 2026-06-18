A seguir apresento uma **versão formal do documento de requisitos, com requisitos enumerados (RF, RN e RNF)**, derivada dos PRDs consolidados e dos volumes funcionais analisados, seguida de uma **comparação com o documento de requisitos da versão inicial do sistema** para validar sua completude. A base comparativa considera que o documento inicial de 2014/2015 traz **apenas requisitos não funcionais explícitos**, remetendo os requisitos funcionais ao “documento de visão”, ao passo que a documentação atual detalha de forma extensiva os módulos de negócio, regras de negócio, fluxos e critérios de aceitação. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

***

# Especificação Formal de Requisitos – CONFORMITAS

## 1. Finalidade

**RQ-001.** Este documento especifica, em formato formal e enumerado, os requisitos funcionais, regras de negócio e requisitos não funcionais do CONFORMITAS, sistema corporativo destinado à gestão integrada do ciclo completo da Auditoria Interna, desde o planejamento estratégico e operacional até o monitoramento da efetividade das recomendações. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RQ-002.** O sistema deverá atender à visão de plataforma corporativa integrada de Auditoria Interna, Gestão de Riscos, Controle Interno, Monitoramento, Governança e Qualidade, substituindo controles paralelos e suportando rastreabilidade, segurança e geração de valor institucional. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

***

## 2. Escopo Geral

**RQ-003.** O CONFORMITAS deverá abranger, no mínimo, os seguintes domínios funcionais: Planejamento Estratégico e Operacional, Execução das Auditorias, Achados e Resultados, Relatórios e Monitoramento, Gestão de Riscos da AUDIN, Segurança e Administração, além de Indicadores, Dashboards e suporte a Qualidade/IA-CM/PQAUD. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RQ-004.** O ciclo macro do sistema deverá contemplar a seguinte sequência de valor: universo auditável → risco → priorização → PALP/PAA → auditoria → achados → relatório → monitoramento → efetividade → retroalimentação do risco e do planejamento. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

***

# 3. Requisitos Funcionais (RF)

## 3.1. Segurança, Administração e Governança de Usuários

**RF-ADM-001.** O sistema deverá suportar autenticação institucional por LDAP/AD e SSO, com login local apenas para contingência. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-ADM-002.** O sistema deverá utilizar controle híbrido de acesso, combinando RBAC para perfis e ABAC para restrições contextuais por unidade, participação, sigilo e papel no processo. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-ADM-003.** O sistema deverá permitir o cadastro, atualização, inativação e bloqueio de usuários, com vínculo à unidade organizacional, cargo, e-mail institucional e status funcional. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-ADM-004.** O sistema deverá suportar perfis de acesso, no mínimo, para Administrador do Sistema, Secretário de Auditoria, Coordenador, Supervisor, Auditor Líder, Auditor, Especialista, Presidência, Unidade Auditada, Avaliador Externo e Comitê de Riscos. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RF-ADM-005.** O sistema deverá suportar delegações temporárias e substituições formais de atribuições, com identificação de delegante, delegado, início, fim e justificativa. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-ADM-006.** O sistema deverá aplicar segregação de funções, impedindo ao menos que o autor aprove o próprio trabalho, o auditor aprove o próprio papel de trabalho e o avaliador avalie sua própria execução. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RF-ADM-007.** O sistema deverá classificar informações e documentos nos níveis público, restrito, confidencial e sigiloso. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-ADM-008.** O sistema deverá registrar trilha de auditoria para autenticação, inclusões, alterações, exclusões lógicas, aprovações, publicações e encerramentos. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

***

## 3.2. Cadastros Estruturantes e Base Metodológica

**RF-CAD-001.** O sistema deverá manter o cadastro do universo auditável, contemplando objetos como processos, sistemas, projetos, contratações, programas, unidades organizacionais e temas estratégicos. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-CAD-002.** O sistema deverá suportar, no mínimo, a hierarquia Macroprocesso → Grupo de Processo → Processo → Subprocesso. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-CAD-003.** O sistema deverá permitir o cadastro de objetivos estratégicos e sua vinculação aos processos e auditorias. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RF-CAD-004.** O sistema deverá manter banco de questões de auditoria, classificadas por assunto, critério, metodologia, risco, objetos e fontes de informação. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-CAD-005.** O sistema deverá manter banco de procedimentos, com objetivo, critério, descrição, responsável, prazo e evidência esperada. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RF-CAD-006.** O sistema deverá permitir parametrização de tipos de auditoria, tipos de risco, tipos de achado, tipos de evidência, tipos de consultoria, tipos de comunicação e calendários institucionais. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-CAD-007.** O sistema deverá suportar templates e modelos documentais parametrizáveis para PAA, PALP, relatórios, comunicações preliminares, pareceres, notas técnicas e RMA. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

***

## 3.3. Planejamento Estratégico e Operacional

**RF-PLN-001.** O sistema deverá permitir a elaboração e gestão do PALP com horizonte plurianual e workflow de rascunho, revisão técnica, aprovação AUDIN, aprovação da Presidência e publicação. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-PLN-002.** O sistema deverá permitir a elaboração e gestão do PAA, incluindo versionamento, aprovação, publicação e controle de alterações formais. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-PLN-003.** O sistema deverá incluir automaticamente no PAA as auditorias mandatórias decorrentes de obrigações normativas, monitoramentos pendentes, ACA e demais demandas institucionais parametrizadas. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-PLN-004.** O sistema deverá manter matriz de priorização com cálculo objetivo baseado em materialidade, relevância, criticidade e risco. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-PLN-005.** O sistema deverá permitir aplicação do QACI por blocos, com cálculo do índice de controle interno e classificação do resultado. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-PLN-006.** O sistema deverá calcular a capacidade operacional anual da AUDIN, considerando auditores, dias úteis, férias, licenças, capacitações, reservas e alocações obrigatórias. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-PLN-007.** O sistema deverá permitir simulação de cenários de planejamento, incluindo inclusão e exclusão de auditorias, alteração de recursos e alteração de prazos. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-PLN-008.** O sistema deverá sugerir distribuição automática de carga considerando disponibilidade, especialidade, experiência, independência e conflitos de interesse. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RF-PLN-009.** O sistema deverá calcular indicadores de cobertura do PALP e do universo auditável. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

***

## 3.4. Gestão de Riscos da AUDIN

**RF-RSK-001.** O sistema deverá manter cadastro estruturado de riscos da auditoria, com descrição, causa, consequência, categoria, tipo, objeto auditável e unidade responsável. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-RSK-002.** O sistema deverá permitir avaliação do risco com base em probabilidade, impacto, velocidade, vulnerabilidade e detectabilidade. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-RSK-003.** O sistema deverá registrar controles internos associados aos riscos, com tipo e efetividade. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-RSK-004.** O sistema deverá calcular e classificar risco inerente e risco residual. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-RSK-005.** O sistema deverá gerar matriz de riscos e mapa de calor (heatmap), com filtros por unidade, processo, categoria e exercício. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-RSK-006.** O sistema deverá permitir definição de apetite de risco da AUDIN e utilizar tal parâmetro na priorização do PAA e no monitoramento. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-RSK-007.** O sistema deverá identificar riscos emergentes e alertar quando não houver cobertura pelo planejamento vigente. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-RSK-008.** O sistema deverá permitir que auditorias consultem, atualizem ou registrem riscos e vinculem achados a riscos existentes ou novos riscos. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

***

## 3.5. Execução das Auditorias

**RF-EXE-001.** O sistema deverá permitir o cadastro e a abertura de auditorias de conformidade, operacional, financeira, TI, integrada, coordenada e extraordinária. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RF-EXE-002.** O sistema deverá controlar os estados da auditoria, no mínimo: planejada, iniciada, planejamento, execução, supervisão, relatório, monitoramento e encerrada. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RF-EXE-003.** O sistema deverá formalizar a designação da equipe da auditoria, contendo Auditor Líder, Auditores, Especialista, Supervisor e, quando aplicável, Revisor de Qualidade. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RF-EXE-004.** O sistema deverá exigir declaração eletrônica de independência e conflito de interesse antes da atuação no trabalho. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RF-EXE-005.** O sistema deverá permitir elaboração do planejamento específico da auditoria, contemplando objeto, objetivos, escopo, critérios, questões, riscos, metodologia, cronograma e equipe. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RF-EXE-006.** O sistema deverá permitir a construção e aprovação de matriz de planejamento. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-EXE-007.** O sistema deverá permitir a criação, versionamento e gestão de programa de auditoria. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RF-EXE-008.** O sistema deverá gerenciar solicitações de informação às unidades auditadas, com emissão, resposta, validação, anexos e controle de prazo. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RF-EXE-009.** O sistema deverá cadastrar e gerir evidências por tipo, origem, responsável e data de coleta. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RF-EXE-010.** O sistema deverá manter papéis de trabalho eletrônicos vinculados a procedimentos, evidências, conclusão e revisão. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RF-EXE-011.** O sistema deverá registrar entrevistas e reuniões com ata, participantes, unidade, local, data e assinatura eletrônica quando aplicável. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RF-EXE-012.** O sistema deverá permitir o registro de plano amostral com método, critério, quantidade e justificativa técnica. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RF-EXE-013.** O sistema deverá registrar execução de testes de observância, substantivos, analíticos e de conformidade. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RF-EXE-014.** O sistema deverá suportar supervisão técnica da execução, com revisão de planejamento, papéis, evidências, conclusões e achados. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RF-EXE-015.** O sistema deverá controlar o encerramento da execução por checklist obrigatório. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

***

## 3.6. Achados, Resultados e Contraditório

**RF-ACH-001.** O sistema deverá permitir o registro formal de achados de auditoria. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-ACH-002.** Todo achado deverá conter obrigatoriamente critério, condição, causa, efeito, evidência, risco, conclusão e recomendação. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-ACH-003.** O sistema deverá classificar achados por categoria, natureza, materialidade, relevância e criticidade. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-ACH-004.** O sistema deverá impedir a consolidação de achado sem evidência vinculada. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-ACH-005.** O sistema deverá permitir o vínculo do achado a riscos institucionais e ao módulo de gestão de riscos. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-ACH-006.** O sistema deverá permitir o registro de recomendações com prioridade, descrição, benefício esperado, prazo sugerido e responsável sugerido. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-ACH-007.** O sistema deverá permitir o registro de determinações com autoridade emissora, origem, fundamentação, responsável e prazo. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-ACH-008.** O sistema deverá permitir o registro de benefícios financeiros e não financeiros associados aos resultados da auditoria. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-ACH-009.** O sistema deverá encaminhar achados validados à unidade auditada para contraditório eletrônico antes do relatório final, salvo exceções justificadas. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-ACH-010.** O sistema deverá registrar a análise e a decisão da auditoria sobre as manifestações da unidade auditada. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-ACH-011.** O sistema deverá gerar automaticamente quadro de resultados, incluindo achados, riscos, recomendações, responsáveis, prazos e status. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-ACH-012.** O sistema deverá identificar automaticamente reincidência de problemas por unidade, processo, risco, controle e causa. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

***

## 3.7. Relatórios, Comunicação e Publicação

**RF-REL-001.** O sistema deverá emitir, no mínimo, comunicação preliminar, relatório de auditoria, relatório executivo, nota técnica, parecer e memorando. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-REL-002.** O sistema deverá montar automaticamente o relatório de auditoria com estrutura padronizada e anexos referenciados. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-REL-003.** O sistema deverá suportar múltiplos templates de relatório por tipo de auditoria ou consultoria. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-REL-004.** O sistema deverá implementar fluxo de relatório com, no mínimo, rascunho, revisão técnica, supervisão, aprovação AUDIN, ciência da unidade e publicação. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-REL-005.** O sistema deverá suportar assinatura eletrônica institucional e integração com assinador corporativo. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-REL-006.** O sistema deverá controlar publicação interna, restrita, pública ou sigilosa conforme perfil, classificação da informação, unidade e papel na auditoria. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

***

## 3.8. Monitoramento, Planos de Ação e Efetividade

**RF-MON-001.** O sistema deverá manter cadastro de recomendações em monitoramento, contendo código, achado, descrição, prioridade, responsável, unidade, prazo e status. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-MON-002.** O sistema deverá manter gestão de determinações com monitoramento obrigatório. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-MON-003.** O sistema deverá permitir à unidade auditada registrar plano de ação com ação, responsável, prazo, recursos necessários, indicador e evidência prevista. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-MON-004.** O sistema deverá permitir workflow do plano de ação: elaboração, análise AUDIN, aprovação, execução e validação. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-MON-005.** O sistema deverá suportar monitoramento periódico, contínuo e extraordinário. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-MON-006.** O sistema deverá manter os status de implementação e sua evolução histórica. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-MON-007.** O sistema deverá registrar avaliação de implementação baseada em evidências, consistência e abrangência. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-MON-008.** O sistema deverá registrar avaliação de efetividade baseada na mitigação do risco, no controle implantado, na melhoria do processo e no benefício obtido. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-MON-009.** O sistema deverá gerar automaticamente o Relatório de Monitoramento de Auditoria (RMA), com quadros, estatísticas, gráficos e indicadores. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-MON-010.** O sistema deverá impedir o encerramento de recomendação sem validação e, quando a metodologia o exigir, sem avaliação de efetividade. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-MON-011.** O sistema deverá permitir reabertura de recomendação encerrada com justificativa formal. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-MON-012.** O sistema deverá manter histórico anual de benefícios implementados. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

***

## 3.9. Indicadores, Qualidade, Dashboards e Analytics

**RF-BI-001.** O sistema deverá disponibilizar dashboards operacionais, executivos e estratégicos para planejamento, execução, achados, monitoramento e riscos. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-BI-002.** O sistema deverá calcular, no mínimo, os seguintes indicadores institucionais: cobertura do PALP, cobertura do universo auditável, taxa de implementação, taxa de implementação tempestiva, taxa de efetividade, índices de risco e indicadores de qualidade. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-BI-003.** O sistema deverá alimentar automaticamente o PQAUD e suportar avaliação de maturidade IA-CM. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RF-BI-004.** O sistema deverá destacar recomendações críticas vencidas, determinações vencidas, riscos críticos e reincidências nos dashboards executivos. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RF-BI-005.** O sistema deverá disponibilizar base estruturada para integração com BI e análises futuras baseadas em IA. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

***

# 4. Regras de Negócio (RN)

**RN-001.** Toda auditoria deverá estar vinculada a um processo ou objeto do universo auditável. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RN-002.** Toda auditoria deverá possuir risco associado. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RN-003.** Nenhum PAA poderá exceder a capacidade operacional disponível. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RN-004.** Toda alteração do PAA deverá possuir justificativa formal e histórico. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RN-005.** Todo trabalho deverá possuir Auditor Líder e Supervisor designados. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RN-006.** O sistema deverá validar conflito de interesse antes da designação. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RN-007.** Toda auditoria deverá possuir planejamento específico aprovado antes da execução. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

**RN-008.** Toda conclusão deverá possuir evidência associada. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RN-009.** Nenhum papel de trabalho poderá ser aprovado pelo próprio autor. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RN-010.** Todo achado deverá possuir critério, condição, causa e efeito, além de risco e evidência associada. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RN-011.** Todo achado deverá passar por contraditório antes do relatório final, salvo exceção formalmente justificada. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RN-012.** Toda recomendação deverá estar vinculada a um único achado. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RN-013.** Não será permitido excluir achados consolidados. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RN-014.** Não será permitido encerrar recomendação sem validação. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RN-015.** Não será permitido encerrar recomendação sem avaliação de efetividade quando exigida pela metodologia institucional. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RN-016.** Toda determinação deverá possuir monitoramento obrigatório. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RN-017.** Riscos críticos deverão gerar alertas automáticos. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RN-018.** Toda exclusão deverá ser lógica. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RN-019.** Nenhuma versão histórica poderá ser removida. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RN-020.** Toda operação sensível deverá ser auditável, permanente e imutável. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

***

# 5. Requisitos Não Funcionais (RNF)

## 5.1. Plataforma e Arquitetura

**RNF-001.** O sistema deverá ser uma aplicação web corporativa, acessível ao menos via intranet institucional e passível de disponibilização controlada a usuários externos autorizados. A versão inicial já exigia ambiente web acessível via intranet. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RNF-002.** O sistema deverá seguir padrões institucionais de interface e identidade visual do Tribunal. A versão inicial já exigia aderência ao padrão do TJCE. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RNF-003.** O sistema deverá estar disponível no idioma português. A versão inicial também explicitava idioma português. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RNF-004.** O sistema deverá suportar exportação de relatórios, no mínimo, em PDF e formato editável/planilhável compatível com o uso institucional. A versão inicial determinava PDF ou ODF e exportação para planilha. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RNF-005.** O sistema deverá adotar arquitetura compatível com integração por serviços/APIs e com manutenção evolutiva, substituindo a amarração estrita a tecnologias legadas específicas do documento inicial. O documento inicial impunha MVC, J2EE e JAAS, refletindo uma base tecnológica da época. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

## 5.2. Segurança e Acesso

**RNF-006.** O sistema deverá suportar autenticação via diretório institucional e/ou SSO corporativo. O documento inicial exigia autenticação com SAA/LDAP e JAAS. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RNF-007.** O sistema deverá aplicar política de senhas ou autenticação forte compatível com as diretrizes de segurança do Tribunal, inclusive MFA para perfis críticos. O documento inicial previa compatibilidade com a política de senhas do TJCE. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RNF-008.** O sistema deverá permitir auditoria detalhada das ações, registrando usuário, data/hora, operação, entidade afetada e, quando aplicável, valor anterior e posterior. O documento inicial já exigia essa capacidade de auditoria. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RNF-009.** O sistema deverá garantir que logs e registros históricos não possam ser alterados por usuários comuns ou removidos logicamente sem controle institucional apropriado. A imutabilidade do histórico decorre da atual especificação de versionamento e trilhas permanentes. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

## 5.3. Confiabilidade, Usabilidade e Acessibilidade

**RNF-010.** O sistema deverá tratar exceções e recuperar-se de falhas sem perda de dados. O documento inicial já previa esse requisito. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RNF-011.** O sistema deverá exibir identificação do usuário logado e tempo de sessão. O documento inicial já estabelecia essa exigência. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RNF-012.** O sistema deverá observar acessibilidade conforme diretrizes governamentais aplicáveis, mantendo aderência ao e-MAG como referência mínima, conforme previsto na versão inicial. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RNF-013.** O sistema deverá sinalizar campos obrigatórios e parametrizar paginação de consultas. O documento inicial já previa tais requisitos de usabilidade. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

**RNF-014.** O sistema deverá garantir descrição adequada para elementos não textuais e, sempre que possível, oferecer mecanismos de acessibilidade orientados ao perfil do usuário. A versão inicial já exigia descrição explicativa para elementos não textuais. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

## 5.4. Interoperabilidade e Portabilidade

**RNF-015.** O sistema deverá integrar-se a sistemas corporativos de autenticação, RH e demais fontes institucionais relevantes para planejamento, execução e risco. O documento inicial já exigia, ao menos, integração com SAA/LDAP e SIRH. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

**RNF-016.** O sistema deverá ser compatível com navegadores corporativos contemporâneos suportados pela infraestrutura institucional. O documento inicial fixava versões específicas e hoje obsoletas de IE/Firefox/Chrome. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

***

# 6. Comparação com o Documento de Requisitos da Versão Inicial

## 6.1. Diagnóstico Geral de Completude

O documento inicial de requisitos do CONFORMITAS, versões 1.0.0 a 1.0.9, é **estruturalmente incompleto do ponto de vista funcional**, pois declara explicitamente que os “Requisitos Funcionais” devem ser obtidos em outro documento (“Vide documento de Visão”), deixando no próprio PDF apenas os requisitos não funcionais suplementares. Portanto, ele **não funciona, sozinho, como especificação funcional completa do sistema**. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

Já a especificação atual, decomposta em volumes por domínio, descreve **completamente o comportamento de negócio do sistema**, incluindo entidades, workflows, regras de negócio, critérios de aceitação, integrações e indicadores para planejamento, execução, achados, relatórios, monitoramento e riscos. Sob esse aspecto, a nova versão formal aqui proposta é **substancialmente mais completa e rastreável** do que a especificação inicial. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

## 6.2. Cobertura dos Não Funcionais da Versão Inicial

A maior parte dos requisitos não funcionais do documento inicial foi **mantida, absorvida ou atualizada** na versão formal proposta. Isso inclui ambiente web/intranet, exportação de relatórios, conformidade visual institucional, idioma português, auditoria de operações, autenticação institucional, integração com cadastro de usuários, acessibilidade e controles de usabilidade. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

Há, contudo, requisitos do documento inicial que devem ser considerados **tecnicamente superados** ou **excessivamente prescritivos para a realidade atual**, como a exigência estrita de arquitetura MVC, uso de J2EE/JAAS e suportes específicos a versões antigas de Internet Explorer e Firefox. Na validação de completude, tais itens não são ignorados, mas **reinterpretados em nível de requisito arquitetural mais atual e tecnológico neutro**, preservando a intenção original de segurança, padronização, interoperabilidade e manutenção. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

## 6.3. Ampliações Relevantes da Especificação Atual

A nova especificação formal acrescenta capacidades que **não estavam explicitadas** no documento inicial, tais como: universo auditável estruturado, objetivos estratégicos, QACI, capacidade operacional, simulação de cenários, gestão de riscos da AUDIN, risco inerente/residual, heatmap, apetite de risco, declaração de independência, gestão de papéis de trabalho, gestão robusta de evidências, contraditório eletrônico, avaliação de implementação, avaliação de efetividade, reabertura de recomendações, PQAUD, IA-CM e dashboards estratégicos. Esses itens representam avanço substantivo de maturidade funcional e metodológica. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md)

## 6.4. Itens Herdados do CONFORMITAS Clássico que Permanecem Cobertos

As funcionalidades nucleares do “CONFORMITAS clássico” permanecem cobertas na versão atual, embora reorganizadas e expandidas: ordem de serviço/cadastro da auditoria, matriz de planejamento, banco de questões, banco de procedimentos, evidências, requisição de informações, manifestação sobre achados, relatório e monitoramento. Assim, a nova versão **não perde aderência ao sistema original**, mas o reposiciona dentro de uma plataforma corporativa de auditoria baseada em risco. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

***

# 7. Validação Final de Completude

## Conclusão

A versão formal enumerada acima pode ser considerada **completa em relação ao documento inicial**, pelas seguintes razões:

1. **Recupera e incorpora os requisitos não funcionais explicitamente documentados na versão inicial**, com atualização tecnológica quando necessária. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)
2. **Supre a lacuna funcional do documento inicial**, que remetia os requisitos funcionais ao documento de visão e não os detalhava no PDF analisado. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)
3. **Cobre integralmente os módulos de negócio presentes na documentação funcional 3.0**, incluindo planejamento, execução, resultados, monitoramento, riscos, segurança e analytics. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)
4. **Evolui metodologicamente o sistema**, alinhando-o a uma abordagem formal de Auditoria Interna baseada em riscos, evidência, contraditório, efetividade e governança. [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf)

### Parecer de validação

**Parecer:** a especificação formal proposta é **mais abrangente, mais consistente e mais apta a servir como base de desenvolvimento, contratação e governança do produto** do que o documento inicial isolado. O documento inicial permanece útil como **referência histórica de RNFs e de restrições tecnológicas da época**, mas **não é suficiente, por si só, para especificar a solução atual**. [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/VOLUME%20VI%20%E2%80%93%20RELAT%C3%93RIOS%20E%20MONITORAMENTO.md), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[RQ_Especif...Requisitos \| PDF\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/RQ_Especifica%C3%A7%C3%A3o_de_Requisitos.pdf), [\[tjce365-my...epoint.com\]](https://tjce365-my.sharepoint.com/personal/9434_tjce_jus_br/Documents/Arquivos%20de%20Chat%20do%20Microsoft%20Copilot/CONFORMITAS_PRD.md)

***

Se você quiser, eu posso fazer o próximo passo de uma destas formas:

1. **Transformar essa versão formal em um documento de requisitos com numeração hierárquica pronta para Word/SEI** (ex.: 3.1 RF-PLN-001 etc.);
2. **Gerar uma matriz de rastreabilidade**: requisito novo × volume fonte × requisito inicial;
3. **Apontar lacunas remanescentes** para contratação/desenvolvimento;
4. **Converter isso em planilha** (RF/RN/RNF, prioridade, fonte, status, módulo).
