#!/usr/bin/env node

/**
 * Build script for mediasoup worker
 * This script finds the mediasoup package in pnpm's store and runs the postinstall script
 * to compile/download the C++ worker binary.
 */

import { execSync, spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serverRoot = join(__dirname, "..");

console.log("Building mediasoup worker...\n");

// Find mediasoup in pnpm store
const pnpmDir = join(serverRoot, "node_modules", ".pnpm");

function findMediasoupDir() {
  // Check if pnpm store exists
  if (existsSync(pnpmDir)) {
    const entries = readdirSync(pnpmDir);
    const mediasoupEntry = entries.find((e) => e.startsWith("mediasoup@"));

    if (mediasoupEntry) {
      const mediasoupPath = join(
        pnpmDir,
        mediasoupEntry,
        "node_modules",
        "mediasoup"
      );
      if (existsSync(mediasoupPath)) {
        return mediasoupPath;
      }
    }
  }

  // Fallback: check regular node_modules (for npm/yarn/bun)
  const regularPath = join(serverRoot, "node_modules", "mediasoup");
  if (existsSync(regularPath)) {
    return regularPath;
  }

  return null;
}

function buildMediasoup(mediasoupDir) {
  const npmScriptsPath = join(mediasoupDir, "npm-scripts.mjs");

  if (!existsSync(npmScriptsPath)) {
    console.error("Could not find npm-scripts.mjs in mediasoup directory");
    process.exit(1);
  }

  console.log(`Found mediasoup at: ${mediasoupDir}`);
  console.log(`Running postinstall script...\n`);

  try {
    // Run the postinstall script from the mediasoup directory
    execSync(`node npm-scripts.mjs postinstall`, {
      cwd: mediasoupDir,
      stdio: "inherit",
      env: { ...process.env },
    });

    // Verify worker was created
    const workerPath = join(
      mediasoupDir,
      "worker",
      "out",
      "Release",
      "mediasoup-worker"
    );

    if (existsSync(workerPath)) {
      console.log("mediasoup-worker binary created successfully!");
      console.log(`  Location: ${workerPath}`);
      return true;
    } else {
      console.error("Worker binary not found after build");
      return false;
    }
  } catch (error) {
    console.error("Build failed:", error.message);
    return false;
  }
}

// Main
const mediasoupDir = findMediasoupDir();

if (!mediasoupDir) {
  console.error("Could not find mediasoup package");
  console.error("Make sure mediasoup is installed: pnpm install");
  process.exit(1);
}

const success = buildMediasoup(mediasoupDir);
process.exit(success ? 0 : 1);
