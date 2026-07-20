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
import { useAuth } from '../../contexts/AuthContext';
import { Plus } from 'lucide-react';
import type { ViewState, Project, Issue, IssuePriority, IssueStatus, NotificationItem } from '../../types';
import type { IssuesViewRef } from '../views/IssuesView';
// import storage removed

export const AppShell: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const issuesViewRef = useRef<IssuesViewRef>(null);

  const [cmdOpen, setCmdOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [undoToast, setUndoToast] = useState<{ id: string; title: string } | null>(null);
  const [theme, setTheme] = useState<string>('dark');
  
  const { user } = useAuth();

  const [greeting] = useState(() => {
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
  });

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
    Promise.all([
      api.getPages(),
      api.getProjects(),
      api.getIssues(),
      api.getNotifications()
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
    });

    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleSelectTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };



  const persist = (updated: Page[]) => {
    setPages(updated);
    api.savePages(updated);
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
      content: templateContent || { type: 'doc', content: [{ type: 'paragraph' }] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    persist([...pages, newPage]);
    setCurrentView({ type: 'page', id });
  };

  const deletePage = (id: string) => {
    const target = pages.find((p) => p.id === id);
    const updated = pages.map((p) => p.id === id ? { ...p, isDeleted: true } : p);
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

  useEffect(() => {
    if (!undoToast) return;
    const timer = setTimeout(() => {
      setUndoToast(null);
    }, 10000);
    return () => clearTimeout(timer);
  }, [undoToast]);

  const restorePage = (id: string) => {
    const updated = pages.map((p) => p.id === id ? { ...p, isDeleted: false } : p);
    persist(updated);
    setCurrentView({ type: 'page', id });
    if (undoToast?.id === id) setUndoToast(null);
  };

  const permanentDeletePage = (id: string) => {
    const updated = pages.filter((p) => p.id !== id);
    persist(updated);
    if (undoToast?.id === id) setUndoToast(null);
  };

  const emptyTrash = () => {
    const updated = pages.filter((p) => !p.isDeleted);
    persist(updated);
    setUndoToast(null);
  };

  const toggleFavorite = (id: string) => {
    persist(pages.map((p) => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const updateTitle = (title: string) => {
    if (!activePageId) return;
    persist(pages.map((p) => p.id === activePageId ? { ...p, title, updatedAt: new Date().toISOString() } : p));
  };

  const handleUpdatePage = (id: string, updates: Partial<Page>) => {
    persist(pages.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
  };

  const updateContentTimer = React.useRef<any>(null);
  
  const updateContent = React.useCallback((content: any) => {
    if (!activePageId) return;
    
    if (updateContentTimer.current) {
      clearTimeout(updateContentTimer.current);
    }
    
    updateContentTimer.current = setTimeout(() => {
      setPages(prev => {
        const updated = prev.map((p) => p.id === activePageId ? { ...p, content, updatedAt: new Date().toISOString() } : p);
        api.savePages(updated);
        return updated;
      });

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
    persist(pages.map((p) => p.id === activePageId ? { ...p, icon: emoji, updatedAt: new Date().toISOString() } : p));
  };

  const updateCoverColor = (color: string) => {
    if (!activePageId) return;
    persist(pages.map((p) => p.id === activePageId ? { ...p, coverColor: color, updatedAt: new Date().toISOString() } : p));
  };

  const handleRestoreSnapshot = (content: any) => {
    if (!activePageId) return;
    persist(pages.map((p) => p.id === activePageId ? { ...p, content, updatedAt: new Date().toISOString() } : p));
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
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        createPage();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [createPage]);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>

      {/* SIDEBAR */}
      <Sidebar
        pages={pages}
        projects={projects}
        issues={issues}
        activePageId={activePageId}
        currentView={currentView}
        isOpen={sidebarOpen}
        width={sidebarWidth}
        isResizing={isResizing}
        onSelectPage={(id) => setCurrentView({ type: 'page', id })}
        onSelectView={setCurrentView}
        onCreatePage={createPage}
        onCreateProject={handleCreateProject}
        onDeletePage={deletePage}
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
        {isInitialLoad ? (
          <div style={{ display: 'flex', flex: 1, flexDirection: 'column', padding: 48, gap: 32 }}>
            <div style={{ width: 250, height: 32, backgroundColor: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', animation: 'pulse 1.5s infinite' }} />
            <div style={{ width: 400, height: 16, backgroundColor: 'var(--surface-1)', borderRadius: 'var(--radius-sm)', animation: 'pulse 1.5s infinite' }} />
            <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
              <div style={{ flex: 1, height: 120, backgroundColor: 'var(--surface-1)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite' }} />
              <div style={{ flex: 1, height: 120, backgroundColor: 'var(--surface-1)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite' }} />
              <div style={{ flex: 1, height: 120, backgroundColor: 'var(--surface-1)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite' }} />
            </div>
            <div style={{ flex: 1, backgroundColor: 'var(--surface-1)', borderRadius: 'var(--radius-lg)', marginTop: 16, animation: 'pulse 1.5s infinite' }} />
          </div>
        ) : (
          <>
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
            />

        {currentView.type === 'page' && currentPage ? (
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
          </>
        )}
      </div>

      {/* FAB - New Page */}
      {(currentView.type === 'page' || currentView.type === 'all_pages') && (
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
      />
      <TrashModal
        isOpen={trashOpen}
        onClose={() => setTrashOpen(false)}
        deletedPages={pages.filter((p) => p.isDeleted)}
        onRestorePage={restorePage}
        onPermanentDelete={permanentDeletePage}
        onEmptyTrash={emptyTrash}
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
