const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const storiesDir = path.join(__dirname, "../public/stories");
const dirs = fs.readdirSync(storiesDir).filter(f => fs.statSync(path.join(storiesDir, f)).isDirectory());

console.log(`Found ${dirs.length} story directories.`);

// Split into batches of 10 stories each (6 batches total)
const batchSize = 10;
for (let i = 0; i < dirs.length; i += batchSize) {
  const batch = dirs.slice(i, i + batchSize);
  const batchNum = Math.floor(i / batchSize) + 1;
  const totalBatches = Math.ceil(dirs.length / batchSize);
  console.log(`\n=== Processing Batch ${batchNum}/${totalBatches} (${batch.length} stories) ===`);

  for (const dir of batch) {
    execSync(`git add "public/stories/${dir}"`, { stdio: "inherit" });
  }

  // Check if anything is staged
  const status = execSync("git status --porcelain").toString();
  if (status.includes("A ") || status.includes("M ") || status.includes("D ")) {
    console.log(`Committing batch ${batchNum}...`);
    execSync(`git commit -m "feat(assets): story scenes batch ${batchNum} of ${totalBatches}"`, { stdio: "inherit" });
    console.log(`Pushing batch ${batchNum}...`);
    execSync("git push origin main", { stdio: "inherit" });
    console.log(`✓ Batch ${batchNum} pushed successfully!`);
  } else {
    console.log(`No changes staged in batch ${batchNum}.`);
  }
}

console.log("\nAll story batches processed successfully!");
