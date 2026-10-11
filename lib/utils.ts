import { type ClassValue, clsx } from 'clsx';

export function cn(...classes: ClassValue[]) {
  return clsx(classes);
}

/** Format a date string */
export function formatDate(dateStr: string): string {
  return dateStr;
}

/** Slugify a string */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Truncate text to a maximum length */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + '…';
}

/** Get initials from a name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Resolves static public assets (images, pdfs) with basePath support for GitHub Pages
 */
export function getAssetPath(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const basePath = rawBasePath.endsWith('/') ? rawBasePath.slice(0, -1) : rawBasePath;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (basePath && (cleanPath === basePath || cleanPath.startsWith(`${basePath}/`))) {
    return cleanPath;
  }
  return `${basePath}${cleanPath}`;
}

