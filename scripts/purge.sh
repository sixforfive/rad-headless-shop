#!/bin/bash
#
# Functions:
#   main()        - loops over FILES, calls purge_file for each
#   purge_file()  - curls the jsDelivr purge URL for one file path
#
# Usage: ./scripts/purge.sh
# Edit REPO, BRANCH, and FILES below when paths change.

REPO="sixforfive/rad-headless-shop"
BRANCH="main"

FILES=(
  "css/global.css"
  "js/global.js"
  "js/shop-gallery.js"
  "js/shop-list.js"
  "js/product.js"
  "js/merch.js"
  "js/faq.js"
  "js/cart.js"
  "js/shopify.js"
)

purge_file() {
  local path="$1"
  local url="https://purge.jsdelivr.net/gh/${REPO}@${BRANCH}/${path}"
  echo "Purging: $path"
  curl -s -o /dev/null -w "  status: %{http_code}\n" "$url"
}

main() {
  for f in "${FILES[@]}"; do
    purge_file "$f"
  done
}

main