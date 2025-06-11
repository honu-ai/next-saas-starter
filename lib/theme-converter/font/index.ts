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
  category?: 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting';
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
    category: 'sans-serif',
  },
  Roboto: {
    weights: ['400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    category: 'sans-serif',
  },
  Inter: {
    weights: ['400', '500', '600', '700'],
    subsets: ['latin'],
    category: 'sans-serif',
  },
  Manrope: {
    weights: ['400', '500', '600', '700'],
    subsets: ['latin'],
    category: 'sans-serif',
  },
  'Open Sans': {
    weights: ['400', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    category: 'sans-serif',
  },
  Montserrat: {
    weights: ['400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    category: 'sans-serif',
  },
  Lato: {
    weights: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
    category: 'sans-serif',
  },
  Quicksand: {
    weights: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    category: 'sans-serif',
  },
  'Nunito Sans': {
    weights: ['300', '400', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    category: 'sans-serif',
  },
  'Source Sans 3': {
    weights: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    category: 'sans-serif',
  },
  Raleway: {
    weights: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    category: 'sans-serif',
  },
  Ubuntu: {
    weights: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    category: 'sans-serif',
  },
  Nunito: {
    weights: ['300', '400', '600', '700', '800'],
    subsets: ['latin'],
    category: 'sans-serif',
  },
  Rubik: {
    weights: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    category: 'sans-serif',
  },
  Merriweather: {
    weights: ['300', '400', '700', '900'],
    subsets: ['latin'],
    display: 'swap',
    category: 'serif',
  },
  'Playfair Display': {
    weights: ['400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
    category: 'serif',
  },
  Lora: {
    weights: ['400', '500', '600', '700'],
    subsets: ['latin'],
    category: 'serif',
  },
  'Source Serif 4': {
    weights: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    category: 'serif',
  },
  Outfit: {
    weights: ['300', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
    category: 'sans-serif',
  },
  Oswald: {
    weights: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    category: 'sans-serif',
  },
  'Abril Fatface': {
    weights: ['400'],
    subsets: ['latin'],
    display: 'swap',
    category: 'display',
  },
  Pacifico: {
    weights: ['400'],
    subsets: ['latin'],
    display: 'swap',
    category: 'handwriting',
  },
  'Roboto Mono': {
    weights: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    category: 'monospace',
  },
  'Source Code Pro': {
    weights: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    category: 'monospace',
  },
  'JetBrains Mono': {
    weights: ['300', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
    category: 'monospace',
  },
  'Space Mono': {
    weights: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
    category: 'monospace',
  },
  Caveat: {
    weights: ['400', '500', '600', '700'],
    subsets: ['latin'],
    category: 'handwriting',
  },
  'Dancing Script': {
    weights: ['400', '500', '600', '700'],
    subsets: ['latin'],
    category: 'handwriting',
  },
  'Indie Flower': {
    weights: ['400'],
    subsets: ['latin'],
    display: 'swap',
    category: 'handwriting',
  },
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

// Font type classification
type FontType = 'sans' | 'serif' | 'mono';

// Default fallbacks for each font type
const fontFallbacks: Record<FontType, string> = {
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif',
  serif: 'Georgia, Cambria, Times New Roman, Times, serif',
  mono: 'SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
};

// Function to determine font type from Google Fonts category
const getFontType = (fontFamily: string): FontType => {
  // First check if we have a configuration for this font
  const fontConfig =
    fontConfigurations[fontFamily as keyof typeof fontConfigurations];

  if (!fontConfig) {
    console.warn(
      `No configuration found for font "${fontFamily}", defaulting to sans-serif`,
    );
    return 'sans';
  }

  // Check if the font has a category specified in its configuration
  if (fontConfig.category) {
    switch (fontConfig.category) {
      case 'serif':
        return 'serif';
      case 'monospace':
        return 'mono';
      case 'display':
        // Display fonts are typically decorative serif fonts
        console.log('Display font detected, mapping to serif font type');
        return 'serif';
      case 'handwriting':
        // Handwriting fonts are typically flowing, sans-serif-like fonts
        console.log(
          'Handwriting font detected, mapping to sans-serif font type',
        );
        return 'sans';
      case 'sans-serif':
      default:
        return 'sans';
    }
  }

  // If no category is specified, make an educated guess based on the font name
  if (
    fontFamily.toLowerCase().includes('mono') ||
    fontFamily.toLowerCase().includes('code')
  ) {
    return 'mono';
  }

  if (fontFamily.toLowerCase().includes('serif')) {
    // Check if it's specifically "sans-serif"
    return fontFamily.toLowerCase().includes('sans') ? 'sans' : 'serif';
  }

  // Default to sans-serif as it's the most common type
  return 'sans';
};

// Function to format font family string
const formatFontFamily = (font: string, fallbacks: string) => {
  return font.includes(' ')
    ? `'${font}', ${fallbacks}`
    : `${font}, ${fallbacks}`;
};

// Update font variables in both :root and .dark sections
const updateFontVariables = (content: string) => {
  const fontType = getFontType(fontFamily);
  const fontFallback = fontFallbacks[fontType];
  const formattedFont = formatFontFamily(fontFamily, fontFallback);

  // Log the font mapping for transparency
  const fontConfig =
    fontConfigurations[fontFamily as keyof typeof fontConfigurations];
  if (
    fontConfig?.category &&
    (fontConfig.category === 'display' || fontConfig.category === 'handwriting')
  ) {
    console.log(
      `Mapping ${fontConfig.category} font "${fontFamily}" to ${fontType} font type in CSS variables`,
    );
  }

  // Create regex patterns for each font type
  const fontVarRegexes = {
    sans: /(--font-sans:\s*)([^;]+)(;)/g,
    serif: /(--font-serif:\s*)([^;]+)(;)/g,
    mono: /(--font-mono:\s*)([^;]+)(;)/g,
  };

  // First, remove the unused font type variables from both @theme inline and root sections
  const unusedTypes = Object.keys(fontVarRegexes).filter(
    (type) => type !== fontType,
  ) as FontType[];

  // Remove from @theme inline section
  const themeInlineRegex = /@theme\s+inline\s*{([^}]*)}/;
  content = content.replace(themeInlineRegex, (match, themeContent) => {
    let updatedThemeContent = themeContent;
    unusedTypes.forEach((type) => {
      const varRegex = new RegExp(`\\s*--font-${type}:[^;]+;`, 'g');
      updatedThemeContent = updatedThemeContent.replace(varRegex, '');
    });
    return `@theme inline {${updatedThemeContent}}`;
  });

  // Remove from :root and .dark sections
  unusedTypes.forEach((type) => {
    const varRegex = new RegExp(`\\s*--font-${type}:[^;]+;`, 'g');
    content = content.replace(varRegex, '');
  });

  // Update the selected font type
  const targetRegex = fontVarRegexes[fontType];
  content = content.replace(targetRegex, `$1${formattedFont}$3`);

  return content;
};

// Apply the font updates
globalsCssContent = updateFontVariables(globalsCssContent);

// Write the updated content back to globals.css
fs.writeFileSync(globalsCssPath, globalsCssContent);

console.log(
  `Updated globals.css to use ${fontFamily} as the ${getFontType(fontFamily)} font and removed unused font types.`,
);
