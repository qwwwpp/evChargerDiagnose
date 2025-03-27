#!/bin/bash

# GitHub Repository Setup Script
# This script helps connect your Replit project to a GitHub repository

echo "=========================================================="
echo "       GitHub Repository Setup for Replit Project         "
echo "=========================================================="
echo ""

# Check if git is already initialized
if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init
  echo "Git repository initialized."
  echo ""
else
  echo "Git repository already initialized."
  echo ""
fi

# Ask for GitHub username and repository name
echo "Please enter your GitHub username:"
read github_username

echo "Please enter the name for your GitHub repository:"
read repo_name

echo ""
echo "You'll need to create a new repository on GitHub:"
echo "1. Go to https://github.com/new"
echo "2. Enter '$repo_name' as the repository name"
echo "3. Do NOT initialize with README, .gitignore, or license"
echo "4. Click 'Create repository'"
echo ""
echo "Press Enter when you've created the repository on GitHub..."
read

# Check if there are any uncommitted changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
  echo "You have uncommitted changes. Let's commit them first."
  
  # Add all files
  git add .
  
  echo "Enter a commit message (e.g., 'Initial commit'):"
  read commit_message
  
  # Commit the changes
  git commit -m "$commit_message"
  echo "Changes committed."
  echo ""
fi

# Set up GitHub remote
echo "Setting up GitHub remote..."
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/$github_username/$repo_name.git"
echo "GitHub remote set up."
echo ""

echo "You'll need a GitHub Personal Access Token to push your code."
echo "1. Go to https://github.com/settings/tokens"
echo "2. Click 'Generate new token' (classic)"
echo "3. Give it a name like 'Replit access'"
echo "4. Select the 'repo' scope (gives full control of repositories)"
echo "5. Click 'Generate token'"
echo "6. Copy the generated token (you'll only see it once!)"
echo ""
echo "Enter your GitHub Personal Access Token:"
read -s github_token
echo ""

# Set up GitHub credentials
git config credential.helper store
git config --global user.name "$github_username"
echo "Enter your GitHub email address:"
read github_email
git config --global user.email "$github_email"

# Create a temporary credential helper
echo "https://$github_username:$github_token@github.com" > ~/.git-credentials
chmod 600 ~/.git-credentials

# Set the remote URL with embedded token for the push
git remote set-url origin "https://$github_username:$github_token@github.com/$github_username/$repo_name.git"

# Push to GitHub
echo "Pushing your code to GitHub..."
if ! (git push -u origin main || git push -u origin master); then
  echo ""
  echo "=========================================================="
  echo "                     PUSH FAILED                          "
  echo "=========================================================="
  echo ""
  echo "Failed to push to GitHub. This could be due to:"
  echo "1. The repository name is incorrect"
  echo "2. Your GitHub token doesn't have the right permissions"
  echo "3. You don't have write access to the repository"
  echo ""
  echo "Possible solutions:"
  echo "- Make sure your token has the 'repo' scope"
  echo "- Check that the repository name is correct (including case)"
  echo "- Ensure you're using the owner's username if it's not your repo"
  echo "- Try creating a new token at https://github.com/settings/tokens"
  echo ""
  echo "Do you want to try with a different token? (y/n)"
  read retry_token
  
  if [ "$retry_token" = "y" ] || [ "$retry_token" = "Y" ]; then
    echo "Enter your new GitHub Personal Access Token:"
    read -s github_token
    echo ""
    
    # Update the remote URL with the new token
    git remote set-url origin "https://$github_username:$github_token@github.com/$github_username/$repo_name.git"
    
    echo "Trying to push again..."
    git push -u origin main || git push -u origin master
  fi
else
  echo "Push successful!"
fi

# Reset the remote URL to the regular form (without token)
git remote set-url origin "https://github.com/$github_username/$repo_name.git"

# Cleanup: remove temporary credential helper
rm ~/.git-credentials

echo ""
echo "=========================================================="
echo "          Repository setup complete!                      "
echo "=========================================================="
echo ""
echo "Your code is now available on GitHub at:"
echo "https://github.com/$github_username/$repo_name"
echo ""
echo "Next time you want to push changes, simply run:"
echo "git add ."
echo "git commit -m \"Your commit message\""
echo "git push"
echo ""