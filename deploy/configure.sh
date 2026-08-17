#!/bin/sh
set -eu

api_base_url="${OKOSCOPE_API_BASE_URL:-/}"

case "$api_base_url" in
  /*) ;;
  http://*|https://*) ;;
  *) echo "OKOSCOPE_API_BASE_URL must be a same-origin path or absolute HTTP(S) URL" >&2; exit 1 ;;
esac

case "$api_base_url" in
  *"\\"*|*\"*|*\'*|*" "*|*://*@*) echo "OKOSCOPE_API_BASE_URL contains unsafe characters or credentials" >&2; exit 1 ;;
esac

rm -rf /tmp/okoscope-web
mkdir -p /tmp/okoscope-web
cp -R /opt/okoscope/dist/. /tmp/okoscope-web/
printf 'window.__OKOSCOPE_CONFIG__ = { apiBaseUrl: "%s" };\n' "$api_base_url" > /tmp/okoscope-web/config.js

exec "$@"
