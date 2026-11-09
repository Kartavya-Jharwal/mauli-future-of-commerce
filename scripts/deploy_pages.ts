#!/usr/bin/env bun
/**
 * Local GitHub Pages deploy (no Actions).
 * Expects dist/project-site from `bun run build`, then force-pushes to gh-pages.
 */
import { $ } from "bun";
import { mkdtempSync, rmSync, existsSync, cpSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const root = join(import.meta.dir, "..");
const dist = join(root, "dist", "project-site");
const remote = "https://github.com/Kartavya-Jharwal/mauli-future-of-commerce.git";

if (!existsSync(join(dist, "index.html"))) {
  console.error("Missing dist/project-site. Run: bun run build");
  process.exit(1);
}

const stage = mkdtempSync(join(tmpdir(), "mauli-pages-"));
try {
  cpSync(dist, stage, { recursive: true });
  await $`git -C ${stage} init -b gh-pages`;
  await $`git -C ${stage} add -A`;
  await $`git -C ${stage} -c user.name=${"Kartavya Jharwal"} -c user.email=${"kartavya@users.noreply.github.com"} commit -m ${"Deploy site from local bun build"}`;
  await $`git -C ${stage} remote add origin ${remote}`;
  await $`git -C ${stage} push -f origin HEAD:refs/heads/gh-pages`;
  console.log("Published dist/project-site -> origin/gh-pages");
} finally {
  rmSync(stage, { recursive: true, force: true });
}
