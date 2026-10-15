import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, mkdir, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const temporary = await realpath(await mkdtemp(join(tmpdir(), 'lunte-lsp-package-test-')))

try {
  const [packed] = JSON.parse(
    execFileSync('npm', ['pack', '--json', '--pack-destination', temporary], {
      cwd: root,
      encoding: 'utf8'
    })
  )
  const consumer = join(temporary, 'consumer')
  await mkdir(consumer)
  const manifest = {
    private: true,
    dependencies: { 'lunte-lsp': `file:${join(temporary, packed.filename)}` }
  }
  if (process.env.LUNTE_TARBALL) {
    manifest.overrides = { lunte: `file:${resolve(process.env.LUNTE_TARBALL)}` }
  }
  await writeFile(join(consumer, 'package.json'), JSON.stringify(manifest))
  execFileSync('npm', ['install', '--omit=dev', '--no-audit', '--no-fund'], {
    cwd: consumer,
    stdio: 'inherit'
  })
  for (const name of ['lunte-lsp', 'lunte']) {
    const installed = join(consumer, 'node_modules', name)
    assert.equal(await realpath(installed), installed, `${name} must not use a source symlink`)
  }
  console.log('Testing installed LSP artifact with', process.env.LUNTE_TARBALL || 'registry lunte')
  execFileSync('npm', ['test'], {
    cwd: root,
    env: { ...process.env, LUNTE_LSP_BIN: join(consumer, 'node_modules/.bin/lunte-lsp') },
    stdio: 'inherit',
    timeout: 120000
  })
} finally {
  await rm(temporary, { recursive: true, force: true })
}
