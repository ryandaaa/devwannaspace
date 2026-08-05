import React from 'react';
import { Feather } from '@expo/vector-icons';

const ICON_NAME_MAP: Record<string, keyof typeof Feather.glyphMap> = {
  FileText: 'file-text',
  Code: 'code',
  Terminal: 'terminal',
  Zap: 'zap',
  Sparkles: 'sun',
  Folder: 'folder',
  Database: 'database',
  Cpu: 'cpu',
  Globe: 'globe',
  Shield: 'shield',
  Activity: 'activity',
  Layers: 'layers',
  CheckSquare: 'check-square',
  Inbox: 'inbox',
  Flame: 'zap',
  Rocket: 'send',
  Bookmark: 'bookmark',
  Tag: 'tag',
  Layout: 'layout',
  Command: 'command',
  FileCode: 'file-text',
  Sliders: 'sliders',
  Hash: 'hash',
  Compass: 'compass',
  BookOpen: 'book-open',
  Feather: 'feather',
  Grid: 'grid',
  Box: 'box',
  Key: 'key',
  Package: 'package',
  Wrench: 'tool',
};

const LEGACY_EMOJI_MAP: Record<string, string> = {
  '⚡': 'Zap',
  '📄': 'FileText',
  '🚀': 'Rocket',
  '💻': 'Code',
  '📁': 'Folder',
  '🔥': 'Flame',
  '✨': 'Sparkles',
  '🌐': 'Globe',
  '🛡️': 'Shield',
  '⚙️': 'Sliders',
  '📦': 'Package',
  '🎨': 'Feather',
  '🛠️': 'Wrench',
  '📝': 'FileCode',
};

export function PageIcon({ icon, size = 18, color = '#64748b' }: { icon?: string; size?: number; color?: string }) {
  let iconKey = icon?.trim();
  if (iconKey && LEGACY_EMOJI_MAP[iconKey]) {
    iconKey = LEGACY_EMOJI_MAP[iconKey];
  }

  const featherName = (iconKey && ICON_NAME_MAP[iconKey])
    ? ICON_NAME_MAP[iconKey]
    : (iconKey && (iconKey in Feather.glyphMap) ? (iconKey as keyof typeof Feather.glyphMap) : 'file-text');

  return <Feather name={featherName} size={size} color={color} />;
}
