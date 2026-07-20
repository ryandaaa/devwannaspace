import React from 'react';
import {
  FileText, Code, Terminal, Zap, Sparkles, Folder,
  Database, Cpu, Globe, Shield, Activity, Layers,
  CheckSquare, Inbox, Flame, Rocket, Bookmark, Tag,
  Layout, Command, FileCode, Sliders, Hash, Compass,
  BookOpen, Feather, Grid, Box, Key, Package, Wrench
} from 'lucide-react';

export const ICON_MAP: Record<string, React.FC<{ size?: number; style?: React.CSSProperties; className?: string }>> = {
  FileText, Code, Terminal, Zap, Sparkles, Folder,
  Database, Cpu, Globe, Shield, Activity, Layers,
  CheckSquare, Inbox, Flame, Rocket, Bookmark, Tag,
  Layout, Command, FileCode, Sliders, Hash, Compass,
  BookOpen, Feather, Grid, Box, Key, Package, Wrench
};

// Fallback for legacy emoji strings to Lucide icon names
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

interface PageIconProps {
  name?: string | null;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const PageIcon: React.FC<PageIconProps> = ({
  name,
  size = 16,
  color = 'currentColor',
  style,
  className,
}) => {
  let iconKey = name;

  if (iconKey && LEGACY_EMOJI_MAP[iconKey]) {
    iconKey = LEGACY_EMOJI_MAP[iconKey];
  }

  const IconComponent = (iconKey && ICON_MAP[iconKey]) ? ICON_MAP[iconKey] : FileText;

  return <IconComponent size={size} style={{ color, flexShrink: 0, ...style }} className={className} />;
};
