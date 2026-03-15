/**
 * Resolve a Lucide icon by name (e.g. "BookOpen" or "book-open") to a React component.
 * Used for menu items and other dynamic icon names from Strapi.
 */

import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/** Convert "book-open" or "book open" to "BookOpen" */
function toPascalCase(name: string): string {
  return name
    .split(/[-_\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
}

/** React components can be functions or forwardRef objects */
function isReactComponent(value: unknown): value is LucideIcon {
  if (typeof value === 'function') return true;
  return typeof value === 'object' && value !== null && '$$typeof' in value;
}

/**
 * Returns the Lucide icon component for the given name, or null if not found.
 * Names can be PascalCase (BookOpen) or kebab-case (book-open).
 */
export function getLucideIcon(iconName: string | undefined): LucideIcon | null {
  if (!iconName || typeof iconName !== 'string') return null;
  const trimmed = iconName.trim();
  if (!trimmed) return null;
  const iconsMap = LucideIcons as Record<string, unknown>;
  // Try as-is first (e.g. "UserPen" from Strapi)
  let Icon = iconsMap[trimmed];
  if (Icon && isReactComponent(Icon)) return Icon as LucideIcon;
  // Then try PascalCase (e.g. "user-pen" -> "UserPen")
  const pascal = trimmed.includes('-') || trimmed.includes('_') || trimmed.includes(' ')
    ? toPascalCase(trimmed)
    : trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  Icon = iconsMap[pascal];
  if (Icon && isReactComponent(Icon)) return Icon as LucideIcon;
  return null;
}
