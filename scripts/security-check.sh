#!/bin/bash

# Security Check Script
# Run this before committing to ensure no API keys are exposed

echo "🔍 Checking for exposed API keys..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

has_issues=false

# Check 1: Verify .env is in .gitignore
echo "📋 Check 1: Verifying .env is in .gitignore..."
if grep -q "\.env[[:space:]]*$" .gitignore; then
    echo -e "${GREEN}✓ .env is in .gitignore${NC}"
else
    echo -e "${RED}✗ .env is NOT in .gitignore - Add it now!${NC}"
    has_issues=true
fi
echo ""

# Check 2: Verify build folder is in .gitignore
echo "📋 Check 2: Verifying build/ is in .gitignore..."
if grep -qE "(/build|^build)" .gitignore; then
    echo -e "${GREEN}✓ build/ is in .gitignore${NC}"
else
    echo -e "${YELLOW}⚠ build/ might not be in .gitignore${NC}"
fi
echo ""

# Check 3: Check for hardcoded API keys in source files
echo "📋 Check 3: Scanning for hardcoded API keys..."
if git grep -E "(AIza[0-9A-Za-z_-]{35}|sk_live_[0-9a-zA-Z]{24})" -- '*.js' '*.jsx' '*.ts' '*.tsx' ':!node_modules' > /dev/null 2>&1; then
    echo -e "${RED}✗ FOUND HARDCODED API KEYS:${NC}"
    git grep -E "(AIza[0-9A-Za-z_-]{35}|sk_live_[0-9a-zA-Z]{24})" -- '*.js' '*.jsx' '*.ts' '*.tsx' ':!node_modules'
    has_issues=true
else
    echo -e "${GREEN}✓ No hardcoded API keys found in source files${NC}"
fi
echo ""

# Check 4: Verify .env file is not staged
echo "📋 Check 4: Checking if .env is staged for commit..."
if git diff --cached --name-only | grep -q "^\.env$"; then
    echo -e "${RED}✗ .env file is staged! Unstage it immediately:${NC}"
    echo "   git reset HEAD .env"
    has_issues=true
else
    echo -e "${GREEN}✓ .env file is not staged${NC}"
fi
echo ""

# Check 5: Verify build folder is not staged
echo "📋 Check 5: Checking if build/ is staged for commit..."
if git diff --cached --name-only | grep -q "^build/"; then
    echo -e "${YELLOW}⚠ build/ folder is staged. Consider not committing build files:${NC}"
    echo "   git reset HEAD build/"
else
    echo -e "${GREEN}✓ build/ folder is not staged${NC}"
fi
echo ""

# Final result
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$has_issues" = true ]; then
    echo -e "${RED}❌ SECURITY ISSUES FOUND!${NC}"
    echo "Please fix the issues above before committing."
    exit 1
else
    echo -e "${GREEN}✅ All security checks passed!${NC}"
    echo "Safe to commit."
    exit 0
fi
