#!/bin/bash

# Deploy Fave to Render
echo "🚀 Deploying Fave to Render..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist directory not found."
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "🎯 Next steps:"
echo "1. Go to https://render.com"
echo "2. Sign up with GitHub"
echo "3. Create a new Static Site"
echo "4. Connect your repository"
echo "5. Use these settings:"
echo "   - Build Command: npm run build"
echo "   - Publish Directory: dist"
echo "   - Node Version: 18"
echo "6. Add your environment variables"
echo "7. Deploy!"
echo ""
echo "📖 See RENDER_DEPLOYMENT_GUIDE.md for detailed instructions"
