#!/bin/bash

# Cisco CMP Portal Deployment Script
# This script helps deploy the portal to GitHub and AWS Amplify

set -e

echo "====================================="
echo "Cisco CMP Portal Deployment Script"
echo "====================================="
echo ""

# Check if GitHub repo URL is provided
if [ -z "$1" ]; then
    echo "Usage: ./deploy.sh <github-repo-url>"
    echo ""
    echo "Example:"
    echo "  ./deploy.sh https://github.com/yourusername/cisco-cmp-portal.git"
    echo ""
    echo "Steps to create GitHub repo:"
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: cisco-cmp-portal"
    echo "3. Description: Cisco Cloud Management Platform Web Portal"
    echo "4. Public or Private: Your choice"
    echo "5. DO NOT initialize with README, .gitignore, or license"
    echo "6. Click 'Create repository'"
    echo "7. Copy the repository URL (https://github.com/yourusername/cisco-cmp-portal.git)"
    echo "8. Run: ./deploy.sh <that-url>"
    exit 1
fi

GITHUB_REPO=$1

echo "Step 1: Checking git status..."
git status

echo ""
echo "Step 2: Adding GitHub remote..."
git remote remove origin 2>/dev/null || true
git remote add origin "$GITHUB_REPO"

echo ""
echo "Step 3: Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "Next steps:"
echo "1. Go to AWS Amplify Console: https://ap-south-1.console.aws.amazon.com/amplify/"
echo "2. Click 'New app' → 'Host web app'"
echo "3. Select 'GitHub' as repository provider"
echo "4. Authorize AWS Amplify to access your GitHub"
echo "5. Select repository: cisco-cmp-portal"
echo "6. Select branch: main"
echo "7. Build settings are auto-detected (amplify.yml)"
echo "8. Click 'Save and deploy'"
echo ""
echo "Your app will be deployed at: https://main.XXXXX.amplifyapp.com"
echo "Configure custom domain icmp.ciscoaidemo.com in Amplify Console"
echo ""
