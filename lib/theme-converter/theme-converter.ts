#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// Save this file also as theme-converter.js for direct Node execution
// For JavaScript version, remove TypeScript types

type ColorSet = {
  primary: string;
  success: string;
  warning: string;
  destructive: string;
  neutral: string;
  [key: string]: string;
};

type ThemeVariables = {
  light: Record<string, string>;
  dark: Record<string, string>;
};

type ContentJson = {
  metadata: {
    colors: ColorSet;
    [key: string]: any;
  };
  [key: string]: any;
};

/**
 * Loads colors from content.json if it exists
 * @returns {ColorSet | null} Colors from content.json or null if file doesn't exist
 */
function loadColorsFromContentJson(): ColorSet | null {
  try {
    // Try first in the root directory
    let contentPath = path.resolve('./content.json');

    if (!fs.existsSync(contentPath)) {
      // Then try in public directory
      contentPath = path.resolve('./public/content.json');
      if (!fs.existsSync(contentPath)) {
        return null;
      }
    }

    const content = fs.readFileSync(contentPath, 'utf8');
    const contentJson = JSON.parse(content) as ContentJson;

    if (contentJson.metadata && contentJson.metadata.colors) {
      return contentJson.metadata.colors;
    }

    return null;
  } catch (error) {
    console.error('Error loading colors from content.json:', error);
    return null;
  }
}

/**
 * Converts a hex color to OKLCH format as used by Tailwind CSS v4
 * @param {string} hex - Hex color code (e.g., "#60ACFF")
 * @returns {string} OKLCH values formatted as "oklch(L C H)" (e.g., "oklch(70% 0.1 270deg)")
 */
