# Camada de Dados Mockados — CONFORMITAS 3.0

## Estrutura
```
mocks/
├── data/
│   ├── users.json                        # 16 usuários — 10 perfis (P01-P10)
│   ├── perfis_configuracoes.json         # 10 perfis + 7 configurações do sistema
│   ├── universo_auditavel.json           # 12 áreas/processos/temas
│   ├── planos_auditoria.json             # 3 planos, 6 itens, 4 força de trabalho
│   ├── auditorias_execucao.json          # 4 auditorias, 7 evidências, 4 papéis, 3 requisições
│   ├── achados_relatorios_recomendacoes.json  # 4 achados, 2 manifestações, 2 relatórios, 4 recomendações, 2 providências
│   ├── etica_sigilo.json                 # 3 declarações, 1 impedimento, 2 classificações sigilo
│   └── consultorias_qualidade_riscos.json # 2 consultorias, 2 riscos, 2 capacitações, 2 avaliações, 1 NC
├── handlers/
│   ├── auth.ts                           # Login, MFA, refresh, logout, me
│   └── crud.ts                           # CRUD genérico para todas as entidades
├── browser.ts                            # Setup MSW browser
├── server.ts                             # Setup MSW server (testes)
└── README.md                             # Este arquivo
```

## Usuários por Perfil

| Perfil | Nome | Email | Senha |
|--------|------|-------|-------|
| P01 | Rômulo Pinheiro Ribeiro | romulo.ribeiro@mvp.local | 123456 |
| P02 | Carlos André Melo Pontes | carlos.pontes@mvp.local | 123456 |
| P02 | Karla Caldas Borges | karla.borges@mvp.local | 123456 |
| P02 | Juliana Alencar Alves | juliana.alves@mvp.local | 123456 |
| P02 | Lídia Maria Mendes dos Santos | lidia.santos@mvp.local | 123456 |
| P03 | Des. Maria Nailde Pinheiro Nogueira | presidencia@mvp.local | 123456 |
| P04 | Conselho da Magistratura | colegiado@mvp.local | 123456 |
| P05 | Fernando Gestor (Finanças) | gestor.financas@mvp.local | 123456 |
| P05 | Ana Gestora (Pessoas) | gestora.pessoas@mvp.local | 123456 |
| P05 | Ricardo Gestor (TI) | gestor.ti@mvp.local | 123456 |
| P05 | Paulo Gestor (Administração) | gestor.administracao@mvp.local | 123456 |
| P06 | Marcos Núcleo Controle Interno | nucleo.controle@mvp.local | 123456 |
| P07 | Avaliador Externo TJBA | avaliador.externo@mvp.local | 123456 |
| P08 | Comitê SIAUD-Jud | comite.siaud@mvp.local | 123456 |
| P09 | Conselheiro CNJ — CPA | cpa.cnj@mvp.local | 123456 |
| P10 | Admin do Sistema | admin.sistema@mvp.local | 123456 |

## Estados Cobertos por Entidade

- **Auditorias:** ABERTA, EM_EXECUCAO, CONCLUIDA
- **Planos:** APROVADO, PUBLICADO
- **Achados:** PRELIMINAR, EM_MANIFESTACAO, CONSOLIDADO
- **Recomendações:** PENDENTE, EM_ANDAMENTO, CUMPRIDA
- **Riscos:** ATIVO, EM_TRATAMENTO
- **Avaliações:** CONCLUIDA, HOMOLOGADA
- **NC:** CORRIGIDA

Total: 8 arquivos JSON, 7 entidades principais, 10 perfis cobertos.
