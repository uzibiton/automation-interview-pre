#!/bin/bash
# =============================================================================
# Sanity Tests Execution Script
# =============================================================================
# PURPOSE: Run basic functionality tests (~5 minutes)
# WHEN: On pull request, before code review
# WHAT: Tests tagged with @sanity - verifies basic features work
# =============================================================================

set -e

echo "🧪 Running Sanity Tests..."
echo "================================"
echo "Duration: ~5 minutes"
echo "Purpose: Basic functionality check"
echo "================================"
echo ""

cd "$(dirname "$0")/../test-envs"

# Component tests
echo "⚛️  Component tests (@sanity)..."
npm run test:component -- --testNamePattern="@sanity" || exit 1

# Integration tests
echo "🔗 Integration tests (@sanity)..."
npm run test:integration -- --testNamePattern="@sanity" || exit 1

# E2E sanity tests
echo "🌐 E2E tests (@sanity)..."
npx playwright test --grep "@sanity" || exit 1

echo ""
echo "✅ Sanity tests passed!"
echo "Ready for code review."
