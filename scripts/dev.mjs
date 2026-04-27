import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const currentFile = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(currentFile), '..');
const useProdBackend = process.argv.includes('--prod-backend');

const backendCommand = useProdBackend
  ? 'npm --prefix backend run start'
  : 'npm --prefix backend run start:dev';

const services = [
  {
    name: 'backend',
    command: backendCommand,
  },
  {
    name: 'frontend',
    command: 'npm --prefix frontend run dev',
  },
];

const children = [];
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

for (const service of services) {
  console.log(`[dev] starting ${service.name}: ${service.command}`);

  const child = spawn(service.command, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });

  child.on('exit', (code, signal) => {
    if (shuttingDown) return;

    if (signal) {
      console.log(`[dev] ${service.name} finalizado por sinal: ${signal}`);
      shutdown(1);
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

  children.push(child);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
