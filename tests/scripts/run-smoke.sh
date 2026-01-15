#!/bin/bash
# =============================================================================
# Smoke Tests Execution Script
# =============================================================================
# PURPOSE: Run critical path tests (~2 minutes)
# WHEN: On every commit, before push
# WHAT: Tests tagged with @smoke - absolutely must pass
# =============================================================================

set -e  # Exit on error

echo "🔥 Running Smoke Tests..."
echo "================================"
echo "Duration: ~2 minutes"
echo "Purpose: Critical path validation"
echo "================================"
echo ""

# Navigate to tests environment directory
cd "$(dirname "$0")/../test-envs"

# Run unit tests with @smoke tag
echo "📦 Unit tests (@smoke)..."
npm run test:unit -- --testNamePattern="@smoke" --bail || exit 1

# Run critical E2E tests
echo "🌐 E2E tests (@smoke @critical)..."
npx playwright test --grep "@smoke" --grep "@critical" || exit 1

echo ""
echo "✅ Smoke tests passed!"
echo "Safe to commit and push."
