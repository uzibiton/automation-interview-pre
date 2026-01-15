#!/bin/bash
# =============================================================================
# Nightly Test Suite Execution Script
# =============================================================================
# PURPOSE: Run comprehensive test suite including non-functional (~2 hours)
# WHEN: Scheduled nightly (2 AM)
# WHAT: All tests + performance + security + visual regression
# =============================================================================

set -e

echo "🌙 Running Nightly Test Suite..."
echo "================================"
echo "Duration: ~2 hours"
echo "Purpose: Comprehensive validation"
echo "================================"
echo ""

cd "$(dirname "$0")/../test-envs"

# Run full regression suite first
echo "Running regression suite..."
../scripts/run-regression.sh || exit 1

echo ""
echo "Running non-functional tests..."
echo "================================"

# Visual regression tests
echo "📸 Visual regression tests..."
npm run test:visual || exit 1

# Performance tests
echo "⚡ Performance tests (K6)..."
npm run test:performance || exit 1

# Security tests
echo "🔒 Security tests (OWASP ZAP)..."
npm run test:security || exit 1

# Accessibility tests
echo "♿ Accessibility tests..."
npm run test:accessibility || exit 1

# Generate comprehensive reports
echo ""
echo "Generating reports..."
echo "================================"

# Coverage report
npm run test:coverage:report || true

# Allure report
npm run report:allure || true

echo ""
echo "✅ Nightly suite complete!"
echo "Check reports for detailed results."
