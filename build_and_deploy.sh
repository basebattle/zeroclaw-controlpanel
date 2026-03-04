#!/bin/bash
set -e

echo "🚀 Starting ZeroClaw Clean Build & Deploy..."

# 1. Clean up potential permission locks on frontend
echo "🧹 Cleaning up web artifacts..."
sudo rm -rf web/node_modules web/package-lock.json web/dist

# 2. Build the Frontend
echo "📦 Building ZeroClaw Web GUI..."
cd web
npm install
npm run build
cd ..

# 3. Re-bake Frontend into Rust Binary
echo "🦀 Compiling ZeroClaw Backend (Release)..."
cargo build --release

# 4. Deploy Binary
echo "🚢 Deploying ZeroClaw to system path..."
# If /opt/homebrew is managed by brew, we might need sudo or just use the local one
# For now, we will update the Raycast script to use the local release one specifically
# but we try to copy it anyway.
sudo cp target/release/zeroclaw /opt/homebrew/bin/zeroclaw || echo "⚠️  Failed to copy to /opt/homebrew/bin. Please update manually if needed."

echo "✅ Build Complete! You can now start 'zeroclaw daemon' or use your Raycast shortcut."
