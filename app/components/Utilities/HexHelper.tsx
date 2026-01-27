export default function hexToColorName(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Convert RGB to HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  
  let h = 0;
  let s = 0;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  // Convert to degrees
  h = Math.round(h * 360);
  
  // Determine lightness descriptor
  let lightness = '';
  if (l < 0.25) lightness = 'Dark ';
  else if (l > 0.75) lightness = 'Light ';
  
  // Handle grayscale (low saturation)
  if (s < 0.1) {
    if (l < 0.2) return 'Black';
    if (l > 0.9) return 'White';
    if (l < 0.4) return 'Dark Gray';
    if (l > 0.7) return 'Light Gray';
    return 'Gray';
  }
  
  // Determine base color from hue
  let colorName = '';
  if (h >= 345 || h < 15) colorName = 'Red';
  else if (h >= 15 && h < 45) colorName = 'Orange';
  else if (h >= 45 && h < 75) colorName = 'Yellow';
  else if (h >= 75 && h < 165) colorName = 'Green';
  else if (h >= 165 && h < 195) colorName = 'Cyan';
  else if (h >= 195 && h < 255) colorName = 'Blue';
  else if (h >= 255 && h < 285) colorName = 'Purple';
  else if (h >= 285 && h < 315) colorName = 'Magenta';
  else if (h >= 315 && h < 345) colorName = 'Pink';
  
  return lightness + colorName;
}

export function getTextColor(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

interface ColorBadgeProps {
  hex: string;
}

export function ColorBadge({ hex }: ColorBadgeProps) {
  const colorName = hexToColorName(hex);
  const textColor = getTextColor(hex);
  
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{
        backgroundColor: hex,
        color: textColor,
      }}
    >
      {colorName}
    </span>
  );
}