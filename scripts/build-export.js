#!/usr/bin/env node
/**
 * EmHa Elektro — Dual-Mode Export & Build Tool
 * 
 * Supports:
 * 1. CMS Mode (--mode=cms)      -> Full build into dist/ with AdminPage and full API
 * 2. Clean Mode (--mode=clean)  -> Standalone build into dist-clean/ with zero-admin bundle & minimal Mailer API
 * 3. Both Modes (--mode=both)   -> Compiles both dist/ and dist-clean/
 * 
 * Usage:
 *   node scripts/build-export.js --mode=both
 *   node scripts/build-export.js --mode=cms
 *   node scripts/build-export.js --mode=clean
 */

import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')

const args = process.argv.slice(2)
let mode = 'both' // Default: build both builds as requested

for (const arg of args) {
  if (arg.startsWith('--mode=')) {
    mode = arg.split('=')[1]
  }
}

console.log(`\n======================================================`)
console.log(` ⚡ EmHa Elektro — Export / Build System`)
console.log(`    Režim sestavení: ${mode.toUpperCase()}`)
console.log(`======================================================\n`)

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

/**
 * Syncs the latest edited content from CMS data/content.json into static src/data/defaultContent.json
 */
function syncContentFreeze() {
  const contentJsonPath = path.join(ROOT_DIR, 'api/data/content.json')
  const defaultContentPath = path.join(ROOT_DIR, 'src/data/defaultContent.json')

  if (fs.existsSync(contentJsonPath)) {
    try {
      const data = fs.readFileSync(contentJsonPath, 'utf-8')
      const parsed = JSON.parse(data)
      if (parsed && parsed.business) {
        fs.writeFileSync(defaultContentPath, JSON.stringify(parsed, null, 2), 'utf-8')
        console.log(`✓ Synchronizován nejnovější obsah z api/data/content.json do src/data/defaultContent.json`)
      }
    } catch (err) {
      console.warn(`! Varování při synchronizaci obsahu: ${err.message}`)
    }
  }
}

/**
 * 1. Build CMS Version (Full)
 */
function buildCms(outDir = 'dist') {
  console.log(`\n▶ [1/2] Sestavuji PLNÝ WEB s CMS a administrací (Cíl: ${outDir}/)...`)

  const outPath = path.join(ROOT_DIR, outDir)
  const prevAssetsDir = path.join(outPath, 'assets')
  const preservedAssets = []
  if (fs.existsSync(prevAssetsDir)) {
    try {
      const files = fs.readdirSync(prevAssetsDir)
      for (const f of files) {
        if (f.endsWith('.js') || f.endsWith('.css')) {
          preservedAssets.push({
            name: f,
            content: fs.readFileSync(path.join(prevAssetsDir, f)),
          })
        }
      }
    } catch {
      // ignore
    }
  }

  if (fs.existsSync(outPath)) {
    fs.rmSync(outPath, { recursive: true, force: true })
  }

  // Run Vite with VITE_CMS_ENABLED=true
  execSync(`npx vite build --outDir ${outDir}`, {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    env: { ...process.env, VITE_CMS_ENABLED: 'true' },
  })

  // Restore preserved assets from previous builds (prevents 404 for cached index.html)
  const assetsDir = path.join(outPath, 'assets')
  if (fs.existsSync(assetsDir)) {
    for (const asset of preservedAssets) {
      const dest = path.join(assetsDir, asset.name)
      if (!fs.existsSync(dest)) {
        fs.writeFileSync(dest, asset.content)
      }
    }
    // Also create known fallback aliases for smooth transition from old deployments
    const currentJs = fs.readdirSync(assetsDir).find((f) => f.startsWith('index-') && f.endsWith('.js'))
    const currentCss = fs.readdirSync(assetsDir).find((f) => f.startsWith('index-') && f.endsWith('.css'))
    if (currentJs) {
      const legacyJs = ['index-BB2QUr2L.js', 'index-DsnDhBLP.js']
      for (const leg of legacyJs) {
        const legPath = path.join(assetsDir, leg)
        if (!fs.existsSync(legPath)) {
          fs.copyFileSync(path.join(assetsDir, currentJs), legPath)
        }
      }
    }
    if (currentCss) {
      const legacyCss = ['index-BB0oTM6Y.css']
      for (const leg of legacyCss) {
        const legPath = path.join(assetsDir, leg)
        if (!fs.existsSync(legPath)) {
          fs.copyFileSync(path.join(assetsDir, currentCss), legPath)
        }
      }
    }
  }

  // Copy complete api directory
  const apiSrc = path.join(ROOT_DIR, 'api')
  const apiDest = path.join(outPath, 'api')
  copyDirRecursive(apiSrc, apiDest)

  // Verify AdminPage bundle exists
  const assetFiles = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : []
  const hasAdminChunk = assetFiles.some((f) => f.startsWith('AdminPage-') && f.endsWith('.js'))

  console.log(`✓ Plné sestavení dokončeno do ${outDir}/`)
  console.log(`  - Obsahuje AdminPage chunk: ${hasAdminChunk ? 'ANO (v pořádku)' : 'NE'}`)
  console.log(`  - Kompletní PHP API nakopírováno do ${outDir}/api/`)
}

