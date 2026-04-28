import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const currentFile = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(currentFile), '..');
const useProdBackend = process.argv.includes('--prod-backend');
const forcePrismaGenerate = process.argv.includes('--with-prisma-generate');

const backendCommand = useProdBackend
  ? 'npm --prefix backend run start'
  : 'npm --prefix backend run start:dev';

function hasGeneratedPrismaClient() {
  const clientDir = path.join(rootDir, 'backend', 'node_modules', '.prisma', 'client');
  const requiredFiles = ['index.d.ts', 'index.js'];
  return requiredFiles.every((file) => fs.existsSync(path.join(clientDir, file)));
}

if (!useProdBackend && forcePrismaGenerate) {
  try {
    console.log('[dev] generating prisma client (backend)...');
    execSync('npm --prefix backend run prisma:generate', {
      cwd: rootDir,
      stdio: 'inherit',
      shell: true,
      env: process.env,
      timeout: 15_000,
    });
  } catch (error) {
    if (hasGeneratedPrismaClient()) {
      console.warn('[dev] prisma generate falhou, usando client já gerado.');
      console.warn('[dev] se mudar o schema.prisma, pare os processos Node e rode: npm --prefix backend run prisma:generate');
    } else {
      console.error('[dev] failed to generate prisma client before startup.');
      process.exit(1);
    }
  }
} else if (!useProdBackend) {
  if (!hasGeneratedPrismaClient()) {
    console.error('[dev] prisma client não encontrado. Rode: npm --prefix backend run prisma:generate');
    process.exit(1);
  }
  console.log('[dev] pulando prisma generate automático (modo Windows-safe).');
  console.log('[dev] use --with-prisma-generate quando precisar regenerar após mudar o schema.prisma.');
}

// When the NestJS CLI watch cycle tries to `taskkill` an already-dead PID on
// Windows, execSync throws and the process exits with code 1. The restart logic
// below recovers transparently instead of taking the entire dev session down.
const MAX_RESTARTS = 5;
const RESTART_WINDOW_MS = 30_000; // restart counter resets after 30 s of stability
const RESTART_DELAY_MS = 1_500;   // brief pause before re-spawning

const services = [
  {
    name: 'backend',
    command: backendCommand,
    // Auto-restart only in watch/dev mode; prod crashes should be fatal.
    restartable: !useProdBackend,
  },
  {
    name: 'frontend',
    command: 'npm --prefix frontend run dev',
    restartable: false,
  },
];

/** All active child processes (replaced on each restart). */
const children = new Set();
let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }

  setTimeout(() => process.exit(code), 150);
}

function spawnService(service, restartCount = 0, windowStart = Date.now()) {
  console.log(`[dev] starting ${service.name}: ${service.command}`);

  const child = spawn(service.command, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });

  children.add(child);

  child.on('exit', (code, signal) => {
    children.delete(child);
    if (shuttingDown) return;

    if (signal) {
      console.log(`[dev] ${service.name} finalizado por sinal: ${signal}`);
      shutdown(1);
      return;
    }

    if ((code ?? 0) !== 0 && service.restartable) {
      const now = Date.now();

      // Reset the restart counter if the window has expired (stable run).
      let nextCount = restartCount + 1;
      let nextWindowStart = windowStart;
      if (now - windowStart > RESTART_WINDOW_MS) {
        nextCount = 1;
        nextWindowStart = now;
      }

      if (nextCount > MAX_RESTARTS) {
        console.error(
          `[dev] ${service.name} atingiu o limite de ${MAX_RESTARTS} reinícios em ` +
          `${RESTART_WINDOW_MS / 1000}s. Encerrando.`,
        );
        shutdown(1);
        return;
      }

      console.log(
        `[dev] ${service.name} finalizou com erro (code: ${code}), ` +
        `reiniciando em ${RESTART_DELAY_MS}ms... [tentativa ${nextCount}/${MAX_RESTARTS}]`,
      );
      setTimeout(() => {
        if (!shuttingDown) spawnService(service, nextCount, nextWindowStart);
      }, RESTART_DELAY_MS);
      return;
    }

    if ((code ?? 0) !== 0) {
      console.log(`[dev] ${service.name} finalizou com erro (code: ${code})`);
      shutdown(code ?? 1);
      return;
    }

    console.log(`[dev] ${service.name} finalizou com sucesso`);
    shutdown(0);
  });
}

for (const service of services) {
  spawnService(service);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
