#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Color pattern definitions
const patterns = {
  tailwindColors:
    /\b(bg|text|border|ring|shadow|from|to|via)-([a-z]+)-(\d+)\b/g,
  tailwindNamedColors:
    /\b(bg|text|border|ring|shadow|from|to|via)-(red|blue|green|yellow|orange|purple|pink|gray|grey|black|white|slate|zinc|neutral|stone|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|rose)\b/g,
  hexColors: /#[0-9a-fA-F]{3,8}/g,
  rgbaColors: /rgba?\([0-9,\s\.]+\)/g,
  cssCustomProps: /--[a-zA-Z-]*color[a-zA-Z-]*/g,
  namedColors:
    /\b(red|blue|green|yellow|orange|purple|pink|gray|grey|black|white|brown|cyan|magenta|lime|indigo|violet|crimson|navy|teal|olive|maroon|silver|gold|transparent|inherit|currentColor)\b/g,
};

const colorCounts = {};

function initializeColorCounts() {
  Object.keys(patterns).forEach((patternName) => {
    colorCounts[patternName] = {};
  });
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    Object.keys(patterns).forEach((patternName) => {
      const pattern = patterns[patternName];
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const colorValue = match[0];
        if (!colorCounts[patternName][colorValue]) {
          colorCounts[patternName][colorValue] = 0;
        }
        colorCounts[patternName][colorValue]++;
      }
    });
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
  }
}

function walkDirectory(dir, fileExtensions) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules, .next, .git
      if (!["node_modules", ".next", ".git"].includes(item)) {
        walkDirectory(fullPath, fileExtensions);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if (fileExtensions.includes(ext)) {
        processFile(fullPath);
      }
    }
  }
}

function generateReport() {
  console.log("=".repeat(80));
  console.log("COLOR USAGE ANALYSIS REPORT");
  console.log("=".repeat(80));

  let totalColors = 0;

  Object.keys(colorCounts).forEach((patternName) => {
    const colors = colorCounts[patternName];
    const sortedColors = Object.entries(colors).sort(([, a], [, b]) => b - a);

    if (sortedColors.length > 0) {
      console.log(`\n${patternName.toUpperCase()}:`);
      console.log("-".repeat(40));

      sortedColors.forEach(([color, count]) => {
        console.log(`  ${color.padEnd(30)} ${count} times`);
        totalColors += count;
      });

      console.log(`  Total unique colors: ${sortedColors.length}`);
      console.log(
        `  Total usages: ${sortedColors.reduce((sum, [, count]) => sum + count, 0)}`,
      );
    }
  });

  console.log("\n" + "=".repeat(80));
  console.log(`SUMMARY: ${totalColors} total color usages found`);
  console.log("=".repeat(80));
}

// Main execution
initializeColorCounts();

const fileExtensions = [".tsx", ".ts", ".jsx", ".js", ".css", ".json"];
const startDir = process.cwd();

console.log(`Analyzing color usage in: ${startDir}`);
console.log(`File extensions: ${fileExtensions.join(", ")}`);

walkDirectory(startDir, fileExtensions);
generateReport();
