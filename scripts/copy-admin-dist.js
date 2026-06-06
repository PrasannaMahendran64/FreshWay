const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const adminDist = path.join(rootDir, "Admin", "my-project", "dist");
const webAdminDist = path.join(rootDir, "Frontend", "front-end", "dist", "admin");

if (!fs.existsSync(adminDist)) {
  throw new Error(`Admin build folder not found: ${adminDist}`);
}

fs.rmSync(webAdminDist, { recursive: true, force: true });
fs.mkdirSync(path.dirname(webAdminDist), { recursive: true });
fs.cpSync(adminDist, webAdminDist, { recursive: true });

console.log(`Copied admin build to ${webAdminDist}`);
