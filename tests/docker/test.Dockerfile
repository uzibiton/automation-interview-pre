# =============================================================================
# Multi-Stage Testing Dockerfile
# =============================================================================
# ARCHITECTURE EXPLANATION (for interviews):
# This Dockerfile uses multi-stage builds to create an efficient testing environment.
# Each stage serves a specific purpose in the testing pipeline.
#
# WHY THIS APPROACH:
# 1. Separates dependencies from test execution
# 2. Allows caching of npm/pip installs for faster rebuilds
# 3. Supports both TypeScript and Python testing tools
# 4. Can be used in CI/CD with different target stages
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Base Node.js Environment
# -----------------------------------------------------------------------------
# PURPOSE: Install Node.js dependencies needed for TypeScript tests
# INCLUDES: Jest, Playwright, Cucumber, Testing Library, etc.
FROM node:18-alpine AS node-base

WORKDIR /app

# Copy package files for dependency installation
COPY tests/package.json tests/package-lock.json* ./

# Set environment variable to skip Playwright browser installation during npm ci
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Install Node.js testing dependencies
# --production=false ensures dev dependencies are installed
# --ignore-scripts skips the "install" script that tries to install Playwright browsers
RUN npm ci --production=false --ignore-scripts

# -----------------------------------------------------------------------------
# Stage 2: Python Environment Setup
# -----------------------------------------------------------------------------
# PURPOSE: Add Python for security testing (OWASP ZAP), performance (Locust), 
#          and ML-based visual testing
# WHY PYTHON: Some testing tools are Python-native and provide better features
FROM node-base AS python-base

# Install Python, pip, and build dependencies for Python packages
# Build dependencies needed for opencv-python and other packages with native extensions
RUN apk add --no-cache \
    python3 \
    py3-pip \
    python3-dev \
    g++ \
    gcc \
    musl-dev \
    linux-headers \
    make

# Copy Python requirements
COPY tests/config/requirements.txt ./

# Create and activate virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Upgrade pip and install build tools
RUN pip install --upgrade pip setuptools wheel

# Install Python testing dependencies in virtual environment
RUN pip install --no-cache-dir -r requirements.txt

# -----------------------------------------------------------------------------
# Stage 3: Browser Installation for E2E Tests
# -----------------------------------------------------------------------------
# PURPOSE: Install Playwright browsers for E2E and visual testing
# NOTE: This stage is heavier (~500MB) but necessary for UI testing
FROM python-base AS browser-base

# Install Playwright browsers (without --with-deps since Alpine uses apk not apt)
# For full E2E testing, consider switching to Debian-based image
RUN npx playwright install chromium

# -----------------------------------------------------------------------------
# Stage 4: Final Testing Environment
# -----------------------------------------------------------------------------
# PURPOSE: Complete test environment ready to run all test types
# VOLUME MOUNTS (defined in docker-compose.test.yml):
#   - /app/src -> Application source code
#   - /app/services -> Backend services code
#   - /app/frontend/src -> Frontend source code  
#   - /app/tests -> Test files
FROM browser-base AS test

WORKDIR /app

# Copy test configurations
COPY tests/config/*.config.js tests/config/*.config.ts tests/config/*.ini ./config/

# Copy test scripts
COPY tests/scripts/*.sh ./scripts/
RUN chmod +x ./scripts/*.sh

# Set environment variables for testing
ENV NODE_ENV=test
ENV CI=true

# Default command runs smoke tests (fastest subset)
# Can be overridden in docker-compose or CLI
CMD ["npm", "run", "test:smoke"]

# =============================================================================
# USAGE EXAMPLES (for your interview demo):
# =============================================================================
#
# Build for specific test stage:
#   docker build --target test -t expense-tests:latest -f tests/docker/test.Dockerfile .
#
# Run specific test suite:
#   docker run expense-tests npm run test:unit
#   docker run expense-tests npm run test:e2e
#   docker run expense-tests npm run test:regression
#
# Run with docker-compose (recommended):
#   docker-compose -f tests/docker/docker-compose.test.yml up
#
# =============================================================================
# TODO: When test execution time exceeds 10 minutes, split into:
#   - test-unit.Dockerfile (fast, no browsers, ~2 min)
#   - test-integration.Dockerfile (medium, with DB, ~5 min)
#   - test-e2e.Dockerfile (slow, with browsers, ~15 min)
# =============================================================================
