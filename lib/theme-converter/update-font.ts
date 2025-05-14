import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define types for font config
type FontWeight =
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';
type FontSubset =
  | 'latin'
  | 'latin-ext'
  | 'cyrillic'
  | 'cyrillic-ext'
  | 'greek'
  | 'greek-ext'
  | 'vietnamese';

interface FontConfig {
  weights: FontWeight[];
  subsets: FontSubset[];
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  style?: 'normal' | 'italic';
  variable?: boolean;
}

interface ContentJson {
  metadata: {
    fontFamily: string;
    title: string;
    description: string;
  };
  [key: string]: any;
}

// Font configurations for commonly used Google Fonts
const fontConfigurations: Record<string, FontConfig> = {
  Poppins: {
    weights: ['400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
  },
  Roboto: {
    weights: ['400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
  },
  Inter: {
    weights: ['400', '500', '600', '700'],
    subsets: ['latin'],
  },
  Manrope: {
    weights: ['400', '500', '600', '700'],
    subsets: ['latin'],
  },
  'Open Sans': {
    weights: ['400', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
  },
  Montserrat: {
    weights: ['400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
  },
  Lato: {
    weights: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
  },
  Quicksand: {
    weights: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
  },
  // Sans-serif fonts
  'Nunito Sans': {
    weights: ['300', '400', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
  },
  'Source Sans 3': {
    weights: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
  },
  Raleway: {
    weights: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
  },
  Ubuntu: {
    weights: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
  },
  Nunito: {
    weights: ['300', '400', '600', '700', '800'],
    subsets: ['latin'],
  },
  Rubik: {
    weights: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
  },
  // Serif fonts
  Merriweather: {
    weights: ['300', '400', '700', '900'],
    subsets: ['latin'],
    display: 'swap',
  },
  'Playfair Display': {
    weights: ['400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
  },
  Lora: {
    weights: ['400', '500', '600', '700'],
    subsets: ['latin'],
  },
  'Source Serif 4': {
    weights: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
  },
  // Display fonts
  Outfit: {
    weights: ['300', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
  },
  Oswald: {
    weights: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
  },
  'Abril Fatface': {
    weights: ['400'],
    subsets: ['latin'],
    display: 'swap',
  },
  Pacifico: {
    weights: ['400'],
    subsets: ['latin'],
    display: 'swap',
  },
  // Monospace fonts
  'Roboto Mono': {
    weights: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
  },
  'Source Code Pro': {
    weights: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
  },
  'JetBrains Mono': {
    weights: ['300', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
  },
  'Space Mono': {
    weights: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
  },
  // Handwriting fonts
  Caveat: {
    weights: ['400', '500', '600', '700'],
    subsets: ['latin'],
  },
  'Dancing Script': {
    weights: ['400', '500', '600', '700'],
    subsets: ['latin'],
  },
  'Indie Flower': {
    weights: ['400'],
    subsets: ['latin'],
    display: 'swap',
  },
  // Add more fonts as needed
};

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to the files
const contentJsonPath = path.join(process.cwd(), 'content.json');
const layoutTsxPath = path.join(process.cwd(), 'app', 'layout.tsx');
const globalsCssPath = path.join(process.cwd(), 'app', 'globals.css');

// Read content.json
const contentJson = JSON.parse(
  fs.readFileSync(contentJsonPath, 'utf8'),
) as ContentJson;
const fontFamily = contentJson.metadata.fontFamily;

if (!fontFamily) {
  console.error('No fontFamily found in content.json');
  process.exit(1);
}

console.log(`Found fontFamily: ${fontFamily}`);

// Get font configuration or use a default
const fontConfig: FontConfig = fontConfigurations[
  fontFamily as keyof typeof fontConfigurations
] || {
  weights: ['400'],
  subsets: ['latin'],
  display: 'swap',
};

console.log(`Using font configuration: ${JSON.stringify(fontConfig, null, 2)}`);

// Read layout.tsx
let layoutContent = fs.readFileSync(layoutTsxPath, 'utf8');

// Convert font family name to variable name
const fontVarName = fontFamily
  .toLowerCase()
  .replace(/\s+/g, '')
  .replace(/^(.)/, (match: string) => match.toLowerCase());

// Create a different name for the import to avoid naming conflicts
const fontImportName = `${fontVarName}Font`;

// Create font configuration string
const weightsArray = JSON.stringify(fontConfig.weights);
const subsetsArray = JSON.stringify(fontConfig.subsets);
let fontConfigString = `{ weight: ${weightsArray}, subsets: ${subsetsArray}`;

if (fontConfig.display) {
  fontConfigString += `, display: '${fontConfig.display}'`;
}

if (fontConfig.variable) {
  fontConfigString += `, variable: true`;
}

fontConfigString += ` }`;

// Update the font import - make the regex more robust to handle various import formats
const fontImportRegex =
  /import\s+{\s*([A-Za-z0-9_]+)(?:\s+as\s+([A-Za-z0-9_]+))?\s*}\s+from\s+['"]next\/font\/google['"];/;

// Always use the alias for consistency, regardless of whether the font has spaces
const newFontImport = `import { ${fontFamily.replace(/\s+/g, '_')} as ${fontImportName} } from 'next/font/google';`;

// Update font instance declaration
const fontInstanceRegex =
  /const\s+[a-zA-Z]+\s+=\s+[A-Za-z0-9_]+\(\s*{[\s\S]*?}\s*\);/;
const newFontInstance = `const ${fontVarName} = ${fontImportName}(${fontConfigString});`;

// Update font usage in className
const classNameRegex = /className={\s*`\${[a-zA-Z]+\.className}`\s*}/;
const classNameVarRegex = /\${([a-zA-Z]+)\.className}/;
const currentClassNameVar = layoutContent.match(classNameVarRegex)?.[1] || '';
const newClassName =
  layoutContent
    .match(classNameRegex)?.[0]
    .replace(currentClassNameVar, fontVarName) ||
  `className={\`\${${fontVarName}.className}\`}`;

// Update DynamicFavicon component if it exists
const dynamicFaviconRegex = /<DynamicFavicon\s+fontFamily=['"].*?['"]\s*\/>/;
const newDynamicFavicon = `<DynamicFavicon fontFamily='${fontFamily}' />`;

// Apply all updates
layoutContent = layoutContent.replace(fontImportRegex, newFontImport);
layoutContent = layoutContent.replace(fontInstanceRegex, newFontInstance);
layoutContent = layoutContent.replace(classNameRegex, newClassName);

// Only update the DynamicFavicon if it exists
if (dynamicFaviconRegex.test(layoutContent)) {
  layoutContent = layoutContent.replace(dynamicFaviconRegex, newDynamicFavicon);
}

// Write the updated content back to layout.tsx
fs.writeFileSync(layoutTsxPath, layoutContent);

console.log(
  `Updated layout.tsx to use ${fontFamily} font with configuration: ${fontConfigString}`,
);

// Now update the globals.css file
let globalsCssContent = fs.readFileSync(globalsCssPath, 'utf8');

// Create a proper font family string with fallbacks
const fontFallbacks = 'Arial, Helvetica, sans-serif';

// Use CSS variable approach for variable fonts
let fontFamilyString;
let cssVariableUpdate = '';

if (fontConfig.variable) {
  // If it's a variable font, we'll use CSS variable
  const cssVarName = `--font-${fontVarName}`;
  fontFamilyString = `var(${cssVarName}), ${fontFallbacks}`;

  // Add or update the CSS variable theme section
  if (!globalsCssContent.includes(`${cssVarName}:`)) {
    // Find the @theme inline section
    const themeInlineRegex = /@theme\s+inline\s+{([^}]*)}/;
    const themeInlineMatch = globalsCssContent.match(themeInlineRegex);

    if (themeInlineMatch) {
      const themeContent = themeInlineMatch[1];
      const updatedThemeContent =
        themeContent +
        `\n  ${cssVarName}: ${fontFamily.includes(' ') ? `'${fontFamily}'` : fontFamily};\n`;
      cssVariableUpdate = globalsCssContent.replace(
        themeContent,
        updatedThemeContent,
      );
    }
  }
} else {
  // For regular fonts, just use the font name directly
  fontFamilyString = fontFamily.includes(' ')
    ? `'${fontFamily}', ${fontFallbacks}`
    : `${fontFamily}, ${fontFallbacks}`;
}

// Find and replace the font-family declaration in globals.css
const fontFamilyRegex = /font-family:.*?;/;
const newFontFamily = `font-family: ${fontFamilyString};`;

globalsCssContent = globalsCssContent.replace(fontFamilyRegex, newFontFamily);

// Apply CSS variable update if needed
if (cssVariableUpdate) {
  globalsCssContent = cssVariableUpdate;
}

// Write the updated content back to globals.css
fs.writeFileSync(globalsCssPath, globalsCssContent);

console.log(
  `Updated globals.css to use ${fontFamily} font as default${fontConfig.variable ? ' with CSS variable' : ''}.`,
);
