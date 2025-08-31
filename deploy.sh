#!/bin/bash

echo "🚀 Deploying Project Showcase to Render..."

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Added Render deployment config"
git push

echo "✅ Code pushed to GitHub!"
echo ""
echo "🎯 Next Steps:"
echo "1. Go to https://render.com"
echo "2. Click 'New +' → 'Blueprint'"
echo "3. Connect your GitHub repo"
echo "4. Render will auto-deploy both services!"
echo ""
echo "📱 Your app will be available at:"
echo "- Frontend: https://project-showcase-frontend.onrender.com"
echo "- Backend: https://project-showcase-backend.onrender.com"
