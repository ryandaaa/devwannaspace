import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'id';

interface Translations {
  [key: string]: {
    en: string;
    id: string;
  };
}

export const translations: Translations = {
  // Navigation
  Product: { en: 'Product', id: 'Produk' },
  Pricing: { en: 'Pricing', id: 'Harga' },
  Customers: { en: 'Customers', id: 'Pelanggan' },
  Changelog: { en: 'Changelog', id: 'Pembaruan' },
  Docs: { en: 'Docs', id: 'Dokumen' },
  SignIn: { en: 'Sign in', id: 'Masuk' },
  GetStarted: { en: 'Get started', id: 'Mulai Sekarang' },
  
  // Landing Page Hero
  HeroTitle1: { en: 'A magical new way', id: 'Cara baru yang ajaib' },
  HeroTitle2: { en: 'to build software.', id: 'untuk membangun software.' },
  HeroDesc: { en: 'Nebula is a purpose-built tool for planning and building products. Meet the new standard for modern software development.', id: 'Nebula adalah alat khusus untuk merencanakan dan membangun produk. Temui standar baru pengembangan perangkat lunak modern.' },
  
  // Landing Page - Features
  Feature1Title: { en: 'Built for speed', id: 'Dibuat untuk kecepatan' },
  Feature1Desc: { en: 'Navigate, create, and search with keyboard shortcuts. Everything is instantly synced across devices.', id: 'Navigasi, buat, dan cari dengan pintasan keyboard. Semuanya tersinkronisasi seketika antar perangkat.' },
  
  // General App
  Settings: { en: 'Settings', id: 'Pengaturan' },
  Trash: { en: 'Trash', id: 'Sampah' },
  NewPage: { en: 'New Page', id: 'Halaman Baru' },
  Search: { en: 'Search', id: 'Cari' },
  
  // Sidebar
  MyIssues: { en: 'My Issues', id: 'Tugasku' },
  Pages: { en: 'Pages', id: 'Halaman' },
  Projects: { en: 'Projects', id: 'Proyek' },
  LogOut: { en: 'Log out', id: 'Keluar' },
  Account: { en: 'Account', id: 'Akun' },
  Appearance: { en: 'Appearance', id: 'Tampilan' },
  General: { en: 'General', id: 'Umum' },
  Shortcuts: { en: 'Shortcuts', id: 'Pintasan' },
  
  AccountSettings: { en: 'Account Settings', id: 'Pengaturan Akun' },
  Favorites: { en: 'Favorites', id: 'Favorit' },
  NoPagesYet: { en: 'No pages yet', id: 'Belum ada halaman' },

  ProfileSettings: { en: 'Profile Settings', id: 'Pengaturan Profil' },
  ProfileDesc: { en: 'Manage your personal information.', id: 'Kelola informasi pribadi Anda.' },
  MyAccount: { en: 'My Account', id: 'Akun Saya' },
  AccountDesc: { en: 'Manage your personal profile and preferences.', id: 'Kelola profil pribadi dan preferensi Anda.' },
  DisplayName: { en: 'Display Name', id: 'Nama Tampilan' },
  AvatarImage: { en: 'Avatar Image', id: 'Gambar Avatar' },
  AvatarDesc: { en: 'Enter a custom image URL below to update.', id: 'Masukkan URL gambar kustom di bawah untuk memperbarui.' },
  AvatarUrl: { en: 'Avatar URL', id: 'URL Avatar' },
  Password: { en: 'Password', id: 'Kata Sandi' },
  PasswordPlaceholder: { en: 'Leave blank to remove password', id: 'Kosongkan untuk menghapus kata sandi' },
  SaveChanges: { en: 'Save Changes', id: 'Simpan Perubahan' },
  Saved: { en: 'Saved!', id: 'Tersimpan!' },

  InterfaceTheme: { en: 'Interface Theme', id: 'Tema Tampilan' },
  ThemeDesc: { en: 'Choose how devwannaspace looks on your screen.', id: 'Pilih bagaimana devwannaspace terlihat di layar Anda.' },
  DarkMode: { en: 'Dark Mode', id: 'Mode Gelap' },
  LightMode: { en: 'Light Mode', id: 'Mode Terang' },
  NordMode: { en: 'Nord (Cool)', id: 'Nord (Sejuk)' },
  MidnightMode: { en: 'Midnight Blue', id: 'Biru Tengah Malam' },
  RoseMode: { en: 'Rose Gold', id: 'Emas Mawar' },
  ForestMode: { en: 'Forest Green', id: 'Hijau Hutan' },
  CustomPalette: { en: 'Custom Palette', id: 'Palet Kustom' },
  Background: { en: 'Background', id: 'Latar Belakang' },
  CardSurface: { en: 'Card Surface', id: 'Permukaan Kartu' },
  AccentColor: { en: 'Accent Color', id: 'Warna Aksen' },
  TextColor: { en: 'Text Color', id: 'Warna Teks' },
  WindowControls: { en: 'Window Controls Style', id: 'Gaya Kontrol Jendela' },
  WindowControlsDesc: { en: 'Change the window buttons layout in the Desktop App.', id: 'Ubah tata letak tombol jendela pada Aplikasi Desktop.' },
  MacStyle: { en: 'Mac OS', id: 'Mac OS' },
  WinStyle: { en: 'Windows', id: 'Windows' },

  GeneralPrefs: { en: 'General Preferences', id: 'Preferensi Umum' },
  GeneralDesc: { en: 'Manage workspace configurations and language options.', id: 'Kelola konfigurasi ruang kerja dan pilihan bahasa.' },
  AppLanguage: { en: 'Application Language', id: 'Bahasa Aplikasi' },

  KbdShortcuts: { en: 'Keyboard Shortcuts', id: 'Pintasan Keyboard' },
  KbdDesc: { en: 'Quick reference for keyboard navigation.', id: 'Referensi cepat untuk navigasi keyboard.' },
  CmdPalette: { en: 'Command Palette', id: 'Palet Perintah' },
  ToggleSidebar: { en: 'Toggle Sidebar', id: 'Buka/Tutup Sidebar' },
  SlashCommandsTitle: { en: 'Slash Commands', id: 'Perintah Garis Miring' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('preferred_language') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('preferred_language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
