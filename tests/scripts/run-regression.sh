#!/bin/bash
# =============================================================================
# Regression Tests Execution Script
# =============================================================================
# PURPOSE: Run full functional test suite (~30 minutes)
# WHEN: Before merge to main branch
# WHAT: All unit, component, integration, contract, and E2E tests
# =============================================================================

set -e

echo "🔄 Running Regression Test Suite..."
echo "================================"
echo "Duration: ~30 minutes"
echo "Purpose: Full feature validation"
echo "================================"
echo ""

cd "$(dirname "$0")/../config"

# Unit tests
echo "📦 Unit tests (all)..."
npm run test:unit || exit 1

# Component tests
echo "⚛️  Component tests (all)..."
npm run test:component || exit 1

# Integration tests
echo "🔗 Integration tests (all)..."
npm run test:integration || exit 1

# Contract tests
echo "🤝 Contract tests (all)..."
npm run test:contract || exit 1

# E2E tests
echo "🌐 E2E tests (all)..."
npx playwright test || exit 1

# Cucumber BDD tests
echo "🥒 Cucumber BDD tests..."
npm run test:cucumber || exit 1

echo ""
echo "✅ Regression suite passed!"
echo "Safe to merge to main branch."
