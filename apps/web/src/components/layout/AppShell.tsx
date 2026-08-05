import React, { useState, useEffect, useRef } from 'react';
import type { Page } from '../../types';
import { api } from '../../lib/api';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { PageHeader } from '../editor/PageHeader';
import { TipTapEditor } from '../editor/TipTapEditor';
import { CommandPalette } from '../command/CommandPalette';
import { EmojiPickerModal } from '../editor/EmojiPickerModal';
import { SettingsModal } from '../modals/SettingsModal';
import { TrashModal } from '../modals/TrashModal';
import { CreateProjectModal } from '../modals/CreateProjectModal';
import { IssuesView } from '../views/IssuesView';
import { PagesListView } from '../views/PagesListView';
import { ProjectDashboardView } from '../views/ProjectDashboardView';
import { HistoryModal } from '../modals/HistoryModal';
import { OnboardingWizard } from '../modals/OnboardingWizard';
import { ShortcutSheet } from '../modals/ShortcutSheet';
import { SelfHostSettings } from '../modals/SelfHostSettings';
import { useAuth } from '../../contexts/AuthContext';
import { Plus } from 'lucide-react';
import type { ViewState, Project, Issue, IssuePriority, IssueStatus, NotificationItem } from '../../types';
import type { IssuesViewRef } from '../views/IssuesView';
// import storage removed

