#!/bin/bash

# Upload to weather-map-pwa GitHub Repository
# Replace YOUR_USERNAME with your actual GitHub username

echo "════════════════════════════════════════════════════════════"
echo "  Uploading to weather-map-pwa GitHub Repository"
echo "════════════════════════════════════════════════════════════"
echo ""

# Initialize git repository
echo "Step 1: Initializing Git repository..."
git init

# Add all files
echo "Step 2: Adding all files..."
git add .

# Create first commit
echo "Step 3: Creating commit..."
git commit -m "Initial commit - Davao Weather PWA with Supabase and Google Maps integration"

# Add remote (REPLACE YOUR_USERNAME!)
echo "Step 4: Adding GitHub remote..."
echo "⚠️  REPLACE 'YOUR_USERNAME' with your GitHub username in the next command!"
read -p "Enter your GitHub username: " username
git remote add origin https://github.com/$username/weather-map-pwa.git

# Rename branch to main
echo "Step 5: Setting branch to main..."
git branch -M main

# Push to GitHub
echo "Step 6: Pushing to GitHub..."
git push -u origin main

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  ✅ SUCCESS! Your code is now on GitHub!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Import your weather-map-pwa repository"
echo "3. Click Deploy"
echo ""
echo "Your app will be live in 2 minutes! 🚀"