/**
 * 2. Build Clean Version (Standalone without CMS)
 */
function buildClean(outDir = 'dist-clean') {
  console.log(`\n▶ [2/2] Sestavuji ČISTÝ WEB bez CMS a administrace (Cíl: ${outDir}/)...`)

  // First freeze/bake the latest content into defaultContent.json
  syncContentFreeze()

  const outPath = path.join(ROOT_DIR, outDir)
  if (fs.existsSync(outPath)) {
    fs.rmSync(outPath, { recursive: true, force: true })
  }

  // Run Vite with VITE_CMS_ENABLED=false (Dead-code elimination will drop AdminPage)
  execSync(`npx vite build --outDir ${outDir}`, {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    env: { ...process.env, VITE_CMS_ENABLED: 'false' },
  })

  // Copy ONLY clean standalone API files:
  const apiDest = path.join(outPath, 'api')
  fs.mkdirSync(apiDest, { recursive: true })

  // Core Mailer & Contact endpoints
  const cleanFiles = ['contact.php', 'Mailer.php', 'Security.php']
  for (const f of cleanFiles) {
    const srcF = path.join(ROOT_DIR, 'api', f)
    if (fs.existsSync(srcF)) {
      fs.copyFileSync(srcF, path.join(apiDest, f))
    }
  }

  // Email templates
  const templatesSrc = path.join(ROOT_DIR, 'api/templates')
  const templatesDest = path.join(apiDest, 'templates')
  copyDirRecursive(templatesSrc, templatesDest)

  // Add security .htaccess for clean API
  const htaccessContent = `# EmHa Clean API Security\n<IfModule mod_autoindex.c>\n    Options -Indexes\n</IfModule>\n<IfModule mod_headers.c>\n    Header always set X-Content-Type-Options "nosniff"\n    Header always set X-Frame-Options "DENY"\n</IfModule>\n`
  fs.writeFileSync(path.join(apiDest, '.htaccess'), htaccessContent)

  // Verify AdminPage chunk is completely ABSENT
  const assetsDir = path.join(outPath, 'assets')
  const assetFiles = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : []
  const hasAdminChunk = assetFiles.some((f) => f.startsWith('AdminPage-') && f.endsWith('.js'))

  console.log(`✓ Čisté sestavení dokončeno do ${outDir}/`)
  console.log(`  - Obsahuje AdminPage chunk: ${hasAdminChunk ? 'CHYBA: Admin chunk byl nalezen!' : 'NE (správně vyřazeno přes Dead-Code Elimination)'}`)
  console.log(`  - Čisté API připraveno v ${outDir}/api/ (pouze contact.php, Mailer.php, Security.php, templates/)`)
}

// Execute requested mode
try {
  if (mode === 'cms') {
    buildCms('dist')
  } else if (mode === 'clean') {
    buildClean('dist-clean')
  } else if (mode === 'both') {
    buildCms('dist')
    buildClean('dist-clean')
  } else {
    console.error(`Neznámý režim: "${mode}". Použijte --mode=cms, --mode=clean nebo --mode=both.`)
    process.exit(1)
  }

  console.log(`\n======================================================`)
  console.log(` 🎉 Sestavení proběhlo úspěšně!`)
  if (mode === 'both') {
    console.log(`    1. Plný web (s CMS):  dist/`)
    console.log(`    2. Čistý web (bez CMS): dist-clean/`)
  } else if (mode === 'cms') {
    console.log(`    Výstup: dist/ (Plná verze s CMS)`)
  } else {
    console.log(`    Výstup: dist-clean/ (Čistá verze bez CMS)`)
  }
  console.log(`======================================================\n`)
} catch (err) {
  console.error(`\n❌ Chyba při sestavení:`, err.message)
  process.exit(1)
}
