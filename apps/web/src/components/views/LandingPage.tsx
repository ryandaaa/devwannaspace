import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="bg-canvas text-ink antialiased" style={{ fontFamily: 'Inter, sans-serif' }}>
      

  {/**/}
  <nav className="sticky top-0 z-50 bg-canvas/80 backdrop-blur-xl border-b border-hairline-tertiary" >
    <div className="mx-auto max-w-content px-6 lg:px-8">
      <div className="flex h-14 items-center justify-between">
        {/**/}
        <a href="#" className="flex items-center gap-2 text-ink font-display font-medium shrink-0">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-primary">
            <path d="M10 2L18 18H2L10 2Z" fill="currentColor"/>
          </svg>
          <span className="text-[15px] tracking-wordmark">Nebula</span>
        </a>

        {/**/}
        <div className="hidden md:flex items-center gap-1 text-[14px] text-ink-subtle absolute left-1/2 -translate-x-1/2">
          <a href="#" className="px-3 py-1.5 hover:text-ink transition-colors rounded-md">{t('Product')}</a>
          <a href="#" className="px-3 py-1.5 hover:text-ink transition-colors rounded-md">{t('Pricing')}</a>
          <a href="#" className="px-3 py-1.5 hover:text-ink transition-colors rounded-md">{t('Customers')}</a>
          <a href="#" className="px-3 py-1.5 hover:text-ink transition-colors rounded-md">{t('Changelog')}</a>
          <a href="#" className="px-3 py-1.5 hover:text-ink transition-colors rounded-md">{t('Docs')}</a>
        </div>

        {/**/}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'id' : 'en')}
            className="hidden md:inline-flex items-center px-3 py-1.5 text-[13px] font-medium text-ink-subtle hover:text-ink rounded-md transition-colors"
          >
            {language.toUpperCase()}
          </button>
          <a href="#" className="hidden md:inline-flex items-center px-3.5 py-2 text-[14px] font-medium text-ink bg-surface-1 border border-hairline rounded-md hover:bg-surface-2 transition-colors" onClick={(e) => { e.preventDefault(); onGetStarted(); }}>{t('SignIn')}</a>
          <a href="#" className="inline-flex items-center px-3.5 py-2 text-[14px] font-medium text-on-primary bg-primary border border-transparent rounded-md hover:bg-primary-hover transition-colors" onClick={(e) => { e.preventDefault(); onGetStarted(); }}>{t('GetStarted')}</a>

          {/**/}
          <button  className="md:hidden p-2 text-ink-subtle hover:text-ink rounded-md transition-colors" aria-label="Toggle menu">
            <svg  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
            <svg   width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M6 18L18 6"/></svg>
          </button>
        </div>
      </div>

      {/**/}
      <div    className="md:hidden border-t border-hairline-tertiary py-3">
        <div className="flex flex-col gap-0.5 text-[14px] text-ink-subtle">
          <button onClick={() => setLanguage(language === 'en' ? 'id' : 'en')} className="px-3 py-2 text-left hover:text-ink rounded-md transition-colors">Language: {language.toUpperCase()}</button>
          <a href="#"  className="px-3 py-2 hover:text-ink rounded-md transition-colors">{t('Product')}</a>
          <a href="#"  className="px-3 py-2 hover:text-ink rounded-md transition-colors">{t('Pricing')}</a>
          <a href="#"  className="px-3 py-2 hover:text-ink rounded-md transition-colors">{t('Customers')}</a>
          <a href="#"  className="px-3 py-2 hover:text-ink rounded-md transition-colors">{t('Changelog')}</a>
          <a href="#"  className="px-3 py-2 hover:text-ink rounded-md transition-colors">{t('Docs')}</a>
          <a href="#"  className="px-3 py-2 mt-1 border-t border-hairline-tertiary pt-3 hover:text-ink rounded-md transition-colors" onClick={(e) => { e.preventDefault(); onGetStarted(); }}>{t('SignIn')}</a>
        </div>
      </div>
    </div>
  </nav>

  {/**/}
  <section className="relative">
    <div className="mx-auto max-w-content px-6 lg:px-8 pt-20 lg:pt-28 pb-16 lg:pb-24">

      {/**/}
      <div className="flex justify-center mb-8">
        <a href="#" className="group inline-flex items-center gap-1.5 text-[13px] text-ink-subtle hover:text-ink transition-colors">
          Introducing Nebula Insights
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-tertiary group-hover:text-ink-muted group-hover:translate-x-0.5 transition-all"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
      </div>

      {/**/}
      <h1 className="text-center text-[40px] sm:text-[60px] lg:text-[80px] leading-[1.05] font-display font-semibold tracking-display-xl text-ink">
        The issue tracker built for<br className="hidden sm:block" />
        high-performance software teams
      </h1>

      {/**/}
      <p className="mt-6 max-w-2xl mx-auto text-center text-[18px] sm:text-[20px] leading-[1.5] tracking-body-lg text-ink-muted font-normal">
        Meet Nebula. The purpose-built tool for planning and building products. Synthesis, speed, and craft — for teams who care about the details.
      </p>

      {/**/}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a href="#" className="inline-flex items-center px-4 py-2.5 text-[14px] font-medium text-on-primary bg-primary rounded-md hover:bg-primary-hover transition-colors w-full sm:w-auto justify-center" onClick={(e) => { e.preventDefault(); onGetStarted(); }}>Get started</a>
        <a href="#" className="inline-flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium text-ink bg-surface-1 border border-hairline rounded-md hover:bg-surface-2 transition-colors w-full sm:w-auto justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-ink-subtle"><path d="M8 5v14l11-7z"/></svg>
          Watch demo
        </a>
      </div>

      {/**/}
      <div className="mt-16 lg:mt-20">
        <div className="panel-highlight bg-surface-1 border border-hairline rounded-xl p-3 sm:p-4">
          {/**/}
          <svg width="0" height="0" className="absolute" aria-hidden="true">
            <defs>
              <symbol id="i-backlog" viewBox="0 0 14 14"><circle cx="7" cy="7" r="5.25" stroke="#8a8f98" strokeWidth="1.5" strokeDasharray="2 2" fill="none"/></symbol>
              <symbol id="i-todo" viewBox="0 0 14 14"><circle cx="7" cy="7" r="5.25" fill="#6f7782"/><circle cx="7" cy="7" r="2.25" fill="#08080a"/></symbol>
              <symbol id="i-progress" viewBox="0 0 14 14"><circle cx="7" cy="7" r="5.25" stroke="#5e6ad2" strokeWidth="1.5" fill="none"/><path d="M7 1.75 A 5.25 5.25 0 0 1 12.25 7 L7 7 Z" fill="#5e6ad2"/></symbol>
              <symbol id="i-review" viewBox="0 0 14 14"><circle cx="7" cy="7" r="5.25" stroke="#f2c94d" strokeWidth="1.5" fill="none"/><circle cx="7" cy="7" r="2.25" fill="#f2c94d"/></symbol>
              <symbol id="i-done" viewBox="0 0 14 14"><circle cx="7" cy="7" r="5.25" fill="#27a644"/><path d="M4.5 7 L6.2 8.7 L9.5 5.4" stroke="#08080a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></symbol>
              <symbol id="i-cancel" viewBox="0 0 14 14"><circle cx="7" cy="7" r="5.25" stroke="#62666d" strokeWidth="1.5" fill="none"/><path d="M5 5 L9 9 M9 5 L5 9" stroke="#62666d" strokeWidth="1.5" strokeLinecap="round"/></symbol>
              <symbol id="p-urgent" viewBox="0 0 14 14"><rect x="3" y="3" width="8" height="8" rx="1.5" fill="#e5484d"/></symbol>
              <symbol id="p-high" viewBox="0 0 14 14" fill="none" stroke="#f2994a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7 L7 3 L11 7"/><path d="M3 10.5 L7 6.5 L11 10.5" opacity="0.55"/></symbol>
              <symbol id="p-med" viewBox="0 0 14 14" fill="none" stroke="#f2c94d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5 L7 4.5 L11 8.5"/></symbol>
              <symbol id="p-low" viewBox="0 0 14 14" fill="none" stroke="#8a8f98" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5.5 L7 9.5 L11 5.5"/></symbol>
              <symbol id="p-none" viewBox="0 0 14 14" fill="none" stroke="#62666d" strokeWidth="1.6" strokeLinecap="round"><path d="M3 7 L11 7"/></symbol>
            </defs>
          </svg>

          {/**/}
          <div className="rounded-lg overflow-hidden bg-[#08080a] border border-hairline-tertiary">
            <div className="flex min-h-[440px] md:min-h-[520px] lg:min-h-[580px]">

              {/**/}
              <aside className="hidden md:flex flex-col w-[200px] lg:w-[224px] shrink-0 border-r border-hairline-tertiary bg-[#08080a] py-3 px-2.5">

                {/**/}
                <div className="flex items-center gap-2 px-2 py-1.5 mb-3 rounded-md hover:bg-surface-1 cursor-pointer">
                  <div className="w-5 h-5 rounded bg-primary flex items-center justify-center shrink-0">
                    <svg width="11" height="11" viewBox="0 0 20 20" fill="none"><path d="M10 2L18 18H2L10 2Z" fill="white"/></svg>
                  </div>
                  <span className="text-[13px] text-ink font-medium">Nebula</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="ml-auto text-ink-subtle"><path d="M6 9l6 6 6-6"/></svg>
                </div>

                {/**/}
                <div className="flex items-center gap-2 px-2.5 py-1.5 mb-4 bg-surface-1 border border-hairline-tertiary rounded-md">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a8f98" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
                  <span className="text-[13px] text-ink-subtle">Search</span>
                  <kbd className="ml-auto text-[10px] text-ink-tertiary font-mono">⌘K</kbd>
                </div>

                {/**/}
                <nav className="space-y-0.5 mb-4">
                  <a className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-ink-subtle hover:text-ink hover:bg-surface-1 cursor-pointer">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 13l9-9 9 9"/><path d="M5 11v9h14v-9"/></svg>
                    Inbox
                    <span className="ml-auto text-[11px] text-ink-tertiary">3</span>
                  </a>
                  <a className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-ink bg-surface-1 cursor-pointer">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>
                    My Issues
                    <span className="ml-auto text-[11px] text-ink-tertiary">8</span>
                  </a>
                  <a className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-ink-subtle hover:text-ink hover:bg-surface-1 cursor-pointer">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>
                    Active Issues
                    <span className="ml-auto text-[11px] text-ink-tertiary">12</span>
                  </a>
                  <a className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-ink-subtle hover:text-ink hover:bg-surface-1 cursor-pointer">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeDasharray="2 2"><circle cx="12" cy="12" r="9"/></svg>
                    Backlog
                    <span className="ml-auto text-[11px] text-ink-tertiary">47</span>
                  </a>
                </nav>

                {/**/}
                <div className="mb-4">
                  <div className="flex items-center justify-between px-2 py-1 mb-0.5">
                    <span className="text-[11px] text-ink-tertiary eyebrow">Projects</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-tertiary"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                  <div className="space-y-0.5">
                    <a className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-ink-subtle hover:text-ink hover:bg-surface-1 cursor-pointer">
                      <span className="w-2 h-2 rounded-full bg-[#f2994a]"></span>
                      Backend API
                      <span className="ml-auto text-[11px] text-ink-tertiary">4</span>
                    </a>
                    <a className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-ink-subtle hover:text-ink hover:bg-surface-1 cursor-pointer">
                      <span className="w-2 h-2 rounded-full bg-[#5e6ad2]"></span>
                      Frontend Rewrite
                      <span className="ml-auto text-[11px] text-ink-tertiary">7</span>
                    </a>
                    <a className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-ink-subtle hover:text-ink hover:bg-surface-1 cursor-pointer">
                      <span className="w-2 h-2 rounded-full bg-[#bf7ce4]"></span>
                      Design System
                      <span className="ml-auto text-[11px] text-ink-tertiary">2</span>
                    </a>
                  </div>
                </div>

                {/**/}
                <div className="mb-4">
                  <div className="flex items-center justify-between px-2 py-1 mb-0.5">
                    <span className="text-[11px] text-ink-tertiary eyebrow">Teams</span>
                  </div>
                  <div className="space-y-0.5">
                    <a className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-ink-subtle hover:text-ink hover:bg-surface-1 cursor-pointer">
                      <span className="w-4 h-4 rounded-[4px] bg-[#5e6ad2] flex items-center justify-center text-[9px] text-white font-medium">C</span>
                      Core
                    </a>
                    <a className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-ink-subtle hover:text-ink hover:bg-surface-1 cursor-pointer">
                      <span className="w-4 h-4 rounded-[4px] bg-[#f2994a] flex items-center justify-center text-[9px] text-white font-medium">M</span>
                      Mobile
                    </a>
                    <a className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-ink-subtle hover:text-ink hover:bg-surface-1 cursor-pointer">
                      <span className="w-4 h-4 rounded-[4px] bg-[#27a644] flex items-center justify-center text-[9px] text-white font-medium">W</span>
                      Web
                    </a>
                  </div>
                </div>

                {/**/}
                <div className="mt-auto pt-2 space-y-0.5">
                  <a className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-ink-subtle hover:text-ink hover:bg-surface-1 cursor-pointer">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
                    Roadmap
                  </a>
                  <a className="flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-ink-subtle hover:text-ink hover:bg-surface-1 cursor-pointer">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a2 2 0 0 0 .4 2.2l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a2 2 0 0 0-2.2-.4 2 2 0 0 0-1.2 1.8V21a2 2 0 1 1-4 0v-.1a2 2 0 0 0-1.2-1.8 2 2 0 0 0-2.2.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a2 2 0 0 0 .4-2.2 2 2 0 0 0-1.8-1.2H3a2 2 0 1 1 0-4h.1a2 2 0 0 0 1.8-1.2 2 2 0 0 0-.4-2.2l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a2 2 0 0 0 2.2.4 2 2 0 0 0 1.2-1.8V3a2 2 0 1 1 4 0v.1a2 2 0 0 0 1.2 1.8 2 2 0 0 0 2.2-.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a2 2 0 0 0-.4 2.2 2 2 0 0 0 1.8 1.2H21a2 2 0 1 1 0 4h-.1a2 2 0 0 0-1.8 1.2z"/></svg>
                    Settings
                  </a>
                </div>
              </aside>

              {/**/}
              <main className="flex-1 flex flex-col min-w-0 bg-[#0a0a0c]">

                {/**/}
                <header className="border-b border-hairline-tertiary px-4 sm:px-5 py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[13px] min-w-0">
                    <span className="text-ink-tertiary">Core</span>
                    <span className="text-ink-tertiary">/</span>
                    <span className="text-ink font-medium truncate">My Issues</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button className="p-1.5 rounded-md text-ink-subtle hover:text-ink hover:bg-surface-1" aria-label="Sort">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 6h18M7 12h10M11 18h2"/></svg>
                    </button>
                    <button className="p-1.5 rounded-md text-ink-subtle hover:text-ink hover:bg-surface-1" aria-label="Filter">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 6h16l-6 7v6l-4 2v-8z"/></svg>
                    </button>
                    <button className="inline-flex items-center gap-1 px-2.5 py-1 ml-1 text-[12px] font-medium text-on-primary bg-primary rounded-md hover:bg-primary-hover">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                      New
                    </button>
                  </div>
                </header>

                {/**/}
                <div className="border-b border-hairline-tertiary px-4 sm:px-5 flex items-center gap-1 text-[12px] overflow-x-auto">
                  <button className="py-2.5 px-1 mr-2 text-ink border-b-2 border-primary -mb-px whitespace-nowrap">All <span className="text-ink-tertiary ml-0.5">24</span></button>
                  <button className="py-2.5 px-1 mr-2 text-ink-subtle hover:text-ink border-b-2 border-transparent -mb-px whitespace-nowrap">Active <span className="text-ink-tertiary ml-0.5">12</span></button>
                  <button className="py-2.5 px-1 mr-2 text-ink-subtle hover:text-ink border-b-2 border-transparent -mb-px whitespace-nowrap">Backlog <span className="text-ink-tertiary ml-0.5">47</span></button>

                  <div className="ml-auto flex items-center gap-1.5 py-1.5">
                    <span className="hidden lg:inline-flex items-center gap-1 px-1.5 py-1 rounded-md text-[11px] text-ink-subtle bg-surface-1 border border-hairline-tertiary">
                      Status: all
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
                    </span>
                    <span className="hidden lg:inline-flex items-center gap-1 px-1.5 py-1 rounded-md text-[11px] text-ink-subtle bg-surface-1 border border-hairline-tertiary">
                      Priority: all
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
                    </span>
                    <span className="hidden lg:inline-flex items-center gap-1 px-1.5 py-1 rounded-md text-[11px] text-ink bg-surface-2 border border-hairline">
                      Assignee: me
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
                    </span>
                    <span className="text-[11px] text-ink-tertiary px-1.5 py-1 hover:text-ink cursor-pointer whitespace-nowrap">+ Add filter</span>
                  </div>
                </div>

                {/**/}
                <div className="flex-1 overflow-hidden">

                  {/**/}
                  <div className="px-4 sm:px-5 py-1.5 flex items-center gap-2 text-[11px] bg-surface-1/40 border-b border-hairline-tertiary">
                    <svg width="12" height="12"><use href="#i-progress"/></svg>
                    <span className="font-medium text-ink-muted tracking-wide">In Progress</span>
                    <span className="text-ink-tertiary">4</span>
                  </div>

                  <a className="group flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-[7px] hover:bg-surface-1 border-b border-hairline-tertiary cursor-pointer text-[13px]">
                    <svg width="14" height="14" className="shrink-0"><use href="#i-progress"/></svg>
                    <span className="font-mono text-[11px] text-ink-tertiary shrink-0 w-[54px]">NEB-218</span>
                    <svg width="12" height="12" className="shrink-0"><use href="#p-high"/></svg>
                    <span className="text-ink flex-1 truncate group-hover:text-primary-hover transition-colors">Push notifications arriving twice on iOS</span>
                    <span className="hidden lg:inline-flex items-center gap-1 shrink-0">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] bg-surface-1 border border-hairline-tertiary text-ink-muted"><span className="w-1.5 h-1.5 rounded-full bg-[#e5484d]"></span>bug</span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] bg-surface-1 border border-hairline-tertiary text-ink-muted"><span className="w-1.5 h-1.5 rounded-full bg-[#44b8da]"></span>mobile</span>
                    </span>
                    <span className="font-mono text-[10px] text-ink-tertiary shrink-0 hidden sm:inline w-6 text-right">2d</span>
                    <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-medium text-white" style={{background: '#5e6ad2'}}>KS</div>
                  </a>

                  <a className="group flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-[7px] hover:bg-surface-1 border-b border-hairline-tertiary cursor-pointer text-[13px]">
                    <svg width="14" height="14" className="shrink-0"><use href="#i-progress"/></svg>
                    <span className="font-mono text-[11px] text-ink-tertiary shrink-0 w-[54px]">NEB-217</span>
                    <svg width="12" height="12" className="shrink-0"><use href="#p-med"/></svg>
                    <span className="text-ink flex-1 truncate group-hover:text-primary-hover transition-colors">OAuth callback drops scope param on refresh</span>
                    <span className="hidden lg:inline-flex items-center gap-1 shrink-0">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] bg-surface-1 border border-hairline-tertiary text-ink-muted"><span className="w-1.5 h-1.5 rounded-full bg-[#f2994a]"></span>backend</span>
                    </span>
                    <span className="font-mono text-[10px] text-ink-tertiary shrink-0 hidden sm:inline w-6 text-right">5d</span>
                    <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-medium text-white" style={{background: '#44b8da'}}>TS</div>
                  </a>

                  <a className="group flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-[7px] hover:bg-surface-1 border-b border-hairline-tertiary cursor-pointer text-[13px]">
                    <svg width="14" height="14" className="shrink-0"><use href="#i-progress"/></svg>
                    <span className="font-mono text-[11px] text-ink-tertiary shrink-0 w-[54px]">NEB-216</span>
                    <svg width="12" height="12" className="shrink-0"><use href="#p-urgent"/></svg>
                    <span className="text-ink flex-1 truncate group-hover:text-primary-hover transition-colors">Cycle view crashes when switching teams quickly</span>
                    <span className="hidden lg:inline-flex items-center gap-1 shrink-0">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] bg-surface-1 border border-hairline-tertiary text-ink-muted"><span className="w-1.5 h-1.5 rounded-full bg-[#e5484d]"></span>bug</span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] bg-surface-1 border border-hairline-tertiary text-ink-muted"><span className="w-1.5 h-1.5 rounded-full bg-[#bf7ce4]"></span>web</span>
                    </span>
                    <span className="font-mono text-[10px] text-ink-tertiary shrink-0 hidden sm:inline w-6 text-right">1d</span>
                    <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-medium text-white" style={{background: '#f2994a'}}>NP</div>
                  </a>

                  <a className="group flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-[7px] hover:bg-surface-1 border-b border-hairline-tertiary cursor-pointer text-[13px]">
                    <svg width="14" height="14" className="shrink-0"><use href="#i-progress"/></svg>
                    <span className="font-mono text-[11px] text-ink-tertiary shrink-0 w-[54px]">NEB-214</span>
                    <svg width="12" height="12" className="shrink-0"><use href="#p-high"/></svg>
                    <span className="text-ink flex-1 truncate group-hover:text-primary-hover transition-colors">Webhook delivery retries exhausted silently</span>
                    <span className="hidden lg:inline-flex items-center gap-1 shrink-0">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] bg-surface-1 border border-hairline-tertiary text-ink-muted"><span className="w-1.5 h-1.5 rounded-full bg-[#f2994a]"></span>backend</span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] bg-surface-1 border border-hairline-tertiary text-ink-muted"><span className="w-1.5 h-1.5 rounded-full bg-[#c955f0]"></span>infra</span>
                    </span>
                    <span className="font-mono text-[10px] text-ink-tertiary shrink-0 hidden sm:inline w-6 text-right">3d</span>
                    <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-medium text-white" style={{background: '#27a644'}}>JM</div>
                  </a>

                  {/**/}
                  <div className="px-4 sm:px-5 py-1.5 flex items-center gap-2 text-[11px] bg-surface-1/40 border-b border-hairline-tertiary">
                    <svg width="12" height="12"><use href="#i-todo"/></svg>
                    <span className="font-medium text-ink-muted tracking-wide">Todo</span>
                    <span className="text-ink-tertiary">8</span>
                  </div>

                  <a className="group flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-[7px] hover:bg-surface-1 border-b border-hairline-tertiary cursor-pointer text-[13px]">
                    <svg width="14" height="14" className="shrink-0"><use href="#i-todo"/></svg>
                    <span className="font-mono text-[11px] text-ink-tertiary shrink-0 w-[54px]">NEB-213</span>
                    <svg width="12" height="12" className="shrink-0"><use href="#p-med"/></svg>
                    <span className="text-ink flex-1 truncate group-hover:text-primary-hover transition-colors">Dark mode contrast fails WCAG AA on issue detail</span>
                    <span className="hidden lg:inline-flex items-center gap-1 shrink-0">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] bg-surface-1 border border-hairline-tertiary text-ink-muted"><span className="w-1.5 h-1.5 rounded-full bg-[#bf7ce4]"></span>design</span>
                    </span>
                    <span className="font-mono text-[10px] text-ink-tertiary shrink-0 hidden sm:inline w-6 text-right"></span>
                    <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-medium text-white" style={{background: '#bf7ce4'}}>AR</div>
                  </a>

                  <a className="group flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-[7px] hover:bg-surface-1 border-b border-hairline-tertiary cursor-pointer text-[13px]">
                    <svg width="14" height="14" className="shrink-0"><use href="#i-todo"/></svg>
                    <span className="font-mono text-[11px] text-ink-tertiary shrink-0 w-[54px]">NEB-211</span>
                    <svg width="12" height="12" className="shrink-0"><use href="#p-low"/></svg>
                    <span className="text-ink flex-1 truncate group-hover:text-primary-hover transition-colors">Export CSV includes soft-deleted rows</span>
                    <span className="hidden lg:inline-flex items-center gap-1 shrink-0">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] bg-surface-1 border border-hairline-tertiary text-ink-muted"><span className="w-1.5 h-1.5 rounded-full bg-[#f2994a]"></span>backend</span>
                    </span>
                    <span className="font-mono text-[10px] text-ink-tertiary shrink-0 hidden sm:inline w-6 text-right"></span>
                    <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-medium text-white" style={{background: '#44b8da'}}>TS</div>
                  </a>

                  <a className="group flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-[7px] hover:bg-surface-1 border-b border-hairline-tertiary cursor-pointer text-[13px]">
                    <svg width="14" height="14" className="shrink-0"><use href="#i-todo"/></svg>
                    <span className="font-mono text-[11px] text-ink-tertiary shrink-0 w-[54px]">NEB-208</span>
                    <svg width="12" height="12" className="shrink-0"><use href="#p-med"/></svg>
                    <span className="text-ink flex-1 truncate group-hover:text-primary-hover transition-colors">Migrate primary DB to Postgres 16</span>
                    <span className="hidden lg:inline-flex items-center gap-1 shrink-0">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] bg-surface-1 border border-hairline-tertiary text-ink-muted"><span className="w-1.5 h-1.5 rounded-full bg-[#c955f0]"></span>infra</span>
                    </span>
                    <span className="font-mono text-[10px] text-ink-tertiary shrink-0 hidden sm:inline w-6 text-right"></span>
                    <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-medium text-white" style={{background: '#27a644'}}>JM</div>
                  </a>

                  <a className="group flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-[7px] hover:bg-surface-1 border-b border-hairline-tertiary cursor-pointer text-[13px]">
                    <svg width="14" height="14" className="shrink-0"><use href="#i-todo"/></svg>
                    <span className="font-mono text-[11px] text-ink-tertiary shrink-0 w-[54px]">NEB-207</span>
                    <svg width="12" height="12" className="shrink-0"><use href="#p-low"/></svg>
                    <span className="text-ink flex-1 truncate group-hover:text-primary-hover transition-colors">Onboarding checklist never completes for SSO users</span>
                    <span className="hidden lg:inline-flex items-center gap-1 shrink-0">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] bg-surface-1 border border-hairline-tertiary text-ink-muted"><span className="w-1.5 h-1.5 rounded-full bg-[#bf7ce4]"></span>web</span>
                    </span>
                    <span className="font-mono text-[10px] text-ink-tertiary shrink-0 hidden sm:inline w-6 text-right"></span>
                    <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-medium text-white" style={{background: '#e5484d'}}>DK</div>
                  </a>

                  <a className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-1.5 hover:bg-surface-1 border-b border-hairline-tertiary cursor-pointer text-[12px] text-ink-tertiary hover:text-ink-subtle">
                    <span className="w-[14px] shrink-0"></span>
                    <span className="ml-[68px]">+ 4 more in Todo</span>
                  </a>

                  {/**/}
                  <div className="px-4 sm:px-5 py-1.5 flex items-center gap-2 text-[11px] bg-surface-1/40 border-b border-hairline-tertiary">
                    <svg width="12" height="12"><use href="#i-backlog"/></svg>
                    <span className="font-medium text-ink-muted tracking-wide">Backlog</span>
                    <span className="text-ink-tertiary">47</span>
                  </div>

                  <a className="group flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-[7px] hover:bg-surface-1 border-b border-hairline-tertiary cursor-pointer text-[13px]">
                    <svg width="14" height="14" className="shrink-0"><use href="#i-backlog"/></svg>
                    <span className="font-mono text-[11px] text-ink-tertiary shrink-0 w-[54px]">NEB-205</span>
                    <svg width="12" height="12" className="shrink-0"><use href="#p-low"/></svg>
                    <span className="text-ink-muted flex-1 truncate group-hover:text-ink transition-colors">Cmd+K palette slow with 500+ items</span>
                    <span className="hidden lg:inline-flex items-center gap-1 shrink-0">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] bg-surface-1 border border-hairline-tertiary text-ink-tertiary"><span className="w-1.5 h-1.5 rounded-full bg-[#27a644]"></span>perf</span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] bg-surface-1 border border-hairline-tertiary text-ink-tertiary"><span className="w-1.5 h-1.5 rounded-full bg-[#bf7ce4]"></span>web</span>
                    </span>
                    <span className="font-mono text-[10px] text-ink-tertiary shrink-0 hidden sm:inline w-6 text-right"></span>
                    <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-medium text-white" style={{background: '#5e6ad2'}}>KS</div>
                  </a>

                  <a className="group flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-[7px] hover:bg-surface-1 border-b border-hairline-tertiary cursor-pointer text-[13px]">
                    <svg width="14" height="14" className="shrink-0"><use href="#i-backlog"/></svg>
                    <span className="font-mono text-[11px] text-ink-tertiary shrink-0 w-[54px]">NEB-201</span>
                    <svg width="12" height="12" className="shrink-0"><use href="#p-med"/></svg>
                    <span className="text-ink-muted flex-1 truncate group-hover:text-ink transition-colors">Insights burndown excludes weekends inconsistently</span>
                    <span className="hidden lg:inline-flex items-center gap-1 shrink-0">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] bg-surface-1 border border-hairline-tertiary text-ink-tertiary"><span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2]"></span>insights</span>
                    </span>
                    <span className="font-mono text-[10px] text-ink-tertiary shrink-0 hidden sm:inline w-6 text-right"></span>
                    <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-medium text-white" style={{background: '#f2994a'}}>NP</div>
                  </a>

                  <a className="group flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-[7px] hover:bg-surface-1 border-b border-hairline-tertiary cursor-pointer text-[13px]">
                    <svg width="14" height="14" className="shrink-0"><use href="#i-backlog"/></svg>
                    <span className="font-mono text-[11px] text-ink-tertiary shrink-0 w-[54px]">NEB-198</span>
                    <svg width="12" height="12" className="shrink-0"><use href="#p-low"/></svg>
                    <span className="text-ink-muted flex-1 truncate group-hover:text-ink transition-colors">SAML metadata endpoint returns 404 on subdomain</span>
                    <span className="hidden lg:inline-flex items-center gap-1 shrink-0">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] bg-surface-1 border border-hairline-tertiary text-ink-tertiary"><span className="w-1.5 h-1.5 rounded-full bg-[#c955f0]"></span>infra</span>
                    </span>
                    <span className="font-mono text-[10px] text-ink-tertiary shrink-0 hidden sm:inline w-6 text-right"></span>
                    <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-medium text-white" style={{background: '#44b8da'}}>TS</div>
                  </a>

                  <a className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-1.5 hover:bg-surface-1 cursor-pointer text-[12px] text-ink-tertiary hover:text-ink-subtle">
                    <span className="w-[14px] shrink-0"></span>
                    <span className="ml-[68px]">+ 44 more in Backlog</span>
                  </a>

                </div>

                {/**/}
                <footer className="border-t border-hairline-tertiary px-4 sm:px-5 py-2 flex items-center justify-between text-[11px] text-ink-tertiary">
                  <span>Showing 11 of 24 issues</span>
                  <span className="hidden sm:flex items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      <kbd className="font-mono px-1 py-0.5 rounded-sm bg-surface-1 border border-hairline-tertiary text-ink-subtle">⌘K</kbd>
                      Command menu
                    </span>
                    <span>·</span>
                    <span>Updated 2m ago</span>
                  </span>
                </footer>

              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/**/}
  <section className="py-16 lg:py-20 border-t border-hairline-tertiary">
    <div className="mx-auto max-w-content px-6 lg:px-8">
      <p className="text-center text-[12px] text-ink-subtle mb-10 eyebrow">Where high-performance teams plan</p>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-x-8 gap-y-8 items-center justify-items-center">
        {/**/}
        <div className="flex items-center gap-2 justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#8a8f98" stroke="#8a8f98" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="5" cy="6" r="2"/>
            <circle cx="19" cy="6" r="2"/>
            <circle cx="12" cy="18" r="2"/>
            <line x1="5" y1="6" x2="19" y2="6" strokeWidth="1.2"/>
            <line x1="5" y1="6" x2="12" y2="18" strokeWidth="1.2"/>
            <line x1="19" y1="6" x2="12" y2="18" strokeWidth="1.2"/>
          </svg>
          <span className="text-ink-subtle text-[14px] font-display font-medium tracking-wordmark">Tailscale</span>
        </div>

        {/**/}
        <div className="flex items-center gap-2 justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#8a8f98">
            <path d="M3 18 V10 Q3 7 6 7 Q9 7 9 10 V18 M9 10 Q9 7 12 7 Q15 7 15 10 V18 M15 10 Q15 7 18 7 Q21 7 21 10 V18" stroke="#8a8f98" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <span className="text-ink-subtle text-[14px] font-display font-medium tracking-wordmark">Modal</span>
        </div>

        {/**/}
        <div className="flex items-center gap-2 justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a8f98" strokeWidth="2.2" strokeLinecap="round">
            <path d="M3 14 Q7 6 12 12 Q17 18 21 10" />
          </svg>
          <span className="text-ink-subtle text-[14px] font-display font-medium tracking-wordmark">Supabase</span>
        </div>

        {/**/}
        <div className="flex items-center gap-2 justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a8f98" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 16 Q4 8 12 6 Q20 8 20 16 Z" fill="#8a8f98"/>
            <line x1="8" y1="6" x2="6" y2="3"/>
            <line x1="12" y1="5" x2="12" y2="2"/>
            <line x1="16" y1="6" x2="18" y2="3"/>
            <line x1="10" y1="5.5" x2="9" y2="2.5"/>
            <line x1="14" y1="5.5" x2="15" y2="2.5"/>
            <circle cx="15" cy="14" r="1" fill="#08080a" stroke="none"/>
          </svg>
          <span className="text-ink-subtle text-[14px] font-display font-medium tracking-wordmark">PostHog</span>
        </div>

        {/**/}
        <div className="flex items-center gap-2 justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="4" fill="#8a8f98"/>
            <path d="M9 16 V8 M9 8 H14 Q16 8 16 10 Q16 12 14 12 H9 M12 12 L16 16" stroke="#08080a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          <span className="text-ink-subtle text-[14px] font-display font-medium tracking-wordmark">Replit</span>
        </div>

        {/**/}
        <div className="flex items-center gap-2 justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="4" fill="#8a8f98"/>
            <path d="M13 6 L8 13 H12 L11 18 L16 11 H12 Z" fill="#08080a"/>
          </svg>
          <span className="text-ink-subtle text-[14px] font-display font-medium tracking-wordmark">Raycast</span>
        </div>
      </div>
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 text-[13px]">
        <span className="text-ink-muted"><span className="text-ink font-medium">3,200+</span> engineers plan their work in Nebula every day.</span>
        <a href="#" className="text-ink-subtle hover:text-ink transition-colors underline underline-offset-4 decoration-hairline-strong">Read customer stories →</a>
      </div>
    </div>
  </section>

  {/**/}
  <section className="py-20 lg:py-24">
    <div className="mx-auto max-w-content px-6 lg:px-8">

      {/**/}
      <div className="max-w-2xl mb-16">
        <p className="eyebrow text-ink-subtle mb-3">Why Nebula</p>
        <h2 className="text-[34px] sm:text-[44px] lg:text-[56px] leading-[1.10] font-display font-semibold tracking-display-lg text-ink">
          Every detail, considered.
        </h2>
        <p className="mt-4 text-[18px] leading-[1.5] tracking-body-lg text-ink-muted">
          From keyboard-first navigation to real-time sync, Nebula is built to keep your team in flow.
        </p>
      </div>

      {/**/}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/**/}
        <article className="panel-highlight bg-surface-1 border border-hairline rounded-lg p-6 flex flex-col">
          <div className="rounded-lg overflow-hidden bg-[#08080a] mb-5 border border-hairline-tertiary">
            <div className="p-2.5">
              {/**/}
              <div className="flex items-center gap-2 px-2.5 py-2 mb-2 bg-surface-1 border border-hairline rounded-md">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8a8f98" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
                <span className="text-[12px] text-ink flex-1">Go to issue<span className="inline-block w-px h-3 bg-primary ml-0.5 align-middle"></span></span>
                <kbd className="text-[9px] text-ink-tertiary font-mono px-1 py-0.5 rounded-sm bg-canvas border border-hairline-tertiary">esc</kbd>
              </div>

              {/**/}
              <div className="px-1.5 pt-1.5 pb-1 text-[9px] text-ink-tertiary eyebrow">Recent issues</div>
              <div className="space-y-px">
                <div className="flex items-center gap-2 px-1.5 py-1.5 rounded-md bg-primary/10 border border-primary/20">
                  <svg width="11" height="11" className="shrink-0"><use href="#i-progress"/></svg>
                  <span className="font-mono text-[10px] text-ink-tertiary shrink-0">NEB-218</span>
                  <span className="text-[11px] text-ink flex-1 truncate">Push notifications arriving twice on iOS</span>
                </div>
                <div className="flex items-center gap-2 px-1.5 py-1.5 rounded-md hover:bg-surface-1">
                  <svg width="11" height="11" className="shrink-0"><use href="#i-todo"/></svg>
                  <span className="font-mono text-[10px] text-ink-tertiary shrink-0">NEB-213</span>
                  <span className="text-[11px] text-ink-muted flex-1 truncate">Dark mode contrast fails WCAG AA</span>
                </div>
                <div className="flex items-center gap-2 px-1.5 py-1.5 rounded-md hover:bg-surface-1">
                  <svg width="11" height="11" className="shrink-0"><use href="#i-todo"/></svg>
                  <span className="font-mono text-[10px] text-ink-tertiary shrink-0">NEB-208</span>
                  <span className="text-[11px] text-ink-muted flex-1 truncate">Migrate primary DB to Postgres 16</span>
                </div>
              </div>

              {/**/}
              <div className="px-1.5 pt-2.5 pb-1 text-[9px] text-ink-tertiary eyebrow">Commands</div>
              <div className="space-y-px">
                <div className="flex items-center gap-2 px-1.5 py-1.5 rounded-md hover:bg-surface-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8a8f98" strokeWidth="2" strokeLinecap="round" className="shrink-0"><path d="M12 5v14M5 12h14"/></svg>
                  <span className="text-[11px] text-ink-muted flex-1">Create new issue</span>
                  <kbd className="text-[9px] text-ink-tertiary font-mono">⌘N</kbd>
                </div>
                <div className="flex items-center gap-2 px-1.5 py-1.5 rounded-md hover:bg-surface-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8a8f98" strokeWidth="2" strokeLinecap="round" className="shrink-0"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                  <span className="text-[11px] text-ink-muted flex-1">Jump to project</span>
                  <kbd className="text-[9px] text-ink-tertiary font-mono">⌘P</kbd>
                </div>
                <div className="flex items-center gap-2 px-1.5 py-1.5 rounded-md hover:bg-surface-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8a8f98" strokeWidth="2" strokeLinecap="round" className="shrink-0"><path d="M7 16l-4-4 4-4M17 8l4 4-4 4M14 4l-4 16"/></svg>
                  <span className="text-[11px] text-ink-muted flex-1">Switch team</span>
                  <kbd className="text-[9px] text-ink-tertiary font-mono">⌘T</kbd>
                </div>
              </div>

              {/**/}
              <div className="mt-2.5 pt-2 border-t border-hairline-tertiary flex items-center justify-between text-[9px] text-ink-tertiary">
                <span><kbd className="font-mono">↑↓</kbd> navigate</span>
                <span><kbd className="font-mono">↵</kbd> select</span>
                <span><kbd className="font-mono">esc</kbd> close</span>
              </div>
            </div>
          </div>
          <h3 className="text-[22px] leading-[1.25] tracking-card-title font-display font-medium text-ink mb-2">Built for speed</h3>
          <p className="text-[14px] leading-[1.5] text-ink-subtle">Every interaction is optimized to be instant — no spinner, no waiting, no friction. Command palette, keyboard shortcuts, and offline-first sync.</p>
        </article>

        {/**/}
        <article className="panel-highlight bg-surface-1 border border-hairline rounded-lg p-6 flex flex-col">
          <div className="rounded-lg overflow-hidden bg-[#08080a] mb-5 border border-hairline-tertiary">
            <div className="p-3">
              {/**/}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[13px] text-ink font-medium">Cycle 14</div>
                  <div className="text-[10px] text-ink-tertiary font-mono">Jul 8 — Jul 22</div>
                </div>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] bg-semantic-success/15 text-semantic-success border border-semantic-success/30">
                  <span className="w-1 h-1 rounded-full bg-semantic-success"></span>
                  On track
                </span>
              </div>

              {/**/}
              <div className="flex h-1.5 rounded-full overflow-hidden bg-surface-1 mb-2">
                <div className="bg-semantic-success" style={{width: '45%'}}></div>
                <div className="bg-primary" style={{width: '20%'}}></div>
                <div className="bg-ink-tertiary" style={{width: '12%'}}></div>
                <div className="bg-surface-3" style={{width: '23%'}}></div>
              </div>
              <div className="flex items-center justify-between text-[10px] mb-3">
                <span className="text-ink-muted"><span className="text-ink font-medium">12</span> of 18 done</span>
                <span className="text-ink-tertiary">4 days left</span>
              </div>

              {/**/}
              <div className="space-y-px">
                <div className="flex items-center gap-2 px-1 py-1 rounded-md hover:bg-surface-1">
                  <svg width="11" height="11" className="shrink-0"><use href="#i-progress"/></svg>
                  <span className="font-mono text-[10px] text-ink-tertiary shrink-0">NEB-218</span>
                  <span className="text-[11px] text-ink-muted flex-1 truncate">Push notifications arriving twice on iOS</span>
                  <div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-[7px] font-medium text-white" style={{background: '#5e6ad2'}}>KS</div>
                </div>
                <div className="flex items-center gap-2 px-1 py-1 rounded-md hover:bg-surface-1">
                  <svg width="11" height="11" className="shrink-0"><use href="#i-done"/></svg>
                  <span className="font-mono text-[10px] text-ink-tertiary shrink-0">NEB-215</span>
                  <span className="text-[11px] text-ink-tertiary flex-1 truncate line-through">Webhook signature verification</span>
                  <div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-[7px] font-medium text-white" style={{background: '#27a644'}}>JM</div>
                </div>
                <div className="flex items-center gap-2 px-1 py-1 rounded-md hover:bg-surface-1">
                  <svg width="11" height="11" className="shrink-0"><use href="#i-progress"/></svg>
                  <span className="font-mono text-[10px] text-ink-tertiary shrink-0">NEB-217</span>
                  <span className="text-[11px] text-ink-muted flex-1 truncate">OAuth callback drops scope param</span>
                  <div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-[7px] font-medium text-white" style={{background: '#44b8da'}}>TS</div>
                </div>
                <div className="flex items-center gap-2 px-1 py-1 rounded-md hover:bg-surface-1">
                  <svg width="11" height="11" className="shrink-0"><use href="#i-todo"/></svg>
                  <span className="font-mono text-[10px] text-ink-tertiary shrink-0">NEB-213</span>
                  <span className="text-[11px] text-ink-muted flex-1 truncate">Dark mode contrast fails WCAG AA</span>
                  <div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-[7px] font-medium text-white" style={{background: '#bf7ce4'}}>AR</div>
                </div>
                <div className="flex items-center gap-2 px-1 py-1 rounded-md hover:bg-surface-1">
                  <svg width="11" height="11" className="shrink-0"><use href="#i-todo"/></svg>
                  <span className="font-mono text-[10px] text-ink-tertiary shrink-0">NEB-208</span>
                  <span className="text-[11px] text-ink-muted flex-1 truncate">Migrate primary DB to Postgres 16</span>
                  <div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center text-[7px] font-medium text-white" style={{background: '#27a644'}}>JM</div>
                </div>
              </div>

              {/**/}
              <div className="mt-2.5 pt-2 border-t border-hairline-tertiary flex items-center justify-between text-[10px]">
                <span className="text-ink-tertiary">Scope <span className="text-ink-muted">18</span></span>
                <span className="text-ink-tertiary">Velocity <span className="text-ink-muted">23</span></span>
                <span className="text-ink-tertiary">+2 added</span>
              </div>
            </div>
          </div>
          <h3 className="text-[22px] leading-[1.25] tracking-card-title font-display font-medium text-ink mb-2">Roadmaps that adapt</h3>
          <p className="text-[14px] leading-[1.5] text-ink-subtle">Plan with cycles, projects, and milestones. Update priorities in a keystroke and the roadmap follows — no rebuild required.</p>
        </article>

        {/**/}
        <article className="panel-highlight bg-surface-1 border border-hairline rounded-lg p-6 flex flex-col">
          <div className="rounded-lg overflow-hidden bg-[#08080a] mb-5 border border-hairline-tertiary">
            <div className="p-3">
              {/**/}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[13px] text-ink font-medium">Burndown</div>
                  <div className="text-[10px] text-ink-tertiary font-mono">Cycle 14 · Day 10 of 14</div>
                </div>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10px] bg-semantic-success/15 text-semantic-success border border-semantic-success/30">
                  <span className="w-1 h-1 rounded-full bg-semantic-success"></span>
                  On track
                </span>
              </div>

              {/**/}
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                <div className="px-2 py-1.5 bg-surface-1 border border-hairline-tertiary rounded-md">
                  <div className="text-[9px] text-ink-tertiary eyebrow">Velocity</div>
                  <div className="text-[13px] text-ink font-medium">23</div>
                </div>
                <div className="px-2 py-1.5 bg-surface-1 border border-hairline-tertiary rounded-md">
                  <div className="text-[9px] text-ink-tertiary eyebrow">Scope</div>
                  <div className="text-[13px] text-ink font-medium">18</div>
                </div>
                <div className="px-2 py-1.5 bg-surface-1 border border-hairline-tertiary rounded-md">
                  <div className="text-[9px] text-ink-tertiary eyebrow">Done</div>
                  <div className="text-[13px] text-semantic-success font-medium">12</div>
                </div>
              </div>

              {/**/}
              <div className="bg-surface-1 border border-hairline-tertiary rounded-md p-2 mb-2">
                <svg viewBox="0 0 280 120" className="w-full h-auto" preserveAspectRatio="none">
                  {/**/}
                  <line x1="20" y1="20" x2="270" y2="20" stroke="#1b1d21" strokeWidth="1"/>
                  <line x1="20" y1="50" x2="270" y2="50" stroke="#1b1d21" strokeWidth="1"/>
                  <line x1="20" y1="80" x2="270" y2="80" stroke="#1b1d21" strokeWidth="1"/>
                  <line x1="20" y1="110" x2="270" y2="110" stroke="#1b1d21" strokeWidth="1"/>

                  {/**/}
                  <text x="14" y="24" fill="#62666d" font-size="8" font-family="ui-monospace, SF Mono, monospace" text-anchor="end">18</text>
                  <text x="14" y="54" fill="#62666d" font-size="8" font-family="ui-monospace, SF Mono, monospace" text-anchor="end">12</text>
                  <text x="14" y="84" fill="#62666d" font-size="8" font-family="ui-monospace, SF Mono, monospace" text-anchor="end">6</text>
                  <text x="14" y="114" fill="#62666d" font-size="8" font-family="ui-monospace, SF Mono, monospace" text-anchor="end">0</text>

                  {/**/}
                  <text x="20" y="118" fill="#62666d" font-size="7" font-family="ui-monospace, SF Mono, monospace">1</text>
                  <text x="92" y="118" fill="#62666d" font-size="7" font-family="ui-monospace, SF Mono, monospace">4</text>
                  <text x="164" y="118" fill="#62666d" font-size="7" font-family="ui-monospace, SF Mono, monospace">7</text>
                  <text x="200" y="118" fill="#62666d" font-size="7" font-family="ui-monospace, SF Mono, monospace">10</text>
                  <text x="270" y="118" fill="#62666d" font-size="7" font-family="ui-monospace, SF Mono, monospace" text-anchor="end">14</text>

                  {/**/}
                  <line x1="20" y1="20" x2="270" y2="110" stroke="#62666d" strokeWidth="1.5" strokeDasharray="3 3"/>

                  {/**/}
                  <polyline points="20,20 56,30 92,42 128,52 164,62 200,68" fill="none" stroke="#5e6ad2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

                  {/**/}
                  <polygon points="20,20 56,30 92,42 128,52 164,62 200,68 200,110 20,110" fill="#5e6ad2" opacity="0.08"/>

                  {/**/}
                  <circle cx="200" cy="68" r="3" fill="#5e6ad2"/>
                  <circle cx="200" cy="68" r="6" fill="#5e6ad2" opacity="0.2"/>

                  {/**/}
                  <line x1="200" y1="68" x2="270" y2="95" stroke="#5e6ad2" strokeWidth="1.5" strokeDasharray="2 3" opacity="0.5"/>
                </svg>
              </div>

              {/**/}
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-ink-muted">
                  <span className="w-3 h-px bg-ink-tertiary" style={{borderTop: '1px dashed #62666d'}}></span>
                  Ideal
                </span>
                <span className="flex items-center gap-1 text-ink-muted">
                  <span className="w-3 h-0.5 bg-primary rounded-full"></span>
                  Actual
                </span>
                <span className="flex items-center gap-1 text-ink-tertiary ml-auto">
                  Updated 2m ago
                </span>
              </div>
            </div>
          </div>
          <h3 className="text-[22px] leading-[1.25] tracking-card-title font-display font-medium text-ink mb-2">Insights in real time</h3>
          <p className="text-[14px] leading-[1.5] text-ink-subtle">Burndown charts, velocity, and cycle reports — computed live as your team ships. Spot blockers before they cost you a week.</p>
        </article>
      </div>
    </div>
  </section>

  {/**/}
  <section className="pb-20 lg:pb-24">
    <div className="mx-auto max-w-content px-6 lg:px-8">
      <div className="max-w-2xl mb-12">
        <p className="eyebrow text-ink-subtle mb-3">The workspace</p>
        <h2 className="text-[30px] sm:text-[40px] leading-[1.15] font-display font-semibold tracking-display-md text-ink">
          One tool, end-to-end.
        </h2>
        <p className="mt-4 text-[18px] leading-[1.5] tracking-body-lg text-ink-muted">
          Triage, plan, build, and ship — without ever leaving the canvas.
        </p>
      </div>

      <div className="panel-highlight bg-surface-1 border border-hairline rounded-xl p-3 sm:p-4">
        {/**/}
        <div className="rounded-lg overflow-hidden bg-[#08080a] border border-hairline-tertiary">
          <div className="flex min-h-[440px] sm:min-h-[520px] lg:min-h-[600px]">

            {/**/}
            <aside className="hidden sm:flex flex-col w-[240px] lg:w-[280px] shrink-0 border-r border-hairline-tertiary bg-[#08080a]">
              {/**/}
              <div className="px-3 py-2.5 border-b border-hairline-tertiary flex items-center justify-between">
                <span className="text-[12px] text-ink font-medium">My Issues</span>
                <div className="flex items-center gap-1">
                  <button className="p-1 rounded text-ink-subtle hover:text-ink hover:bg-surface-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16l-6 7v6l-4 2v-8z"/></svg>
                  </button>
                  <button className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-on-primary bg-primary rounded">+ New</button>
                </div>
              </div>

              {/**/}
              <div className="px-3 border-b border-hairline-tertiary flex gap-1 text-[11px]">
                <button className="py-2 px-0.5 mr-2 text-ink border-b-2 border-primary -mb-px">All <span className="text-ink-tertiary">24</span></button>
                <button className="py-2 px-0.5 mr-2 text-ink-subtle border-b-2 border-transparent -mb-px">Active <span className="text-ink-tertiary">12</span></button>
              </div>

              {/**/}
              <div className="px-3 py-1.5 flex items-center gap-1.5 text-[10px] bg-surface-1/40 border-b border-hairline-tertiary">
                <svg width="10" height="10"><use href="#i-progress"/></svg>
                <span className="font-medium text-ink-muted tracking-wide">In Progress</span>
                <span className="text-ink-tertiary">4</span>
              </div>

              <a className="group flex items-center gap-2 px-3 py-1.5 bg-primary/10 border-l-2 border-primary border-b border-hairline-tertiary cursor-pointer text-[12px]">
                <svg width="12" height="12" className="shrink-0"><use href="#i-progress"/></svg>
                <span className="font-mono text-[10px] text-ink-tertiary shrink-0 w-[48px]">NEB-218</span>
                <span className="text-ink flex-1 truncate">Push notifications arriving twice on iOS</span>
              </a>
              <a className="flex items-center gap-2 px-3 py-1.5 hover:bg-surface-1 border-b border-hairline-tertiary cursor-pointer text-[12px]">
                <svg width="12" height="12" className="shrink-0"><use href="#i-progress"/></svg>
                <span className="font-mono text-[10px] text-ink-tertiary shrink-0 w-[48px]">NEB-216</span>
                <span className="text-ink-muted flex-1 truncate">Cycle view crashes when switching teams</span>
              </a>
              <a className="flex items-center gap-2 px-3 py-1.5 hover:bg-surface-1 border-b border-hairline-tertiary cursor-pointer text-[12px]">
                <svg width="12" height="12" className="shrink-0"><use href="#i-progress"/></svg>
                <span className="font-mono text-[10px] text-ink-tertiary shrink-0 w-[48px]">NEB-214</span>
                <span className="text-ink-muted flex-1 truncate">Webhook delivery retries exhausted</span>
              </a>

              {/**/}
              <div className="px-3 py-1.5 flex items-center gap-1.5 text-[10px] bg-surface-1/40 border-b border-hairline-tertiary">
                <svg width="10" height="10"><use href="#i-todo"/></svg>
                <span className="font-medium text-ink-muted tracking-wide">Todo</span>
                <span className="text-ink-tertiary">8</span>
              </div>
              <a className="flex items-center gap-2 px-3 py-1.5 hover:bg-surface-1 border-b border-hairline-tertiary cursor-pointer text-[12px]">
                <svg width="12" height="12" className="shrink-0"><use href="#i-todo"/></svg>
                <span className="font-mono text-[10px] text-ink-tertiary shrink-0 w-[48px]">NEB-213</span>
                <span className="text-ink-muted flex-1 truncate">Dark mode contrast fails WCAG AA</span>
              </a>
              <a className="flex items-center gap-2 px-3 py-1.5 hover:bg-surface-1 border-b border-hairline-tertiary cursor-pointer text-[12px]">
                <svg width="12" height="12" className="shrink-0"><use href="#i-todo"/></svg>
                <span className="font-mono text-[10px] text-ink-tertiary shrink-0 w-[48px]">NEB-208</span>
                <span className="text-ink-muted flex-1 truncate">Migrate primary DB to Postgres 16</span>
              </a>
              <a className="flex items-center gap-2 px-3 py-1.5 hover:bg-surface-1 border-b border-hairline-tertiary cursor-pointer text-[12px]">
                <svg width="12" height="12" className="shrink-0"><use href="#i-todo"/></svg>
                <span className="font-mono text-[10px] text-ink-tertiary shrink-0 w-[48px]">NEB-207</span>
                <span className="text-ink-muted flex-1 truncate">Onboarding checklist never completes</span>
              </a>
            </aside>

            {/**/}
            <main className="flex-1 flex flex-col min-w-0 bg-[#0a0a0c]">
              {/**/}
              <header className="px-4 sm:px-6 py-2.5 border-b border-hairline-tertiary flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[12px]">
                  <span className="text-ink-tertiary">Core</span>
                  <span className="text-ink-tertiary">/</span>
                  <span className="font-mono text-ink-muted">NEB-218</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded text-ink-subtle hover:text-ink hover:bg-surface-1" aria-label="Copy">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
                  </button>
                  <button className="p-1.5 rounded text-ink-subtle hover:text-ink hover:bg-surface-1" aria-label="More">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-hidden">
                <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 max-w-[680px]">

                  {/**/}
                  <h1 className="text-[20px] sm:text-[22px] lg:text-[24px] leading-[1.25] tracking-card-title font-display font-medium text-ink mb-4">
                    Push notifications arriving twice on iOS
                  </h1>

                  {/**/}
                  <div className="flex flex-wrap items-center gap-2 mb-5 text-[11px]">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/15 text-primary border border-primary/25">
                      <svg width="11" height="11"><use href="#i-progress"/></svg>
                      In Progress
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-1 text-ink-muted border border-hairline-tertiary">
                      <svg width="11" height="11"><use href="#p-high"/></svg>
                      High
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-1 text-ink-muted border border-hairline-tertiary">
                      <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-medium text-white" style={{background: '#5e6ad2'}}>KS</div>
                      Karri Saarinen
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-1 text-ink-muted border border-hairline-tertiary">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e5484d]"></span>bug
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-1 text-ink-muted border border-hairline-tertiary">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#44b8da]"></span>mobile
                    </span>
                  </div>

                  {/**/}
                  <div className="text-[13px] leading-[1.6] tracking-body text-ink-muted space-y-3 mb-6">
                    <p>Push notifications are being delivered twice to iOS devices when the app is in the background. Reproduces on iOS 17.2+ with the 2.4.1 build.</p>
                    <p className="text-ink-subtle">Steps to reproduce:</p>
                    <ul className="space-y-1.5 pl-1">
                      <li className="flex gap-2"><span className="text-ink-tertiary">1.</span> <span>Send a push to a device in background</span></li>
                      <li className="flex gap-2"><span className="text-ink-tertiary">2.</span> <span>Wait for delivery — notification fires immediately</span></li>
                      <li className="flex gap-2"><span className="text-ink-tertiary">3.</span> <span>~3s later, same notification fires again with identical payload</span></li>
                    </ul>
                    <p>Suspect the content-available handler is invoking the completion twice — the APNs receipt arrives after the silent push, triggering a second invocation.</p>
                  </div>

                  {/**/}
                  <div className="flex items-center gap-2 mb-3 text-[11px] text-ink-tertiary eyebrow">
                    <span className="flex-1 h-px bg-hairline-tertiary"></span>
                    Activity
                    <span className="flex-1 h-px bg-hairline-tertiary"></span>
                  </div>

                  {/**/}
                  <div className="space-y-4">

                    {/**/}
                    <div className="flex gap-2.5">
                      <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-medium text-white" style={{background: '#f2994a'}}>NP</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-[12px] text-ink font-medium">Nan Yu</span>
                          <span className="text-[10px] text-ink-tertiary font-mono">2h ago</span>
                        </div>
                        <p className="text-[13px] leading-[1.55] text-ink-muted">Reproduced locally. Stopping the second invocation at the delegate guard fixes it, but worth checking if we're sending duplicates from the server.</p>
                      </div>
                    </div>

                    {/**/}
                    <div className="flex gap-2.5">
                      <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-medium text-white" style={{background: '#44b8da'}}>TS</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-[12px] text-ink font-medium">Tuomas Sandholm</span>
                          <span className="text-[10px] text-ink-tertiary font-mono">1h ago</span>
                        </div>
                        <p className="text-[13px] leading-[1.55] text-ink-muted">Server logs show single send per device token. It's a client-side duplicate. PR incoming.</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/**/}
              <footer className="border-t border-hairline-tertiary px-4 sm:px-6 py-3 flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-medium text-white" style={{background: '#5e6ad2'}}>KS</div>
                <div className="flex-1 px-3 py-2 bg-surface-1 border border-hairline rounded-md text-[12px] text-ink-tertiary">Comment…</div>
                <button className="px-2.5 py-1.5 text-[11px] font-medium text-ink-subtle bg-surface-1 border border-hairline rounded-md hover:bg-surface-2">Comment</button>
              </footer>
            </main>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/**/}
  <section className="py-20 lg:py-24 border-t border-hairline-tertiary">
    <div className="mx-auto max-w-content px-6 lg:px-8">
      <div className="max-w-2xl mb-16">
        <p className="eyebrow text-ink-subtle mb-3">Customers</p>
        <h2 className="text-[34px] sm:text-[44px] lg:text-[56px] leading-[1.10] font-display font-semibold tracking-display-lg text-ink">
          Loved by makers.
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/**/}
        <article className="panel-highlight bg-surface-1 border border-hairline rounded-lg p-8 flex flex-col">
          <blockquote className="text-[18px] leading-[1.5] tracking-body-lg text-ink mb-6 flex-1">
            "Nebula is the first tool that didn't ask us to change how we work. It just kept up."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-[12px] font-medium text-white" style={{background: '#5e6ad2'}}>KS</div>
            <div>
              <div className="text-[14px] font-medium text-ink">Karri Saarinen</div>
              <div className="text-[14px] text-ink-subtle">CEO, Aesthetically</div>
            </div>
          </div>
        </article>

        {/**/}
        <article className="panel-highlight bg-surface-1 border border-hairline rounded-lg p-8 flex flex-col">
          <blockquote className="text-[18px] leading-[1.5] tracking-body-lg text-ink mb-6 flex-1">
            "We moved off three tools in a month. Nebula just does it all — and faster."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-[12px] font-medium text-white" style={{background: '#44b8da'}}>TS</div>
            <div>
              <div className="text-[14px] font-medium text-ink">Tuomas Sandholm</div>
              <div className="text-[14px] text-ink-subtle">Staff Eng, Fermi Labs</div>
            </div>
          </div>
        </article>

        {/**/}
        <article className="panel-highlight bg-surface-1 border border-hairline rounded-lg p-8 flex flex-col">
          <blockquote className="text-[18px] leading-[1.5] tracking-body-lg text-ink mb-6 flex-1">
            "It's the rare tool that feels designed by people who ship software for a living."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-[12px] font-medium text-white" style={{background: '#f2994a'}}>NP</div>
            <div>
              <div className="text-[14px] font-medium text-ink">Nan Yu</div>
              <div className="text-[14px] text-ink-subtle">Eng Lead, Pixel &amp; Pine</div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>

  {/**/}
  <section className="py-20 lg:py-24" >
    <div className="mx-auto max-w-content px-6 lg:px-8">
      <div className="max-w-2xl mb-12">
        <p className="eyebrow text-ink-subtle mb-3">FAQ</p>
        <h2 className="text-[30px] sm:text-[40px] leading-[1.15] font-display font-semibold tracking-display-md text-ink">
          Questions, answered.
        </h2>
      </div>

      <div className="max-w-3xl border-t border-hairline">

        <div className="border-b border-hairline">
          <button  className="flex w-full items-center justify-between py-5 text-left group">
            <span className="text-[18px] tracking-body-lg text-ink font-medium pr-4 group-hover:text-ink-muted transition-colors">Is Nebula free to try?</span>
            <svg  className="transition-transform duration-200 text-ink-subtle shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <div   >
            <p className="pb-5 text-[16px] leading-[1.5] tracking-body text-ink-muted max-w-xl">
              Yes — every plan starts with a 14-day free trial. No credit card required. Cancel anytime.
            </p>
          </div>
        </div>

        <div className="border-b border-hairline">
          <button  className="flex w-full items-center justify-between py-5 text-left group">
            <span className="text-[18px] tracking-body-lg text-ink font-medium pr-4 group-hover:text-ink-muted transition-colors">Does Nebula integrate with GitHub?</span>
            <svg  className="transition-transform duration-200 text-ink-subtle shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <div   >
            <p className="pb-5 text-[16px] leading-[1.5] tracking-body text-ink-muted max-w-xl">
              Yes. Two-way sync with GitHub issues, pull requests, and branches. Plus GitLab, Bitbucket, and Slack.
            </p>
          </div>
        </div>

        <div className="border-b border-hairline">
          <button  className="flex w-full items-center justify-between py-5 text-left group">
            <span className="text-[18px] tracking-body-lg text-ink font-medium pr-4 group-hover:text-ink-muted transition-colors">Is my data secure?</span>
            <svg  className="transition-transform duration-200 text-ink-subtle shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <div   >
            <p className="pb-5 text-[16px] leading-[1.5] tracking-body text-ink-muted max-w-xl">
              Nebula is SOC 2 Type II compliant and offers SSO/SAML on every plan. Encryption at rest and in transit is on by default.
            </p>
          </div>
        </div>

        <div className="border-b border-hairline">
          <button  className="flex w-full items-center justify-between py-5 text-left group">
            <span className="text-[18px] tracking-body-lg text-ink font-medium pr-4 group-hover:text-ink-muted transition-colors">Can I migrate from Jira or Linear?</span>
            <svg  className="transition-transform duration-200 text-ink-subtle shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <div   >
            <p className="pb-5 text-[16px] leading-[1.5] tracking-body text-ink-muted max-w-xl">
              One-click importers for Jira, Linear, Asana, and GitHub Projects. Your history, comments, and attachments come with you.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/**/}
  <section className="pb-24">
    <div className="mx-auto max-w-content px-6 lg:px-8">
      <div className="panel-highlight bg-surface-1 border border-hairline rounded-lg px-8 py-12 lg:px-16 lg:py-16 text-center">
        <h2 className="text-[28px] sm:text-[36px] leading-[1.2] tracking-headline font-display font-semibold text-ink max-w-2xl mx-auto">
          Start building with Nebula today.
        </h2>
        <p className="mt-4 text-[18px] leading-[1.5] tracking-body-lg text-ink-muted max-w-xl mx-auto">
          Join thousands of high-performance teams shipping better software, faster.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="#" className="inline-flex items-center px-4 py-2.5 text-[14px] font-medium text-on-primary bg-primary rounded-md hover:bg-primary-hover transition-colors w-full sm:w-auto justify-center" onClick={(e) => { e.preventDefault(); onGetStarted(); }}>Get started</a>
          <a href="#" className="inline-flex items-center px-4 py-2.5 text-[14px] font-medium text-ink bg-canvas border border-hairline rounded-md hover:bg-surface-1 transition-colors w-full sm:w-auto justify-center">
            Talk to sales
          </a>
        </div>
      </div>
    </div>
  </section>

  {/**/}
  <footer className="border-t border-hairline-tertiary py-16 lg:py-20">
    <div className="mx-auto max-w-content px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">

        {/**/}
        <div className="col-span-2 md:col-span-1">
          <a href="#" className="flex items-center gap-2 text-ink font-display font-medium mb-4">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-primary">
              <path d="M10 2L18 18H2L10 2Z" fill="currentColor"/>
            </svg>
            <span className="text-[15px] tracking-wordmark">Nebula</span>
          </a>
          <p className="text-[14px] text-ink-tertiary max-w-xs">Built for teams who care about craft.</p>
        </div>

        {/**/}
        <div>
          <div className="eyebrow text-ink mb-4">Product</div>
          <ul className="space-y-3 text-[14px] text-ink-subtle">
            <li><a href="#" className="hover:text-ink transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-ink transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-ink transition-colors">Integrations</a></li>
            <li><a href="#" className="hover:text-ink transition-colors">Changelog</a></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow text-ink mb-4">Company</div>
          <ul className="space-y-3 text-[14px] text-ink-subtle">
            <li><a href="#" className="hover:text-ink transition-colors">About</a></li>
            <li><a href="#" className="hover:text-ink transition-colors">Customers</a></li>
            <li><a href="#" className="hover:text-ink transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-ink transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow text-ink mb-4">Resources</div>
          <ul className="space-y-3 text-[14px] text-ink-subtle">
            <li><a href="#" className="hover:text-ink transition-colors">Docs</a></li>
            <li><a href="#" className="hover:text-ink transition-colors">API reference</a></li>
            <li><a href="#" className="hover:text-ink transition-colors">Status</a></li>
            <li><a href="#" className="hover:text-ink transition-colors">Blog</a></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow text-ink mb-4">Legal</div>
          <ul className="space-y-3 text-[14px] text-ink-subtle">
            <li><a href="#" className="hover:text-ink transition-colors">Privacy</a></li>
            <li><a href="#" className="hover:text-ink transition-colors">Terms</a></li>
            <li><a href="#" className="hover:text-ink transition-colors">Security</a></li>
            <li><a href="#" className="hover:text-ink transition-colors">DPA</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-16 pt-6 border-t border-hairline-tertiary flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[14px] text-ink-tertiary">© 2026 Nebula Labs, Inc. All rights reserved.</p>
        <div className="flex items-center gap-4 text-ink-subtle">
          <span className="inline-flex items-center gap-2 text-[14px]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-semantic-success"></span>
            All systems normal
          </span>
        </div>
      </div>
    </div>
  </footer>


    </div>
  );
};