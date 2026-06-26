import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // ── Perfis (P01-P10) ──────────────────────────
  const perfis = [
    { codigo: 'P01', nome: 'Auditor-Chefe', descricao: 'Chefe da AUDIN', nivelAcesso: 'AUDITORIA' },
    { codigo: 'P02', nome: 'Auditor', descricao: 'Auditor interno', nivelAcesso: 'AUDITORIA' },
    { codigo: 'P03', nome: 'Presidente', descricao: 'Presidente do TJCE', nivelAcesso: 'INSTITUCIONAL' },
    { codigo: 'P04', nome: 'Órgão Colegiado', descricao: 'Membros do colegiado', nivelAcesso: 'INSTITUCIONAL' },
    { codigo: 'P05', nome: 'Gestor Unidade Auditada', descricao: 'Gestor da unidade sob auditoria', nivelAcesso: 'UNIDADE' },
    { codigo: 'P06', nome: 'Gestor 2ª Linha', descricao: 'Gestor de controles internos', nivelAcesso: 'UNIDADE' },
    { codigo: 'P07', nome: 'Avaliador Externo', descricao: 'Avaliador externo do PQAUD', nivelAcesso: 'AVALIACAO' },
    { codigo: 'P08', nome: 'Comitê SIAUD-Jud', descricao: 'Comitê de coordenação', nivelAcesso: 'INSTITUCIONAL' },
    { codigo: 'P09', nome: 'CPA', descricao: 'Comissão de Auditoria', nivelAcesso: 'AUDITORIA' },
    { codigo: 'P10', nome: 'Administrador', descricao: 'Administrador do sistema', nivelAcesso: 'SISTEMA' },
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