export const AppShell: React.FC = () => {
  const { updateUser } = useAuth();
  const [needsSetup, setNeedsSetup] = useState(() => !localStorage.getItem('devwannaspace_setup_complete'));
  const [pages, setPages] = useState<Page[]>([]);
  const pagesRef = useRef(pages);
  useEffect(() => { pagesRef.current = pages; }, [pages]);
  const [currentView, setCurrentView] = useState<ViewState>(() => {
    const saved = localStorage.getItem('currentView');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { type: 'all_pages' };
  });

  useEffect(() => {
    localStorage.setItem('currentView', JSON.stringify(currentView));
  }, [currentView]);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [snapshots, setSnapshots] = useState<Record<string, { timestamp: string, content: any }[]>>(() => {
    try {
      const saved = localStorage.getItem('nebula_page_snapshots');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const activePageId = currentView.type === 'page' ? currentView.id : null;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    const saved = localStorage.getItem('sidebarWidth');
    return saved ? Math.min(Math.max(parseInt(saved, 10), 180), 480) : 240;
  });
  const [isResizing, setIsResizing] = useState(false);
  
  // Custom API Error State
  const [isApiError, setIsApiError] = useState(false);

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [zenMode, setZenMode] = useState(false);
  const [zenHintVisible, setZenHintVisible] = useState(true);

  const issuesViewRef = useRef<IssuesViewRef>(null);

  const [cmdOpen, setCmdOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shortcutOpen, setShortcutOpen] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [undoToast, setUndoToast] = useState<{ id: string; title: string } | null>(null);
  const [theme, setTheme] = useState<string>('dark');
  const [customThemeColors, setCustomThemeColors] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('customThemeColors') || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('customThemeColors', JSON.stringify(customThemeColors));
  }, [customThemeColors]);
  
  const { user } = useAuth();

  const greeting = React.useMemo(() => {
    const greetings = [
      "Welcome aboard,",
      "Howdy,",
      "Good to see you,",
      "Ready to build,",
      "Welcome back,",
      "Greetings,",
      "Let's get to work,",
      "Hello there,",
      "Time to create,"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)] + " " + (user?.name?.split(' ')[0] || 'Ryanda');
  }, [user?.name]);

  /* Handle Sidebar Drag Resize */
  const handleStartResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.min(Math.max(e.clientX, 180), 480);
      setSidebarWidth(newWidth);
      localStorage.setItem('sidebarWidth', newWidth.toString());
    };
    const handleMouseUp = () => {
      setIsResizing(false);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  /* Load pages & theme */
  useEffect(() => {
    const pPages = api.getPages();
    const pProj = api.getProjects();
    const pIssues = api.getIssues();
    const pNotif = api.getNotifications();

    pPages.catch(() => {});
    pProj.catch(() => {});
    pIssues.catch(() => {});
    pNotif.catch(() => {});

    Promise.all([
      pPages,
      pProj,
      pIssues,
      pNotif
    ]).then(([loadedPages, loadedProjects, loadedIssues, loadedNotifs]) => {
      let finalPages = loadedPages;
      let finalProjects = loadedProjects;
      let finalIssues = loadedIssues;

      // Seed Starter Pack
      if (loadedPages.length === 0 && loadedProjects.length === 0 && loadedIssues.length === 0) {
        const projectId = `proj-${Date.now()}`;
        const pageId = `page-${Date.now()}`;
        
        finalProjects = [{
          id: projectId,
          name: 'Starter Project',
          color: 'var(--primary)',
          description: 'A place to get started with devwannaspace.',
          createdAt: new Date().toISOString()
        }];

        finalPages = [{
          id: pageId,
          title: 'Getting Started',
          icon: 'Star',
          parentId: null,
          projectId: projectId,
          content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Welcome to your new workspace! You can edit this page, add projects, and track issues.' }] }] },
          isFavorite: true,
          isDeleted: false,
          position: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }];

        finalIssues = [{
          id: `issue-${Date.now()}-1`,
          projectId: projectId,
          title: 'Explore the workspace',
          description: 'Try creating a new page and navigating the app.',
          status: 'Todo',
          priority: 'Medium',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }];

        api.saveProjects(finalProjects);
        api.savePages(finalPages);
        api.saveIssues(finalIssues);
      }

      setPages(finalPages);
      setProjects(finalProjects);
      setIssues(finalIssues);
      setNotifications(loadedNotifs);
      
      const savedView = localStorage.getItem('currentView');
      if (!savedView && finalPages.length > 0) {
        setCurrentView({ type: 'page', id: finalPages[0].id });
      } else if (!savedView) {
        setCurrentView({ type: 'all_pages' });
      }
      setIsInitialLoad(false);
    }).catch(err => {
      console.error('Failed to load initial data:', err);
      setIsApiError(true);
      setIsInitialLoad(false);
    });

    const handleFocusOrPoll = () => {
      if (isInitialLoad) return;
      const pPages = api.getPages();
      const pProj = api.getProjects();
      const pIssues = api.getIssues();
      const pNotif = api.getNotifications();

      pPages.catch(() => {});
      pProj.catch(() => {});
      pIssues.catch(() => {});
      pNotif.catch(() => {});

      Promise.all([
        pPages,
        pProj,
        pIssues,
        pNotif
      ]).then(([loadedPages, loadedProjects, loadedIssues, loadedNotifs]) => {
        setPages(prev => {
          const fetchedMap = new Map(loadedPages.map(p => [p.id, p]));
          const currentMap = new Map(prev.map(p => [p.id, p]));
          const result: Page[] = [];
          for (const f of loadedPages) {
            const c = currentMap.get(f.id);
            if (c && new Date(c.updatedAt).getTime() >= new Date(f.updatedAt).getTime()) {
              result.push(c);
            } else {
              result.push(f);
            }
          }
          for (const c of prev) {
            if (!fetchedMap.has(c.id)) result.push(c);
          }
          result.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
          return result;
        });

        setIssues(prev => {
          const fetchedMap = new Map(loadedIssues.map(i => [i.id, i]));
          const currentMap = new Map(prev.map(i => [i.id, i]));
          const result: Issue[] = [];
          for (const f of loadedIssues) {
            const c = currentMap.get(f.id);
            if (c && new Date(c.updatedAt).getTime() >= new Date(f.updatedAt).getTime()) {
              result.push(c);
            } else {
              result.push(f);
            }
          }
          for (const c of prev) {
            if (!fetchedMap.has(c.id)) result.push(c);
          }
          return result;
        });

        // Projects and notifications don't have updatedAt that changes, so we just overwrite safely
        setProjects(loadedProjects);
        setNotifications(loadedNotifs);
      }).catch(console.error);
    };

    window.addEventListener('focus', handleFocusOrPoll);
    const interval = setInterval(handleFocusOrPoll, 5000);

    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    return () => {
      window.removeEventListener('focus', handleFocusOrPoll);
      clearInterval(interval);
    };
  }, [isInitialLoad]);

  const handleSelectTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };



  const persist = (updated: Page[]) => {
    const withPositions = updated.map((p, i) => {
      if (p.position !== i) {
        return { ...p, position: i, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    setPages(withPositions);
    api.savePages(withPositions);
  };

  const currentPage = pages.find((p) => p.id === activePageId && !p.isDeleted) ?? null;


  /* Handlers */
  const createPage = (parentId?: string, templateContent?: any, templateIcon?: string, templateTitle?: string) => {
    const id = `page-${Date.now()}`;
    const newPage: Page = {
      id,
      parentId: parentId ?? null,
      title: templateTitle || 'Untitled',
      icon: templateIcon || 'FileText',
      content: templateContent || '<p></p>',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    persist([...pagesRef.current, newPage]);
    setCurrentView({ type: 'page', id });
  };

  const deletePage = (id: string) => {
    const target = pagesRef.current.find((p) => p.id === id);
    const updated = pagesRef.current.map((p) => p.id === id ? { ...p, isDeleted: true } : p);
    persist(updated);
    if (activePageId === id) {
      const remaining = updated.filter((p) => !p.isDeleted);
      if (remaining.length > 0) {
        setCurrentView({ type: 'page', id: remaining[0].id });
      } else {
        setCurrentView({ type: 'all_pages' });
      }
    }
    if (target) {
      setUndoToast({ id: target.id, title: target.title || 'Page' });
    }
  };

  const duplicatePage = (id: string) => {
    const src = pagesRef.current.find(p => p.id === id);
    if (!src) return;
    const newId = `page-${Date.now()}`;
    const copy: Page = {
      ...src,
      id: newId,
      title: `${src.title || 'Untitled'} (copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    persist([...pagesRef.current, copy]);
    setCurrentView({ type: 'page', id: newId });
  };

  const renamePage = (id: string, title: string) => {
    persist(pagesRef.current.map(p => p.id === id ? { ...p, title, updatedAt: new Date().toISOString() } : p));
  };

  const movePage = (dragId: string, targetId: string) => {
    const currentPages = pagesRef.current;
    const dragPage = currentPages.find(p => p.id === dragId);
    const targetPage = currentPages.find(p => p.id === targetId);
    if (!dragPage || !targetPage || dragId === targetId) return;

    // Prevent moving a page into its own descendants
    const isDescendant = (checkId: string): boolean => {
      const children = currentPages.filter(p => p.parentId === checkId);
      return children.some(c => c.id === targetId || isDescendant(c.id));
    };
    if (isDescendant(dragId)) return;

    // Remove dragPage
    const withoutDrag = currentPages.filter(p => p.id !== dragId);
    // Find target
    const targetIndex = withoutDrag.findIndex(p => p.id === targetId);
    
    // Adopt target's parent (become sibling) and place before target
    const updatedDragPage = { 
      ...dragPage, 
      parentId: targetPage.parentId, 
      updatedAt: new Date().toISOString() 
    };

    const newPages = [
      ...withoutDrag.slice(0, targetIndex),
      updatedDragPage,
      ...withoutDrag.slice(targetIndex)
    ];

    persist(newPages);
  };

  // Recently visited tracking
  const trackRecentPage = (id: string) => {
    const key = 'devwannaspace_recent_pages';
    const stored: string[] = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = [id, ...stored.filter(r => r !== id)].slice(0, 10);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  useEffect(() => {
    if (!undoToast) return;
    const timer = setTimeout(() => {
      setUndoToast(null);
    }, 10000);
    return () => clearTimeout(timer);
  }, [undoToast]);

  const restorePage = (id: string) => {
    const updated = pagesRef.current.map((p) => p.id === id ? { ...p, isDeleted: false } : p);
    persist(updated);
    setCurrentView({ type: 'page', id });
    if (undoToast?.id === id) setUndoToast(null);
  };

  const permanentDeletePage = (id: string) => {
    const updated = pagesRef.current.filter((p) => p.id !== id);
    persist(updated);
    if (undoToast?.id === id) setUndoToast(null);
  };

  const emptyTrash = () => {
    const updated = pagesRef.current.filter((p) => !p.isDeleted);
    persist(updated);
    setUndoToast(null);
  };

  const toggleFavorite = (id: string) => {
    persist(pagesRef.current.map((p) => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const updateTitle = (title: string) => {
    if (!activePageId) return;
    persist(pagesRef.current.map((p) => p.id === activePageId ? { ...p, title, updatedAt: new Date().toISOString() } : p));
  };

  const handleUpdatePage = (id: string, updates: Partial<Page>) => {
    persist(pagesRef.current.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
  };

  const updateContentTimer = React.useRef<any>(null);
  
  const updateContent = React.useCallback((content: any) => {
    if (!activePageId) return;
    
    if (updateContentTimer.current) {
      clearTimeout(updateContentTimer.current);
    }
    
    updateContentTimer.current = setTimeout(() => {
      const now = new Date().toISOString();
      const updated = pagesRef.current.map((p) => p.id === activePageId ? { ...p, content, updatedAt: now } : p);
      setPages(updated);
      api.savePages(updated);

      setSnapshots(prev => {
        const pageSnaps = prev[activePageId] || [];
        const now = Date.now();
        const lastSnap = pageSnaps[pageSnaps.length - 1];
        if (!lastSnap || now - new Date(lastSnap.timestamp).getTime() > 60000) {
          const newSnap = { timestamp: new Date().toISOString(), content };
          const nextSnaps = { ...prev, [activePageId]: [...pageSnaps.slice(-9), newSnap] }; // Keep last 10 snapshots
          localStorage.setItem('nebula_page_snapshots', JSON.stringify(nextSnaps));
          return nextSnaps;
        }
        return prev;
      });
    }, 500); // 500ms debounce
  }, [activePageId]);

  const updateEmoji = (emoji: string | null) => {
    if (!activePageId) return;
    persist(pagesRef.current.map((p) => p.id === activePageId ? { ...p, icon: emoji, updatedAt: new Date().toISOString() } : p));
  };

  const updateCoverColor = (color: string) => {
    if (!activePageId) return;
    persist(pagesRef.current.map((p) => p.id === activePageId ? { ...p, coverColor: color, updatedAt: new Date().toISOString() } : p));
  };

  const handleRestoreSnapshot = (content: any) => {
    if (!activePageId) return;
    persist(pagesRef.current.map((p) => p.id === activePageId ? { ...p, content, updatedAt: new Date().toISOString() } : p));
  };

  const markAllNotificationsAsRead = () => {
    const updated = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updated);
    api.saveNotifications(updated);
  };

  const handleCreateIssue = (title: string, description: string, projectId: string, priority: IssuePriority, status: IssueStatus, dueDate?: string) => {
    const newIssue: Issue = {
      id: `iss-${Date.now()}`,
      title,
      description,
      projectId,
      priority,
      status,
      dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newIssue, ...issues];
    setIssues(updated);
    api.saveIssues(updated);
  };

  const handleUpdateIssue = (id: string, updates: Partial<Issue>) => {
    const updated = issues.map(i => i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i);
    setIssues(updated);
    api.saveIssues(updated);
  };

  const handleDeleteIssue = (id: string) => {
    const updated = issues.filter(i => i.id !== id);
    setIssues(updated);
    api.saveIssues(updated);
  };

  const handleCreateProject = () => {
    setEditingProject(undefined);
    setProjectModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectModalOpen(true);
  };

  const handleDeleteProject = (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    api.saveProjects(updatedProjects);

    // Unassign pages from this project
    const updatedPages = pages.map(p => p.projectId === id ? { ...p, projectId: undefined } : p);
    persist(updatedPages);

    // Delete issues associated with this project
    const updatedIssues = issues.filter(i => i.projectId !== id);
    setIssues(updatedIssues);
    api.saveIssues(updatedIssues);

    setCurrentView({ type: 'all_pages' });
  };

  const submitProjectModal = (name: string, color: string, id?: string) => {
    if (id) {
      // Edit mode
      const updated = projects.map(p => p.id === id ? { ...p, name, color } : p);
      setProjects(updated);
      api.saveProjects(updated);
    } else {
      // Create mode
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name: name,
        color: color,
        createdAt: new Date().toISOString()
      };
      const updated = [...projects, newProject];
      setProjects(updated);
      api.saveProjects(updated);
    }
  };

  /* Global keyboard shortcuts: ⌘K (Search), ⌘\ (Sidebar), ⌘N (New Page) */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        setSidebarOpen((prev) => !prev);
      }
      if (e.altKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        setZenMode((prev) => !prev);
      }
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        createPage();
      }
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const active = document.activeElement;
        const isTyping = active && (
          active.tagName === 'INPUT' ||
          active.tagName === 'TEXTAREA' ||
          (active as HTMLElement).isContentEditable
        );
        if (!isTyping) {
          e.preventDefault();
          setShortcutOpen(prev => !prev);
        }
      }
      if (e.key === 'Escape' && zenMode) {
        setZenMode(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [createPage, zenMode]);

  /* Zen Mode Hint auto fade & reveal on hover */
  useEffect(() => {
    if (zenMode) {
      setZenHintVisible(true);
      const timer = setTimeout(() => setZenHintVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [zenMode]);

  useEffect(() => {
    if (!zenMode) return;
    let timer: any;
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 80) {
        setZenHintVisible(true);
        clearTimeout(timer);
      } else {
        clearTimeout(timer);
        timer = setTimeout(() => setZenHintVisible(false), 500);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, [zenMode]);

  const handleOnboardingComplete = (name: string, selectedTheme: string) => {
    localStorage.setItem('devwannaspace_setup_complete', 'true');
    handleSelectTheme(selectedTheme);
    if (name.trim()) {
      updateUser({ name: name.trim() });
    }
    setNeedsSetup(false);
  };



  if (isApiError) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--canvas)' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--surface-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--primary)', marginBottom: 24, border: '1px solid var(--hairline-strong)'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2 style={{ color: 'var(--ink)', fontSize: 24, fontWeight: 600, margin: 0, marginBottom: 8, fontFamily: 'Inter, sans-serif' }}>Connection Failed</h2>
        <p style={{ color: 'var(--ink-secondary)', fontSize: 15, margin: 0, marginBottom: 24, fontFamily: 'Inter, sans-serif', maxWidth: 400, textAlign: 'center', lineHeight: 1.5 }}>
          We couldn't connect to your Self-Hosted backend. Please ensure your Custom API URL and Clerk Keys are correctly configured.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => setNeedsSetup(true)}
            style={{
              padding: '10px 20px', backgroundColor: 'var(--primary)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 500, cursor: 'pointer'
            }}
          >
            Configure Settings
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px', backgroundColor: 'var(--surface-2)', color: 'var(--ink)',
              border: '1px solid var(--hairline-strong)', borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 500, cursor: 'pointer'
            }}
          >
            Retry Connection
          </button>
        </div>
        {needsSetup && <SelfHostSettings isOpen={true} onClose={() => setNeedsSetup(false)} isMandatory={false} />}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
      {needsSetup && <OnboardingWizard onComplete={handleOnboardingComplete} />}
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* SIDEBAR */}
        <Sidebar
          pages={pages}
          projects={projects}
          issues={issues}
          activePageId={activePageId}
          currentView={currentView}
          isOpen={sidebarOpen && !zenMode}
          width={sidebarWidth}
          isResizing={isResizing}
          onSelectPage={(id) => { setCurrentView({ type: 'page', id }); trackRecentPage(id); }}
          onSelectView={setCurrentView}
          onCreatePage={createPage}
          onCreateProject={handleCreateProject}
          onDeletePage={deletePage}
          onDuplicatePage={duplicatePage}
          onRenamePage={renamePage}
          onMovePage={movePage}
          onOpenCommandPalette={() => setCmdOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenTrash={() => setTrashOpen(true)}
          onMouseDownResize={handleStartResizing}
        />

        {/* MAIN PANEL */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          backgroundColor: 'var(--main-panel)', overflow: 'hidden',
          minWidth: 0,
        }}>
          {!zenMode && (
            <TopBar
              currentPage={currentPage}
                allPages={pages.filter((p) => !p.isDeleted)}
                projects={projects}
                onSelectPage={(id) => setCurrentView({ type: 'page', id })}
                onUpdatePage={handleUpdatePage}
                onToggleFavorite={toggleFavorite}
                onDeletePage={deletePage}
                onToggleSidebar={() => setSidebarOpen((s) => !s)}
                onOpenSettings={() => setSettingsOpen(true)}
                isSidebarOpen={sidebarOpen}
                onSelectProject={(id) => setCurrentView({ type: 'project', id })}
                theme={theme}
                onToggleTheme={() => handleSelectTheme(theme === 'dark' ? 'light' : 'dark')}
                notifications={notifications}
                onMarkAllAsRead={markAllNotificationsAsRead}
              onOpenHistory={() => setHistoryOpen(true)}
              onToggleZenMode={() => setZenMode(true)}
            />
          )}

        {isInitialLoad ? (
          <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              border: '3px solid var(--hairline-strong)', borderTopColor: 'var(--primary)',
              animation: 'spin 1s linear infinite', marginBottom: 24
            }} />
            <h2 style={{ color: 'var(--ink)', fontSize: 20, fontWeight: 600, margin: 0, marginBottom: 8, fontFamily: 'Inter, sans-serif' }}>Syncing Workspace</h2>
            <p style={{ color: 'var(--ink-secondary)', fontSize: 14, margin: 0, fontFamily: 'Inter, sans-serif' }}>Please wait while we load your data...</p>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        ) : currentView.type === 'page' && currentPage ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <TipTapEditor
              key={currentPage.id}
              currentPageId={currentPage.id}
              content={currentPage.content}
              onChange={updateContent}
              onCreateSubpage={() => createPage(currentPage.id)}
              allPages={pages.filter((p) => !p.isDeleted)}
              onSelectPage={(id) => setCurrentView({ type: 'page', id })}
              header={
                <PageHeader
                  page={currentPage}
                  onUpdateTitle={updateTitle}
                  onOpenEmojiPicker={() => setEmojiOpen(true)}
                  onUpdateCoverColor={updateCoverColor}
                />
              }
            />
          </div>
        ) : currentView.type === 'page' && !currentPage ? (
          /* Empty state (Fallback) */
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 20, fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.2px', marginBottom: 8 }}>
                No pages yet
              </div>
              <div style={{ fontSize: 14, color: 'var(--ink-subtle)' }}>
                Create a page to start capturing your thoughts.
              </div>
            </div>
            
            <button
              onClick={() => createPage()}
              style={{
                height: 32, padding: '0 14px',
                backgroundColor: 'var(--surface-1)',
                border: '1px solid var(--hairline-strong)', 
                cursor: 'pointer', borderRadius: 'var(--radius-md)',
                fontSize: 14, fontWeight: 500, color: 'var(--ink)',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                transition: 'background 0.1s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-1)'; }}
            >
              <Plus size={14} />
              New Page
            </button>

            <div style={{ fontSize: 12, color: 'var(--ink-tertiary)', marginTop: 24 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                Press <span style={{ fontFamily: 'var(--mono)', fontSize: 11, backgroundColor: 'var(--surface-2)', padding: '2px 4px', borderRadius: '4px', border: '1px solid var(--hairline)' }}>⌘K</span> to search
              </span>
            </div>
          </div>
        ) : currentView.type === 'my_issues' ? (
          <IssuesView
            ref={issuesViewRef}
            title="My Issues"
            subtitle="Manage your tasks and track project progress."
            issues={issues}
            projects={projects}
            onCreateIssue={handleCreateIssue}
            onUpdateIssue={handleUpdateIssue}
            onDeleteIssue={handleDeleteIssue}
            onCreateProject={() => setProjectModalOpen(true)}
          />
        ) : currentView.type === 'project' && projects.find(p => p.id === currentView.id) ? (
          <ProjectDashboardView 
            project={projects.find(p => p.id === currentView.id)!}
            issues={issues.filter(i => i.projectId === currentView.id)}
            pages={pages.filter(p => p.projectId === currentView.id)}
            projects={projects}
            onCreateIssue={handleCreateIssue}
            onUpdateIssue={handleUpdateIssue}
            onDeleteIssue={handleDeleteIssue}
            onSelectPage={(id) => setCurrentView({ type: 'page', id })}
            allPages={pages.filter((p) => !p.isDeleted)}
            onUpdatePage={handleUpdatePage}
            onCreatePage={() => createPage(currentView.id)}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
          />
        ) : currentView.type === 'all_pages' ? (
          <PagesListView
            title={greeting}
            subtitle="Here's what's happening in your workspace today."
            pages={pages.filter(p => !p.isDeleted)}
            projects={projects}
            onSelectPage={(id) => setCurrentView({ type: 'page', id })}
            onCreatePage={() => createPage()}
          />
        ) : null}
        </div>
      </div>

      {/* FAB - New Page */}
      {!zenMode && (currentView.type === 'page' || currentView.type === 'all_pages') && (
        <button
          onClick={() => createPage()}
          style={{
            position: 'absolute',
            bottom: 32,
            right: 32,
            height: 56,
            padding: '0 24px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            border: 'none',
            zIndex: 100,
            transition: 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1), background 0.1s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = 'var(--primary)';
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          title="Create New Page (Alt+N)"
        >
          <Plus size={20} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 16, fontWeight: 600 }}>new (alt+n)</span>
        </button>
      )}

      {/* ZEN MODE FLOATING EXIT */}
      {zenMode && (
        <button
          onClick={() => setZenMode(false)}
          style={{
            position: 'fixed', top: 48, left: '50%', transform: 'translateX(-50%)',
            padding: '6px 16px', backgroundColor: 'var(--overlay)', color: '#fff',
            borderRadius: '16px', border: '1px solid var(--hairline-strong)',
            fontSize: 12, fontWeight: 500, cursor: 'pointer', zIndex: 9999,
            opacity: zenHintVisible ? 0.4 : 0, 
            pointerEvents: zenHintVisible ? 'auto' : 'none',
            transition: 'opacity 0.4s ease, transform 0.2s ease',
            backdropFilter: 'blur(4px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.4';
            e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
          }}
        >
          Press Esc to exit Zen Mode
        </button>
      )}

      {/* UNDO TOAST */}
      {undoToast && (
        <div
          className="nb-toast-animate"
          style={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--surface-3, #2a2a2e)',
            color: 'var(--ink, #ffffff)',
            border: '1px solid var(--hairline-strong, #444)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md, 6px)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            zIndex: 1000,
            fontSize: 13,
          }}
        >
          <span>Moved &quot;{undoToast.title}&quot; to Trash</span>
          <button
            onClick={() => restorePage(undoToast.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary, #81a1c1)',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 13,
              padding: 0,
            }}
          >
            Undo
          </button>
        </div>
      )}

      {/* MODALS */}
      <CreateProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSubmit={submitProjectModal}
        initialProject={editingProject}
      />
      <CommandPalette
        isOpen={cmdOpen}
        pages={pages}
        projects={projects}
        issues={issues}
        onClose={() => setCmdOpen(false)}
        onCreatePage={(title?: string) => { createPage(undefined, title); setCmdOpen(false); }}
        onSelectResult={(type, id, projectId) => {
          if (type === 'page') setCurrentView({ type: 'page', id });
          else if (type === 'project') setCurrentView({ type: 'project', id });
          else if (type === 'issue') {
            if (projectId) setCurrentView({ type: 'project', id: projectId });
            else setCurrentView({ type: 'my_issues' });
          }
          setCmdOpen(false);
        }}
      />
      <EmojiPickerModal
        isOpen={emojiOpen}
        onClose={() => setEmojiOpen(false)}
        onSelectEmoji={updateEmoji}
      />
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme as 'dark' | 'light'}
        onSelectTheme={handleSelectTheme}
        customThemeColors={customThemeColors}
        setCustomThemeColors={setCustomThemeColors}
      />
      <TrashModal
        isOpen={trashOpen}
        onClose={() => setTrashOpen(false)}
        deletedPages={pages.filter((p) => p.isDeleted)}
        onRestorePage={restorePage}
        onPermanentDelete={permanentDeletePage}
        onEmptyTrash={emptyTrash}
      />
      <ShortcutSheet
        isOpen={shortcutOpen}
        onClose={() => setShortcutOpen(false)}
      />
      <HistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        snapshots={activePageId ? (snapshots[activePageId] || []) : []}
        onRestore={handleRestoreSnapshot}
      />
    </div>
  );
};
