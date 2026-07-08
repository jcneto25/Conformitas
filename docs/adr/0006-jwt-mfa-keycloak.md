# ADR-0006: JWT + MFA TOTP + Keycloak

**Status**: Aprovado
**Data**: 2026-06-16

## Contexto
Ambiente on-premises. Keycloak é o padrão de SSO adotado pelo TJCE. O sistema deve operar com autenticação local quando Keycloak não estiver disponível.

## Decisão
Autenticação local (email/senha) com bcrypt cost 12, JWT (access + refresh tokens) e MFA via TOTP. Suporte a Keycloak como provedor alternativo via OpenID Connect.

## Alternativas Consideradas
- Apenas Keycloak: Dependência externa bloqueante para ambientes sem SSO
- Apenas local: Sem SSO corporativo

## Consequências
- Suporte dual (local + SSO) configurável via `AUTH_PROVIDER`
- bcrypt cost 12 + MFA TOTP obrigatório para P01, P02, P10
- Em modo Keycloak, MFA é delegado ao provedor
- Complexidade adicional de manter duas estratégias de autenticação
