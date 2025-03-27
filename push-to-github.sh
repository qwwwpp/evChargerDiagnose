#!/bin/bash

# Simple script to push code to GitHub with a token

echo "=========================================================="
echo "               Push to GitHub with Token                  "
echo "=========================================================="
echo ""

# Ask for GitHub username and repository name
echo "Please enter your GitHub username:"
read github_username

echo "Please enter your repository name (e.g., 'evChargerDiagnose'):"
read repo_name

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

# Set the remote URL with embedded token for the push
git remote set-url origin "https://$github_username:$github_token@github.com/$github_username/$repo_name.git"

# Push to GitHub
echo "Pushing your code to GitHub..."
if ! git push; then
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
else
  echo "Push successful!"
fi

# Reset the remote URL to the regular form (without token)
git remote set-url origin "https://github.com/$github_username/$repo_name.git"

echo ""
echo "Script completed."
echo ""