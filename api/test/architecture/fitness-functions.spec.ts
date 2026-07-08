import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const SRC = path.resolve(__dirname, '../../src');

/** Encontra arquivos recursivamente por padrão, excluindo node_modules e .spec */
function findFiles(dir: string, pattern: RegExp): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
      results.push(...findFiles(full, pattern));
    } else if (entry.isFile() && pattern.test(entry.name) && !entry.name.endsWith('.spec.ts')) {
      results.push(full);
    }
  }
  return results;
}

describe('Architecture — Fitness Functions', () => {
  describe('Repository Pattern', () => {
    it('nenhum service (fora repositories/) deve importar PrismaService', () => {
      const services = findFiles(SRC, /.service\.ts$/);
      const violators = services.filter((f) => {
        if (f.includes('/repositories/')) return false;
        const content = fs.readFileSync(f, 'utf-8');
        return (
          content.includes("from '../prisma/prisma.service'") || content.includes("from '../../prisma/prisma.service'")
        );
      });
      if (violators.length > 0) {
        throw new Error(`Services que ainda importam PrismaService:\n${violators.join('\n')}`);
      }
    });

    it('apenas arquivos prisma-*.repository.ts podem importar PrismaService', () => {
      const repos = findFiles(path.join(SRC), /prisma-.+\.repository\.ts$/);
      const nonPrismaRepos = repos.filter((f) => {
        const content = fs.readFileSync(f, 'utf-8');
        return (
          !content.includes("from '../../prisma/prisma.service'") &&
          !content.includes("from '../prisma/prisma.service'")
        );
      });
      if (nonPrismaRepos.length > 0) {
        throw new Error(`Implementações Prisma que não importam PrismaService:\n${nonPrismaRepos.join('\n')}`);
      }
    });
  });

  describe('Domain Layer Purity', () => {
    it('domain/ não deve importar nada do NestJS ou Prisma', () => {
      const domainFiles = findFiles(path.join(SRC), /.entity\.ts$/);
      domainFiles.push(...findFiles(path.join(SRC), /\.domain\.ts$/));
      for (const dir of ['auditorias', 'achados']) {
        domainFiles.push(...findFiles(path.join(SRC, dir, 'domain'), /.+\.ts$/));
      }
      const violators = domainFiles.filter((f) => {
        const content = fs.readFileSync(f, 'utf-8');
        return content.includes('@nestjs/') || content.includes('@prisma/') || content.includes('../prisma/');
      });
      if (violators.length > 0) {
        throw new Error(`Arquivos de domínio com dependência de infraestrutura:\n${violators.join('\n')}`);
      }
    });
  });

  describe('Use Case Boundaries', () => {
    it('use-cases/ não deve importar PrismaService', () => {
      const useCaseFiles = findFiles(path.join(SRC), /.use-case\.ts$/);
      const violators = useCaseFiles.filter((f) => {
        const content = fs.readFileSync(f, 'utf-8');
        return content.includes('prisma.service');
      });
      if (violators.length > 0) {
        throw new Error(`Use cases que importam PrismaService:\n${violators.join('\n')}`);
      }
    });

    it('use-cases/ não deve importar entidades do Prisma (tipos gerados)', () => {
      const useCaseFiles = findFiles(path.join(SRC), /.use-case\.ts$/);
      const violators = useCaseFiles.filter((f) => {
        const content = fs.readFileSync(f, 'utf-8');
        return content.includes('@prisma/client');
      });
      if (violators.length > 0) {
        throw new Error(`Use cases que importam @prisma/client:\n${violators.join('\n')}`);
      }
    });

    it('controller não deve importar repositories/ diretamente', () => {
      const controllers = findFiles(path.join(SRC), /.controller\.ts$/);
      const violators = controllers.filter((f) => {
        const content = fs.readFileSync(f, 'utf-8');
        return content.includes('/repositories/');
      });
      if (violators.length > 0) {
        throw new Error(`Controllers que importam repositories/:\n${violators.join('\n')}`);
      }
    });
  });

  describe('Event Bus (Onda 3)', () => {
    it('use-cases não devem importar NotificacoesService', () => {
      const useCaseFiles = findFiles(path.join(SRC), /.use-case\.ts$/);
      const violators = useCaseFiles.filter((f) => {
        const content = fs.readFileSync(f, 'utf-8');
        return content.includes('NotificacoesService');
      });
      if (violators.length > 0) {
        throw new Error(`Use cases que ainda importam NotificacoesService:\n${violators.join('\n')}`);
      }
    });
  });
});
