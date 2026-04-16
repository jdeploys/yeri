#!/bin/bash
set -e

SRC_DIR="$(dirname "$0")/src"
DIST_DIR="$(dirname "$0")/dist"

mkdir -p "$DIST_DIR"

# CSS, JS 복사
cp "$SRC_DIR/style.css" "$DIST_DIR/style.css"
cp "$SRC_DIR/script.js" "$DIST_DIR/script.js"

# HTML: src/index.html 내용을 full HTML로 래핑
cat > "$DIST_DIR/index.html" <<'HEADER'
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>오이시</title>
    <link rel="stylesheet" href="./style.css">
  </head>
  <body>
HEADER

cat "$SRC_DIR/index.html" >> "$DIST_DIR/index.html"

cat >> "$DIST_DIR/index.html" <<'FOOTER'

    <script src="./script.js"></script>
  </body>
</html>
FOOTER

echo "Build complete → $DIST_DIR"
