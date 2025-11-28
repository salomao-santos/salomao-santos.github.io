#!/bin/bash
# Build script for production deployment
# This script minifies CSS and JavaScript files for optimal performance

set -e  # Exit on error

echo "🚀 Building production assets..."

# Check if required tools are installed
if ! command -v csso &> /dev/null; then
    echo "⚠️  csso not found. Install with: npm install -g csso-cli"
    exit 1
fi

if ! command -v terser &> /dev/null; then
    echo "⚠️  terser not found. Install with: npm install -g terser"
    exit 1
fi

# Define paths
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CSS_DIR="$BASE_DIR/assets/css"
JS_DIR="$BASE_DIR/assets/js"

echo "📁 Base directory: $BASE_DIR"

# Minify CSS files
echo ""
echo "🎨 Minifying CSS files..."
csso "$CSS_DIR/core.css" -o "$CSS_DIR/core.min.css"
echo "   ✓ core.css → core.min.css"

csso "$CSS_DIR/components.css" -o "$CSS_DIR/components.min.css"
echo "   ✓ components.css → components.min.css"

# Minify JavaScript files
echo ""
echo "⚡ Minifying JavaScript files..."
terser "$JS_DIR/i18n.js" -o "$JS_DIR/i18n.min.js" -c -m --comments false
echo "   ✓ i18n.js → i18n.min.js"

terser "$JS_DIR/core.js" -o "$JS_DIR/core.min.js" -c -m --comments false
echo "   ✓ core.js → core.min.js"

# Calculate savings
echo ""
echo "📊 Compression Report:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for file in "$CSS_DIR/core" "$CSS_DIR/components" "$JS_DIR/i18n" "$JS_DIR/core"; do
    original_size=$(stat -f%z "$file.css" 2>/dev/null || stat -c%s "$file.css" 2>/dev/null || stat -f%z "$file.js" 2>/dev/null || stat -c%s "$file.js" 2>/dev/null)
    minified_size=$(stat -f%z "$file.min.css" 2>/dev/null || stat -c%s "$file.min.css" 2>/dev/null || stat -f%z "$file.min.js" 2>/dev/null || stat -c%s "$file.min.js" 2>/dev/null)
    savings=$((100 - (minified_size * 100 / original_size)))
    
    filename=$(basename "$file")
    printf "%-20s: %6d bytes → %6d bytes (%2d%% saved)\n" \
        "$filename" "$original_size" "$minified_size" "$savings"
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Update index.html to use .min.css and .min.js files"
echo "   2. Test locally: python3 -m http.server 8000"
echo "   3. Run Lighthouse audit"
echo "   4. Deploy to GitHub Pages"