function hexToOKLCH(hex: string): string {
  // This is a simplified conversion to OKLCH
  // In a real implementation, this would use a color conversion library

  // Remove the # if present
  hex = hex.replace(/^#/, '');

  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Simple conversion to lightness (this is an approximation)
  const lightness = 0.299 * r + 0.587 * g + 0.114 * b;

  // Calculate chroma (based on distance from gray axis)
  const maxChannel = Math.max(r, g, b);
  const minChannel = Math.min(r, g, b);
  const chroma = maxChannel - minChannel;

  // Calculate hue
  let hue = 0;
  if (chroma !== 0) {
    if (maxChannel === r) {
      hue = ((g - b) / chroma) % 6;
    } else if (maxChannel === g) {
      hue = (b - r) / chroma + 2;
    } else {
      hue = (r - g) / chroma + 4;
    }
    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;
  }

  // Convert to OKLCH format
  // Note: This is a simplified conversion and not colorimetrically accurate
  return `oklch(${Math.round(lightness * 100)}% ${chroma.toFixed(3)} ${hue}deg)`;
}

/**
 * Determines if a color is light or dark to choose appropriate foreground color
 * @param {string} hex - Hex color code
 * @returns {boolean} - True if the color is light
 */
function isLightColor(hex: string): boolean {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate perceived brightness (YIQ formula)
  return (r * 299 + g * 587 + b * 114) / 1000 >= 128;
}

/**
 * Darkens a hex color by the specified percentage
 * @param {string} hex - Hex color code
 * @param {number} percent - Percentage to darken by (0-100)
 * @returns {string} - Darkened hex color
 */
function darkenColor(hex: string, percent: number): string {
  hex = hex.replace(/^#/, '');

  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  r = Math.floor(r * (1 - percent / 100));
  g = Math.floor(g * (1 - percent / 100));
  b = Math.floor(b * (1 - percent / 100));

  const rHex = r.toString(16).padStart(2, '0');
  const gHex = g.toString(16).padStart(2, '0');
  const bHex = b.toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}

/**
 * Generates theme variables for the given colors
 * @param {Object} colors - Object containing color hex values
 * @param {string} radius - Border radius for the theme
 * @returns {Object} - Object with CSS variable values for light and dark modes
 */
function generateThemeVariables(
  colors: ColorSet,
  radius: string = '0.625rem',
): ThemeVariables {
  const {
    primary = '#60ACFF',
    success = '#1FCCB1',
    warning = '#FFBF45',
    destructive = '#F35B5A',
    neutral = '#8F95B2',
  } = colors;

  // Calculate foreground colors based on contrast
  const primaryForeground = isLightColor(primary)
    ? 'oklch(14.5% 0 0deg)'
    : 'oklch(98.5% 0 0deg)';
  const successForeground = isLightColor(success)
    ? 'oklch(14.5% 0 0deg)'
    : 'oklch(98.5% 0 0deg)';
  const warningForeground = isLightColor(warning)
    ? 'oklch(14.5% 0 0deg)'
    : 'oklch(98.5% 0 0deg)';
  const destructiveForeground = isLightColor(destructive)
    ? 'oklch(14.5% 0 0deg)'
    : 'oklch(98.5% 0 0deg)';
  const neutralForeground = isLightColor(neutral)
    ? 'oklch(14.5% 0 0deg)'
    : 'oklch(98.5% 0 0deg)';

  // Create dark mode variants
  const darkPrimary = darkenColor(primary, 20);
  const darkSuccess = darkenColor(success, 20);
  const darkWarning = darkenColor(warning, 20);
  const darkDestructive = darkenColor(destructive, 20);
  const darkNeutral = darkenColor(neutral, 20);

  // -------------------------------------------------------
  // LIGHT THEME COLOR CALCULATIONS
  // -------------------------------------------------------

  // Basic theme colors
  const lightBackground = 'oklch(100% 0 0deg)';
  const lightForeground = 'oklch(14.5% 0 0deg)';
  const lightCard = 'oklch(100% 0 0deg)';
  const lightCardForeground = 'oklch(14.5% 0 0deg)';
  const lightPopover = 'oklch(100% 0 0deg)';
  const lightPopoverForeground = 'oklch(14.5% 0 0deg)';
  const lightSecondary = 'oklch(97% 0 0deg)';
  const lightSecondaryForeground = 'oklch(20.5% 0 0deg)';
  const lightMuted = 'oklch(97% 0 0deg)';
  const lightMutedForeground = 'oklch(55.6% 0 0deg)';
  const lightAccent = 'oklch(97% 0 0deg)';
  const lightAccentForeground = 'oklch(20.5% 0 0deg)';
  const lightBorder = 'oklch(92.2% 0 0deg)';
  const lightInput = 'oklch(92.2% 0 0deg)';
  const lightRing = 'oklch(70.8% 0 0deg)';

  // Chart colors
  const lightChart1 = hexToOKLCH(primary);
  const lightChart2 = 'oklch(60% 0.118 184.704deg)';
  const lightChart3 = 'oklch(39.8% 0.07 227.392deg)';
  const lightChart4 = 'oklch(82.8% 0.189 84.429deg)';
  const lightChart5 = 'oklch(76.9% 0.188 70.08deg)';

  // Sidebar colors
  const lightSidebar = 'oklch(98.5% 0 0deg)';
  const lightSidebarForeground = 'oklch(14.5% 0 0deg)';
  const lightSidebarPrimary = 'oklch(20.5% 0 0deg)';
  const lightSidebarPrimaryForeground = 'oklch(98.5% 0 0deg)';
  const lightSidebarAccent = 'oklch(97% 0 0deg)';
  const lightSidebarAccentForeground = 'oklch(20.5% 0 0deg)';
  const lightSidebarBorder = 'oklch(92.2% 0 0deg)';
  const lightSidebarRing = hexToOKLCH(primary);

  // -------------------------------------------------------
  // DARK THEME COLOR CALCULATIONS
  // -------------------------------------------------------

  const darkBackground = 'oklch(14.5% 0 0deg)';
  const darkForeground = 'oklch(98.5% 0 0deg)';
  const darkCard = 'oklch(20.5% 0 0deg)';
  const darkCardForeground = 'oklch(98.5% 0 0deg)';
  const darkPopover = 'oklch(20.5% 0 0deg)';
  const darkPopoverForeground = 'oklch(98.5% 0 0deg)';
  const darkSecondary = 'oklch(26.9% 0 0deg)';
  const darkSecondaryForeground = 'oklch(98.5% 0 0deg)';
  const darkMuted = 'oklch(26.9% 0 0deg)';
  const darkMutedForeground = 'oklch(70.8% 0 0deg)';
  const darkAccent = 'oklch(26.9% 0 0deg)';
  const darkAccentForeground = 'oklch(98.5% 0 0deg)';
  const darkBorder = 'oklch(100% 0 0deg / 10%)';
  const darkInput = 'oklch(100% 0 0deg / 15%)';
  const darkRing = 'oklch(55.6% 0 0deg)';

  // Chart colors
  const darkChart1 = 'oklch(48.8% 0.243 264.376deg)';
  const darkChart2 = 'oklch(69.6% 0.17 162.48deg)';
  const darkChart3 = 'oklch(76.9% 0.188 70.08deg)';
  const darkChart4 = 'oklch(62.7% 0.265 303.9deg)';
  const darkChart5 = 'oklch(64.5% 0.246 16.439deg)';

  // Sidebar colors
  const darkSidebar = 'oklch(20.5% 0 0deg)';
  const darkSidebarForeground = 'oklch(98.5% 0 0deg)';
  const darkSidebarPrimary = 'oklch(48.8% 0.243 264.376deg)';
  const darkSidebarPrimaryForeground = 'oklch(98.5% 0 0deg)';
  const darkSidebarAccent = 'oklch(26.9% 0 0deg)';
  const darkSidebarAccentForeground = 'oklch(98.5% 0 0deg)';
  const darkSidebarBorder = 'oklch(100% 0 0deg / 10%)';
  const darkSidebarRing = 'oklch(55.6% 0 0deg)';

  return {
    light: {
      // Main colors defined by user input
      primary: hexToOKLCH(primary),
      'primary-foreground': primaryForeground,
      success: hexToOKLCH(success),
      'success-foreground': successForeground,
      warning: hexToOKLCH(warning),
      'warning-foreground': warningForeground,
      destructive: hexToOKLCH(destructive),
      'destructive-foreground': destructiveForeground,
      neutral: hexToOKLCH(neutral),
      'neutral-foreground': neutralForeground,

      // Calculated colors
      secondary: lightSecondary,
      'secondary-foreground': lightSecondaryForeground,
      muted: lightMuted,
      'muted-foreground': lightMutedForeground,
      accent: lightAccent,
      'accent-foreground': lightAccentForeground,
      background: lightBackground,
      foreground: lightForeground,
      card: lightCard,
      'card-foreground': lightCardForeground,
      popover: lightPopover,
      'popover-foreground': lightPopoverForeground,
      border: lightBorder,
      input: lightInput,

      // Chart colors
      'chart-1': lightChart1,
      'chart-2': lightChart2,
      'chart-3': lightChart3,
      'chart-4': lightChart4,
      'chart-5': lightChart5,

      // Sidebar colors
      'sidebar-background': lightSidebar,
      'sidebar-foreground': lightSidebarForeground,
      'sidebar-primary': lightSidebarPrimary,
      'sidebar-primary-foreground': lightSidebarPrimaryForeground,
      'sidebar-accent': lightSidebarAccent,
      'sidebar-accent-foreground': lightSidebarAccentForeground,
      'sidebar-border': lightSidebarBorder,
      'sidebar-ring': lightSidebarRing,

      // Ring
      ring: lightRing,

      // Fixed values
      radius: radius,
    },
    dark: {
      // Main colors defined by user input
      primary: hexToOKLCH(darkPrimary),
      'primary-foreground': 'oklch(98.5% 0 0deg)',
      success: hexToOKLCH(darkSuccess),
      'success-foreground': 'oklch(98.5% 0 0deg)',
      warning: hexToOKLCH(darkWarning),
      'warning-foreground': isLightColor(darkWarning)
        ? 'oklch(14.5% 0 0deg)'
        : 'oklch(98.5% 0 0deg)',
      destructive: hexToOKLCH(darkDestructive),
      'destructive-foreground': 'oklch(98.5% 0 0deg)',
      neutral: hexToOKLCH(darkNeutral),
      'neutral-foreground': 'oklch(98.5% 0 0deg)',

      // Calculated colors
      secondary: darkSecondary,
      'secondary-foreground': darkSecondaryForeground,
      muted: darkMuted,
      'muted-foreground': darkMutedForeground,
      accent: darkAccent,
      'accent-foreground': darkAccentForeground,
      background: darkBackground,
      foreground: darkForeground,
      card: darkCard,
      'card-foreground': darkCardForeground,
      popover: darkPopover,
      'popover-foreground': darkPopoverForeground,
      border: darkBorder,
      input: darkInput,

      // Chart colors
      'chart-1': darkChart1,
      'chart-2': darkChart2,
      'chart-3': darkChart3,
      'chart-4': darkChart4,
      'chart-5': darkChart5,

      // Sidebar colors
      'sidebar-background': darkSidebar,
      'sidebar-foreground': darkSidebarForeground,
      'sidebar-primary': darkSidebarPrimary,
      'sidebar-primary-foreground': darkSidebarPrimaryForeground,
      'sidebar-accent': darkSidebarAccent,
      'sidebar-accent-foreground': darkSidebarAccentForeground,
      'sidebar-border': darkSidebarBorder,
      'sidebar-ring': darkSidebarRing,

      // Ring
      ring: darkRing,

      // Fixed values
      radius: radius,
    },
  };
}

/**
 * Updates CSS variables in a file with new theme values for Tailwind v4
 * @param {string} filePath - Path to the CSS file
 * @param {Object} themeVariables - Theme variables to insert
 * @returns {Promise<boolean>} - True if successful
 */
async function updateCSSFile(
  filePath: string,
  themeVariables: ThemeVariables,
): Promise<boolean> {
  try {
    // Read the file content
    const content = fs.readFileSync(filePath, 'utf8');

    // Create regex patterns to identify the root and dark sections
    const rootSectionRegex = /:root\s*\{[^}]*\}/gs;
    const darkSectionRegex = /\.dark\s*\{[^}]*\}/gs;

    // Find the root and dark sections
    const rootMatch = content.match(rootSectionRegex);
    const darkMatch = content.match(darkSectionRegex);

    if (!rootMatch || !darkMatch) {
      console.error('Could not find :root or .dark section in the CSS file');
      return false;
    }

    // Build new root section
    let newRootSection = ':root {\n';
    for (const [key, value] of Object.entries(themeVariables.light)) {
      newRootSection += `  --${key}: ${value};\n`;
    }
    newRootSection += '}';

    // Build new dark section
    let newDarkSection = '.dark {\n';
    for (const [key, value] of Object.entries(themeVariables.dark)) {
      newDarkSection += `  --${key}: ${value};\n`;
    }
    newDarkSection += '}';

    // Replace the sections in the content
    let updatedContent = content.replace(rootSectionRegex, newRootSection);
    updatedContent = updatedContent.replace(darkSectionRegex, newDarkSection);

    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent, 'utf8');

    return true;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error updating CSS file: ${errorMessage}`);
    return false;
  }
}

/**
 * Creates a prompt interface for user input
 */
function createPrompt(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Tests the script's output formatting
 */
function runTest() {
  console.log(
    'Running test to verify OKLCH formatting and color calculations...',
  );

  // Try to load colors from content.json
  const contentColors = loadColorsFromContentJson();

  const testColors = contentColors || {
    primary: '#60ACFF',
    success: '#1FCCB1',
    warning: '#FFBF45',
    destructive: '#F35B5A',
    neutral: '#8F95B2',
  };

  const vars = generateThemeVariables(testColors);

  console.log('\n--- LIGHT THEME VARIABLES ---');
  console.log('\nUser-defined colors:');
  console.log(`--primary: ${vars.light.primary}`);
  console.log(`--primary-foreground: ${vars.light['primary-foreground']}`);
  console.log(`--success: ${vars.light.success}`);
  console.log(`--destructive: ${vars.light.destructive}`);

  console.log('\nCalculated colors:');
  console.log(`--secondary: ${vars.light.secondary}`);
  console.log(`--secondary-foreground: ${vars.light['secondary-foreground']}`);
  console.log(`--muted: ${vars.light.muted}`);
  console.log(`--muted-foreground: ${vars.light['muted-foreground']}`);
  console.log(`--accent: ${vars.light.accent}`);
  console.log(`--border: ${vars.light.border}`);
  console.log(`--input: ${vars.light.input}`);

  console.log('\n--- DARK THEME VARIABLES ---');
  console.log('\nUser-defined colors:');
  console.log(`--primary: ${vars.dark.primary}`);
  console.log(`--primary-foreground: ${vars.dark['primary-foreground']}`);
  console.log(`--success: ${vars.dark.success}`);
  console.log(`--destructive: ${vars.dark.destructive}`);

  console.log('\nCalculated colors:');
  console.log(`--secondary: ${vars.dark.secondary}`);
  console.log(`--secondary-foreground: ${vars.dark['secondary-foreground']}`);
  console.log(`--muted: ${vars.dark.muted}`);
  console.log(`--muted-foreground: ${vars.dark['muted-foreground']}`);
  console.log(`--accent: ${vars.dark.accent}`);
  console.log(`--border: ${vars.dark.border}`);
  console.log(`--input: ${vars.dark.input}`);

  console.log(
    '\nTest complete. The above shows how colors are calculated from your primary color.',
  );
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // If --test is passed, run the test function instead of prompting
  if (args.includes('--test')) {
    runTestWithoutInput();
    return;
  }

  const dryRun = args.includes('--dry-run');
  if (dryRun) {
    console.log('Running in dry-run mode. No files will be modified.');
  }

  // Define default colors
  const defaultColors: ColorSet = {
    primary: '#60ACFF',
    success: '#1FCCB1',
    warning: '#FFBF45',
    destructive: '#F35B5A',
    neutral: '#8F95B2',
  };

  // Try to load colors from content.json
  const contentColors = loadColorsFromContentJson();

  let colors: ColorSet;
  let prompt: readline.Interface | null = null;
  let radius = '0.625rem';
  let cssPath = './app/globals.css';

  // If --manual is passed or content.json not found, prompt for input
  if (args.includes('--manual') || !contentColors) {
    prompt = createPrompt();
    colors = { ...defaultColors };

    console.log('=== Tailwind CSS v4 Theme Generator ===');

    if (!contentColors) {
      console.log(
        'content.json not found or does not contain color information.',
      );
      console.log(
        'Please enter your brand colors (or press Enter to use the default):',
      );
    } else {
      console.log(
        'Manual mode enabled. content.json colors found but will be overridden.',
      );
      console.log(
        'Please enter your brand colors (or press Enter to use content.json values):',
      );
    }

    // Ask for colors one by one
    for (const [colorName, defaultValue] of Object.entries(
      contentColors || defaultColors,
    )) {
      const value = await new Promise<string>((resolve) => {
        prompt!.question(
          `${colorName} (${defaultValue}): `,
          (answer: string) => {
            resolve(answer.trim() || defaultValue);
          },
        );
      });

      // Validate hex color
      const hexRegex = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i;
      if (!hexRegex.test(value)) {
        console.log(
          `Invalid hex color: ${value}. Using default ${defaultValue} instead.`,
        );
        colors[colorName] = defaultValue;
      } else {
        // Ensure the color starts with #
        colors[colorName] = value.startsWith('#') ? value : `#${value}`;
      }
    }

    // Ask for border radius
    radius = await new Promise<string>((resolve) => {
      prompt!.question(`Border radius (${radius}): `, (answer: string) => {
        resolve(answer.trim() || radius);
      });
    });

    // Ask for CSS file path
    cssPath = await new Promise<string>((resolve) => {
      prompt!.question(
        `Path to your CSS file (${cssPath}): `,
        (answer: string) => {
          resolve(answer.trim() || cssPath);
        },
      );
    });
  } else {
    // Use colors from content.json
    colors = contentColors;
    console.log('=== Tailwind CSS v4 Theme Generator ===');
    console.log('Using colors from content.json:');

    for (const [key, value] of Object.entries(colors)) {
      console.log(`  ${key}: ${value}`);
    }
  }

  // Check if the file exists
  const resolvedPath = path.resolve(cssPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    if (prompt) prompt.close();
    return;
  }

  // Generate and update
  console.log('\nGenerating theme variables...');
  const themeVariables = generateThemeVariables(colors, radius);

  console.log('Generated variables:');
  console.log('Light theme:');
  for (const [key, value] of Object.entries(themeVariables.light)) {
    console.log(`  --${key}: ${value};`);
  }

  console.log('\nDark theme:');
  for (const [key, value] of Object.entries(themeVariables.dark)) {
    console.log(`  --${key}: ${value};`);
  }

  if (dryRun) {
    console.log('\nDry run complete. No files were modified.');
    if (prompt) prompt.close();
    return;
  }

  console.log('\nUpdating CSS file...');
  const success = await updateCSSFile(resolvedPath, themeVariables);

  if (success) {
    console.log(`\n✅ Successfully updated theme colors in ${resolvedPath}`);
  } else {
    console.error(`\n❌ Failed to update ${resolvedPath}`);
  }

  if (prompt) prompt.close();
}

