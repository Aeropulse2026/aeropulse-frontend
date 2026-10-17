import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const sourceDir = dirname(new URL(import.meta.url).pathname);
const projectRoot = resolve(sourceDir, "../../..");
const buildDir = mkdtempSync(join(tmpdir(), "aeropulse-map-tests-"));

for (const { name, sourcePath } of [
  ...["types", "adapter", "api"].map((name) => ({ name, sourcePath: join(sourceDir, `${name}.ts`) })),
  { name: "demo-command-network", sourcePath: join(sourceDir, "demo-command-network.ts") },
  { name: "style-proxy", sourcePath: join(sourceDir, "../carto/style-proxy.ts") },
]) {
  const source = readFileSync(sourcePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: sourcePath,
  }).outputText;
  writeFileSync(join(buildDir, `${name}.js`), output);
}

const result = spawnSync(process.execPath, [join(sourceDir, "command-network.test.mjs")], {
  cwd: projectRoot,
  stdio: "inherit",
  env: { ...process.env, AEROPULSE_COMMAND_NETWORK_TEST_BUILD: buildDir },
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
