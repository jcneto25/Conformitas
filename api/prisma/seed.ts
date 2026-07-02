import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // ── Perfis (P01-P10) ──────────────────────────
  const perfis = [
    { codigo: 'P01', nome: 'Auditor-Chefe', descricao: 'Chefe da AUDIN', nivelAcesso: 'AUDITORIA', permissoes: ['AUDITORIA_READ', 'AUDITORIA_WRITE', 'PLANO_READ', 'PLANO_WRITE', 'RELATORIO_READ', 'RELATORIO_WRITE', 'USUARIO_READ', 'PERFIL_READ', 'ETICA_READ', 'ETICA_WRITE'] },
    { codigo: 'P02', nome: 'Auditor', descricao: 'Auditor interno', nivelAcesso: 'AUDITORIA', permissoes: ['AUDITORIA_READ', 'EVIDENCIA_READ', 'EVIDENCIA_WRITE', 'PAPEL_TRABALHO_READ', 'PAPEL_TRABALHO_WRITE'] },
    { codigo: 'P03', nome: 'Presidente', descricao: 'Presidente do TJCE', nivelAcesso: 'INSTITUCIONAL', permissoes: ['PLANO_READ', 'PLANO_APROVAR', 'PLANO_PUBLICAR', 'RELATORIO_READ'] },
    { codigo: 'P04', nome: 'Órgão Colegiado', descricao: 'Membros do colegiado', nivelAcesso: 'INSTITUCIONAL', permissoes: ['PLANO_READ', 'PLANO_APROVAR', 'RELATORIO_READ'] },
    { codigo: 'P05', nome: 'Gestor Unidade Auditada', descricao: 'Gestor da unidade sob auditoria', nivelAcesso: 'UNIDADE', permissoes: ['AUDITORIA_READ', 'MANIFESTACAO_WRITE', 'RECOMENDACAO_READ', 'REQUISICAO_READ'] },
    { codigo: 'P06', nome: 'Gestor 2ª Linha', descricao: 'Gestor de controles internos', nivelAcesso: 'UNIDADE', permissoes: ['AUDITORIA_READ', 'RECOMENDACAO_READ', 'RISCO_READ'] },
    { codigo: 'P07', nome: 'Avaliador Externo', descricao: 'Avaliador externo do PQAUD', nivelAcesso: 'AVALIACAO', permissoes: ['AVALIACAO_READ', 'AVALIACAO_WRITE', 'NC_READ', 'NC_WRITE'] },
    { codigo: 'P08', nome: 'Comitê SIAUD-Jud', descricao: 'Comitê de coordenação', nivelAcesso: 'INSTITUCIONAL', permissoes: ['INTEGRACAO_READ', 'PLANO_READ', 'RELATORIO_READ'] },
    { codigo: 'P09', nome: 'CPA', descricao: 'Comissão de Auditoria', nivelAcesso: 'AUDITORIA', permissoes: ['AUDITORIA_READ', 'RELATORIO_READ', 'RECOMENDACAO_READ'] },
    { codigo: 'P10', nome: 'Administrador', descricao: 'Administrador do sistema', nivelAcesso: 'SISTEMA', permissoes: ['SISTEMA_ADMIN', 'USUARIO_READ', 'USUARIO_WRITE', 'PERFIL_READ', 'PERFIL_WRITE', 'CONFIG_READ', 'CONFIG_WRITE'] },
  ];

  for (const perfil of perfis) {
    await prisma.perfil.upsert({
      where: { codigo: perfil.codigo },
      update: perfil,
      create: perfil,
    });
  }
  console.log('✅ 10 perfis criados');

  // ── Configurações ──────────────────────────────
  const configuracoes = [
    { chave: 'prazo_manifestacao_dias_uteis', valor: '5', descricao: 'Prazo para manifestação do auditado em dias úteis', editavel: true },
    { chave: 'meta_horas_capacitacao_anual', valor: '40', descricao: 'Meta anual de horas de capacitação por auditor', editavel: true },
    { chave: 'periodo_palp_anos', valor: '4', descricao: 'Período do PALP em anos', editavel: true },
    { chave: 'prazo_recurso_admin_dias', valor: '10', descricao: 'Prazo para recurso administrativo em dias', editavel: true },
    { chave: 'max_mandatos_auditor_chefe', valor: '2', descricao: 'Número máximo de mandatos consecutivos do Auditor-Chefe', editavel: false },
    { chave: 'tentativas_login_max', valor: '5', descricao: 'Número máximo de tentativas de login antes do bloqueio', editavel: false },
    { chave: 'bloqueio_login_minutos', valor: '30', descricao: 'Tempo de bloqueio após tentativas excedidas em minutos', editavel: false },
  ];

  for (const config of configuracoes) {
    await prisma.configuracaoSistema.upsert({
      where: { chave: config.chave },
      update: config,
      create: config,
    });
  }
  console.log('✅ 7 configurações criadas');

  // ── Usuários ──────────────────────────────────
  const senhaHash = await bcrypt.hash('Admin@123456', 12);

  const usuarios = [
    { nome: 'Administrador', email: 'admin@audin.tjce.gov.br', matricula: 'ADM001', cargo: 'Administrador do Sistema', unidade: 'TI', perfis: ['P10'] },
    { nome: 'Ana Auditora-Chefe', email: 'auditor-chefe@audin.tjce.gov.br', matricula: 'AUD001', cargo: 'Auditora-Chefe', unidade: 'AUDIN', perfis: ['P01'] },
    { nome: 'Bruno Auditor', email: 'auditor@audin.tjce.gov.br', matricula: 'AUD002', cargo: 'Auditor Interno', unidade: 'AUDIN', perfis: ['P02'] },
    { nome: 'Dr. Presidente', email: 'presidente@tjce.gov.br', matricula: 'PRES001', cargo: 'Presidente', unidade: 'PRESIDENCIA', perfis: ['P03'] },
    { nome: 'Carlos Gestor', email: 'gestor@tjce.gov.br', matricula: 'GES001', cargo: 'Gestor de Unidade', unidade: 'SECRETARIA_X', perfis: ['P05'] },
  ];

  for (const user of usuarios) {
    const usuario = await prisma.usuario.upsert({
      where: { email: user.email },
      update: { nome: user.nome, cargo: user.cargo, unidade: user.unidade },
      create: {
        nome: user.nome,
        email: user.email,
        matricula: user.matricula,
        cargo: user.cargo,
        unidade: user.unidade,
        senhaHash,
        ativo: true,
      },
    });

    // Atribuir perfis
    for (const codigo of user.perfis) {
      const perfil = await prisma.perfil.findUnique({ where: { codigo } });
      if (perfil) {
        const existing = await prisma.usuarioPerfil.findFirst({
          where: { usuarioId: usuario.id, perfilId: perfil.id },
        });
        if (!existing) {
          await prisma.usuarioPerfil.create({
            data: {
              usuarioId: usuario.id,
              perfilId: perfil.id,
              ativo: true,
            },
          });
        }
      }
    }
  }
  console.log(`✅ ${usuarios.length} usuários criados`);

  // ── Integrações ────────────────────────────────
  const existingIntegracoes = await prisma.integracao.count();
  if (existingIntegracoes === 0) {
    const integracoes = [
      { nome: 'Ouvidoria TJCE', sistemaExterno: 'Ouvidoria', tipo: 'ENTRADA', protocolo: 'REST', endpoint: 'https://ouvidoria.tjce.jus.br/api/v1', metodoAutenticacao: 'API_KEY', frequencia: 'DIARIA', status: 'EM_CONFIGURACAO', healthStatus: 'NAO_TESTADO' },
      { nome: 'Portal Transparência', sistemaExterno: 'PortalTransparencia', tipo: 'SAIDA', protocolo: 'REST', endpoint: 'https://transparencia.tjce.jus.br/api/v1', metodoAutenticacao: 'API_KEY', frequencia: 'SEMANAL', status: 'EM_CONFIGURACAO', healthStatus: 'NAO_TESTADO' },
      { nome: 'SIAUD-Jud', sistemaExterno: 'SIAUD-Jud', tipo: 'BIDIRECIONAL', protocolo: 'REST', endpoint: 'https://siaud.cnj.jus.br/api/v1', metodoAutenticacao: 'OAUTH2', frequencia: 'TEMPO_REAL', status: 'EM_CONFIGURACAO', healthStatus: 'NAO_TESTADO' },
    ];

    for (const integracao of integracoes) {
      await prisma.integracao.create({ data: integracao });
    }
    console.log(`✅ ${integracoes.length} integrações criadas`);
  } else {
    console.log(`⏩ Integrações já existem (${existingIntegracoes}), pulando...`);
  }

  // ── Universo Auditável ─────────────────────────
  const existingUniverso = await prisma.universoAuditavel.count();
  if (existingUniverso === 0) {
    const itensUniverso = [
      { nome: 'Secretaria de Finanças', descricao: 'Gestão orçamentária, financeira e contábil do TJCE', tipo: 'PROCESSO', unidadeResponsavel: 'SEFIN', materialidade: 5, relevancia: 5, criticidade: 4, risco: 3, indicePriorizacao: 4.16, ativo: true },
      { nome: 'Diretoria Administrativa', descricao: 'Administração geral e contratos', tipo: 'AREA', unidadeResponsavel: 'DIRAD', materialidade: 5, relevancia: 4, criticidade: 5, risco: 4, indicePriorizacao: 4.47, ativo: true },
      { nome: 'Divisão de Licitações', descricao: 'Processos licitatórios e compras', tipo: 'PROCESSO', unidadeResponsavel: 'DILIC', materialidade: 4, relevancia: 5, criticidade: 4, risco: 4, indicePriorizacao: 4.23, ativo: true },
      { nome: 'Gabinete da Presidência', descricao: 'Assessoria direta à Presidência', tipo: 'AREA', unidadeResponsavel: 'GABPRES', materialidade: 5, relevancia: 4, criticidade: 4, risco: 3, indicePriorizacao: 3.94, ativo: true },
      { nome: 'Núcleo de Informática', descricao: 'Infraestrutura e sistemas de TI', tipo: 'AREA', unidadeResponsavel: 'NUTEC', materialidade: 3, relevancia: 5, criticidade: 4, risco: 3, indicePriorizacao: 3.66, ativo: true },
      { nome: 'Setor de Protocolo', descricao: 'Protocolo e tramitação documental', tipo: 'PROCESSO', unidadeResponsavel: 'SETPRO', materialidade: 5, relevancia: 3, criticidade: 4, risco: 5, indicePriorizacao: 4.16, ativo: true },
      { nome: 'Divisão de Recursos Humanos', descricao: 'Gestão de pessoas e folha de pagamento', tipo: 'AREA', unidadeResponsavel: 'DIRHU', materialidade: 4, relevancia: 4, criticidade: 3, risco: 2, indicePriorizacao: 3.13, ativo: true },
      { nome: 'Coordenadoria de Controle Interno', descricao: 'Controles internos e conformidade', tipo: 'AREA', unidadeResponsavel: 'COCIN', materialidade: 3, relevancia: 3, criticidade: 5, risco: 4, indicePriorizacao: 3.66, ativo: true },
    ];

    for (const item of itensUniverso) {
      await prisma.universoAuditavel.create({ data: item });
    }
    console.log(`✅ ${itensUniverso.length} itens do universo auditável criados`);
  } else {
    console.log(`⏩ Universo auditável já existe (${existingUniverso}), pulando...`);
  }

  // ── Planos de Auditoria (PAA) ─────────────────────
  const existingPlanos = await prisma.planoAuditoria.count();
  if (existingPlanos === 0) {
    const auditorChefe = await prisma.usuario.findUnique({ where: { email: 'auditor-chefe@audin.tjce.gov.br' } });
    const brunoAuditor = await prisma.usuario.findUnique({ where: { email: 'auditor@audin.tjce.gov.br' } });
    const presidente = await prisma.usuario.findUnique({ where: { email: 'presidente@tjce.gov.br' } });

    const sefinUniv = await prisma.universoAuditavel.findFirst({ where: { nome: 'Secretaria de Finanças' } });
    const diradUniv = await prisma.universoAuditavel.findFirst({ where: { nome: 'Diretoria Administrativa' } });
    const nutecUniv = await prisma.universoAuditavel.findFirst({ where: { nome: 'Núcleo de Informática' } });
    const dirhuUniv = await prisma.universoAuditavel.findFirst({ where: { nome: 'Divisão de Recursos Humanos' } });
    const dilicUniv = await prisma.universoAuditavel.findFirst({ where: { nome: 'Divisão de Licitações' } });

    if (auditorChefe && brunoAuditor && sefinUniv) {
      // PAA 2026 — aprovado e publicado
      const paa = await prisma.planoAuditoria.create({
        data: {
          tipo: 'PAA',
          anoInicio: 2026,
          anoFim: 2026,
          status: 'PUBLICADO',
          versao: 1,
          criadoPorId: auditorChefe.id,
          dataSubmissao: new Date('2025-11-15T10:00:00Z'),
          dataAprovacao: new Date('2025-11-28T14:30:00Z'),
          dataPublicacao: new Date('2025-12-10T09:00:00Z'),
        },
      });

      await prisma.itemPlano.create({
        data: {
          planoId: paa.id,
          universoAuditavelId: sefinUniv.id,
          tipoAuditoria: 'FINANCEIRA',
          formaExecucao: 'DIRETA',
          horasEstimadas: 320,
          equipeIds: [brunoAuditor.id],
          escopo: 'Auditoria financeira na Secretaria de Finanças — exercício 2025',
          objetivo: 'Verificar conformidade da execução orçamentária e financeira',
          resultadosEsperados: 'Relatório com achados de conformidade',
          questoesAuditoria: ['Os empenhos estão em conformidade com a LOA?', 'As conciliações bancárias estão atualizadas?'],
          testesPrevistos: ['Amostragem de 50 empenhos', 'Circularização de saldos bancários'],
          cronogramaInicio: new Date('2026-02-01'),
          cronogramaFim: new Date('2026-04-30'),
          prioridade: 'ALTA',
        },
      });

      await prisma.forcaTrabalho.create({
        data: {
          planoId: paa.id,
          usuarioId: brunoAuditor.id,
          horasDisponiveisAno: 1600,
          horasAlocadasAuditoria: 320,
          ano: 2026,
        },
      });

      console.log('✅ PAA 2026 criado com itens e força de trabalho');
    }

    if (auditorChefe && presidente && diradUniv && nutecUniv && dirhuUniv && dilicUniv) {
      // PALP 2025-2028 — aprovado
      const palp = await prisma.planoAuditoria.create({
        data: {
          tipo: 'PALP',
          anoInicio: 2025,
          anoFim: 2028,
          status: 'APROVADO',
          versao: 1,
          criadoPorId: auditorChefe.id,
          dataSubmissao: new Date('2024-11-10T08:00:00Z'),
          dataAprovacao: new Date('2024-11-25T11:00:00Z'),
        },
      });

      await prisma.itemPlano.create({
        data: {
          planoId: palp.id,
          universoAuditavelId: diradUniv.id,
          tipoAuditoria: 'OPERACIONAL',
          formaExecucao: 'DIRETA',
          horasEstimadas: 400,
          escopo: 'Avaliação da gestão administrativa e contratos',
          objetivo: 'Avaliar economicidade e eficiência',
          prioridade: 'ALTA',
        },
      });

      await prisma.itemPlano.create({
        data: {
          planoId: palp.id,
          universoAuditavelId: nutecUniv.id,
          tipoAuditoria: 'GESTAO',
          formaExecucao: 'INTEGRADA',
          horasEstimadas: 300,
          escopo: 'Avaliação da governança de TI',
          objetivo: 'Avaliar maturidade da governança',
          prioridade: 'MEDIA',
        },
      });

      await prisma.itemPlano.create({
        data: {
          planoId: palp.id,
          universoAuditavelId: dirhuUniv.id,
          tipoAuditoria: 'CONFORMIDADE',
          formaExecucao: 'DIRETA',
          horasEstimadas: 250,
          escopo: 'Folha de pagamento e benefícios',
          objetivo: 'Verificar legalidade dos pagamentos',
          prioridade: 'ALTA',
        },
      });

      await prisma.itemPlano.create({
        data: {
          planoId: palp.id,
          universoAuditavelId: dilicUniv.id,
          tipoAuditoria: 'OPERACIONAL',
          formaExecucao: 'DIRETA',
          horasEstimadas: 350,
          escopo: 'Processos licitatórios',
          objetivo: 'Avaliar conformidade e eficiência',
          prioridade: 'MEDIA',
        },
      });

      console.log('✅ PALP 2025-2028 criado com itens');
    }

    // RASCUNHO de PAA para 2027 (em elaboração)
    if (auditorChefe) {
      await prisma.planoAuditoria.create({
        data: {
          tipo: 'PAA',
          anoInicio: 2027,
          anoFim: 2027,
          status: 'RASCUNHO',
          versao: 1,
          criadoPorId: auditorChefe.id,
        },
      });
      console.log('✅ PAA 2027 rascunho criado');
    }
  } else {
    console.log(`⏩ Planos já existem (${existingPlanos}), pulando...`);
  }

  console.log('🌱 Seed concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
