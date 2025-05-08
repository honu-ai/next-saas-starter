// Function to convert HSL values from the format "H S% L%" to "hsl(H, S%, L%)"
// This could grow to be a style guide functionality
function convertToHSL(cssTheme: string) {
  // Regular expression to match CSS variable definitions
  const varRegex = /--([^:]+):\s*([^;]+);/g;

  // Process all variable matches
  let match;
  let result = cssTheme;

  while ((match = varRegex.exec(cssTheme)) !== null) {
    const variable = match[1];
    const value = match[2].trim();

    // Skip non-color values like radius
    if (variable === 'radius') {
      continue;
    }

    // Parse the HSL values
    const [h, s, l] = value.split(' ');

    // Convert to proper HSL format if we have all three components
    if (h !== undefined && s !== undefined && l !== undefined) {
      const hslValue = `hsl(${h}, ${s}%, ${l}%)`;

      // Replace the original value with the HSL format
      result = result.replace(
        new RegExp(`--${variable}:\\s*${value.replace(/([%])/g, '\\$1')};`),
        `--${variable}: ${hslValue};`,
      );
    }
  }

  return result;
}

// The CSS theme with both light and dark modes
const cssTheme = `
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;
    --primary: 230 80% 58%;
    --primary-foreground: 0 0% 100%;
    --secondary: 240 100% 98%;
    --secondary-foreground: 222 47% 11%;
    --muted: 240 100% 98%;
    --muted-foreground: 215 5% 29%;
    --accent: 240 100% 98%;
    --accent-foreground: 222 47% 11%;
    --destructive: 0 99% 61%;
    --destructive-foreground: 0 0% 100%;
    --border: 240 100% 98%;
    --input: 240 100% 98%;
    --ring: 230 80% 58%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 222 47% 11%;
    --foreground: 0 0% 100%;
    --card: 222 47% 11%;
    --card-foreground: 0 0% 100%;
    --popover: 222 47% 11%;
    --popover-foreground: 0 0% 100%;
    --primary: 230 80% 58%;
    --primary-foreground: 0 0% 100%;
    --secondary: 217 33% 17%;
    --secondary-foreground: 0 0% 100%;
    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;
    --accent: 217 33% 17%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 99% 61%;
    --destructive-foreground: 0 0% 100%;
    --border: 217 33% 17%;
    --input: 217 33% 17%;
    --ring: 230 80% 58%;
  }
}
`;

// Convert the theme to HSL format
const convertedTheme = convertToHSL(cssTheme);

// Output the converted theme
console.log(convertedTheme);
