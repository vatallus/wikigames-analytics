#!/usr/bin/env node
/**
 * Generate OG Image (PNG) from SVG
 * Run: node scripts/generate-og-image.js
 */

const fs = require('fs');
const path = require('path');

// For now, we'll create instructions since we can't install packages mid-deployment
console.log('📸 OG Image Generation Guide');
console.log('');
console.log('Option 1: Online Converter (Fastest)');
console.log('1. Go to https://cloudconvert.com/svg-to-png');
console.log('2. Upload public/og-image.svg');
console.log('3. Set width to 1200px');
console.log('4. Convert and download as og-image.png');
console.log('5. Place in public/og-image.png');
console.log('');
console.log('Option 2: Using Inkscape (Best Quality)');
console.log('1. Install Inkscape: https://inkscape.org/');
console.log('2. Run: inkscape public/og-image.svg --export-filename=public/og-image.png --export-width=1200');
console.log('');
console.log('Option 3: Using ImageMagick');
console.log('1. Install ImageMagick: brew install imagemagick');
console.log('2. Run: convert -background none -density 300 public/og-image.svg public/og-image.png');
console.log('');
console.log('Option 4: Use Vercel OG Image Generation');
console.log('Create an API route that generates images dynamically!');
console.log('');

// Check if SVG exists
const svgPath = path.join(__dirname, '../public/og-image.svg');
if (fs.existsSync(svgPath)) {
  console.log('✅ SVG file found at:', svgPath);
} else {
  console.log('❌ SVG file not found!');
}

console.log('');
console.log('Alternative: Use Vercel\'s OG Image API');
console.log('URL: https://og-image.vercel.app/**WikiGames**.png?theme=dark&md=1&fontSize=100px');
console.log('This generates images on-the-fly!');
