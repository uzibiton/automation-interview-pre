#!/bin/sh

# Generate runtime config for frontend
cat > /usr/share/nginx/html/config.js << EOF
window.ENV = {
  VITE_AUTH_SERVICE_URL: "${VITE_AUTH_SERVICE_URL}",
  VITE_API_SERVICE_URL: "${VITE_API_SERVICE_URL}",
  VITE_GOOGLE_CLIENT_ID: "${VITE_GOOGLE_CLIENT_ID}"
};
EOF

# Start nginx
nginx -g "daemon off;"