/**
 * Run a test with default values to show color calculations without user input
 */
function runTestWithoutInput() {
  console.log('Running theme generator test with default colors...');

  // Try to load colors from content.json
  const contentColors = loadColorsFromContentJson();

  const defaultColors = contentColors || {
    primary: '#60ACFF',
    success: '#1FCCB1',
    warning: '#FFBF45',
    destructive: '#F35B5A',
    neutral: '#8F95B2',
  };

  if (contentColors) {
    console.log('Using colors from content.json:');
    console.log(contentColors);
  } else {
    console.log('Using default colors (content.json not found):');
    console.log(defaultColors);
  }

  const defaultRadius = '0.625rem';
  const vars = generateThemeVariables(defaultColors, defaultRadius);

  console.log('\n--- LIGHT THEME VARIABLES ---');
  console.log('\nUser-defined colors:');
  console.log(`--primary: ${vars.light.primary}`);
  console.log(`--primary-foreground: ${vars.light['primary-foreground']}`);
  console.log(`--success: ${vars.light.success}`);
  console.log(`--destructive: ${vars.light.destructive}`);

  console.log('\nCalculated colors:');
  console.log(`--secondary: ${vars.light.secondary}`);
  console.log(`--secondary-foreground: ${vars.light['secondary-foreground']}`);
  console.log(`--muted: ${vars.light.muted}`);
  console.log(`--muted-foreground: ${vars.light['muted-foreground']}`);
  console.log(`--accent: ${vars.light.accent}`);
  console.log(`--border: ${vars.light.border}`);
  console.log(`--input: ${vars.light.input}`);

  console.log('\nChart colors:');
  console.log(`--chart-1: ${vars.light['chart-1']}`);
  console.log(`--chart-2: ${vars.light['chart-2']}`);
  console.log(`--chart-3: ${vars.light['chart-3']}`);
  console.log(`--chart-4: ${vars.light['chart-4']}`);
  console.log(`--chart-5: ${vars.light['chart-5']}`);

  console.log('\nSidebar colors:');
  console.log(`--sidebar-background: ${vars.light['sidebar-background']}`);
  console.log(`--sidebar-foreground: ${vars.light['sidebar-foreground']}`);
  console.log(`--sidebar-primary: ${vars.light['sidebar-primary']}`);
  console.log(`--sidebar-accent: ${vars.light['sidebar-accent']}`);

  console.log('\n--- DARK THEME VARIABLES ---');
  console.log('\nUser-defined colors:');
  console.log(`--primary: ${vars.dark.primary}`);
  console.log(`--primary-foreground: ${vars.dark['primary-foreground']}`);
  console.log(`--success: ${vars.dark.success}`);
  console.log(`--destructive: ${vars.dark.destructive}`);

  console.log('\nCalculated colors:');
  console.log(`--secondary: ${vars.dark.secondary}`);
  console.log(`--muted: ${vars.dark.muted}`);
  console.log(`--accent: ${vars.dark.accent}`);
  console.log(`--border: ${vars.dark.border}`);
  console.log(`--input: ${vars.dark.input}`);

  console.log('\nChart colors:');
  console.log(`--chart-1: ${vars.dark['chart-1']}`);
  console.log(`--chart-2: ${vars.dark['chart-2']}`);
  console.log(`--chart-3: ${vars.dark['chart-3']}`);
  console.log(`--chart-4: ${vars.dark['chart-4']}`);
  console.log(`--chart-5: ${vars.dark['chart-5']}`);

  console.log('\nSidebar colors:');
  console.log(`--sidebar-background: ${vars.dark['sidebar-background']}`);
  console.log(`--sidebar-foreground: ${vars.dark['sidebar-foreground']}`);
  console.log(`--sidebar-primary: ${vars.dark['sidebar-primary']}`);
  console.log(`--sidebar-accent: ${vars.dark['sidebar-accent']}`);

  console.log(
    '\nTest complete. The above shows how colors are calculated from your primary color.',
  );
}

/**
 * To run this script:
 *
 * Option 1: Using Node.js directly (after removing TypeScript types)
 * 1. node lib/theme-converter/theme-converter.js
 *
 * Option 2: Using your project's TypeScript setup:
 * 1. npx ts-node lib/theme-converter/theme-converter.ts
 *    OR
 * 2. Use whatever command you normally use to run TypeScript files
 *    (e.g., your project's npm scripts)
 *
 * Test mode (to see calculated values without making changes):
 * - Add --test to the command
 *
 * Dry run (to preview changes without applying them):
 * - Add --dry-run to the command
 *
 * Manual mode (to prompt for colors instead of using content.json):
 * - Add --manual to the command
 */

// Run the main function
main().catch((error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${errorMessage}`);
  process.exit(1);
});
