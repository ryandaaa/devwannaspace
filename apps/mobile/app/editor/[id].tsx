import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Keyboard, Platform, KeyboardEvent, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import withObservables from '@nozbe/with-observables';
import { RichText, useEditorBridge, useEditorContent } from '@10play/tentap-editor';
import { db } from '@/lib/db';
import Page from '@/lib/db/models/Page';
import { PageIcon } from '@/components/ui/PageIcon';
import { useTheme, spacing, radii, typography, fonts } from '@/lib/theme';

// ── Section: Animated Pressable ──
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  style?: any;
}

function AnimatedButton({ onPress, children, style }: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      }}
      onPress={onPress}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}

// ── Section: Editor Component ──

// ── Tiptap JSON to HTML converter helper ─────────────────────────────────────

function getRawText(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(getRawText).join('');
  if (node.type === 'text') return node.text || '';
  if (node.content) return getRawText(node.content);
  return '';
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function tiptapJsonToHtml(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(tiptapJsonToHtml).join('');

  if (node.type === 'doc') {
    return tiptapJsonToHtml(node.content);
  }

  if (node.type === 'text') {
    let text = escapeHtml(node.text || '');
    if (node.marks && Array.isArray(node.marks)) {
      for (const mark of node.marks) {
        if (mark.type === 'bold') text = `<strong>${text}</strong>`;
        else if (mark.type === 'italic') text = `<em>${text}</em>`;
        else if (mark.type === 'strike') text = `<s>${text}</s>`;
        else if (mark.type === 'code') text = `<code>${text}</code>`;
        else if (mark.type === 'link') text = `<a href="${mark.attrs?.href || '#'}">${text}</a>`;
      }
    }
    return text;
  }

  const innerHtml = node.content ? tiptapJsonToHtml(node.content) : '';

  switch (node.type) {
    case 'paragraph':
      return `<p>${innerHtml}</p>`;
    case 'heading': {
      const level = node.attrs?.level || 1;
      return `<h${level}>${innerHtml}</h${level}>`;
    }
    case 'bulletList':
      return `<ul>${innerHtml}</ul>`;
    case 'orderedList':
      return `<ol>${innerHtml}</ol>`;
    case 'listItem':
      return `<li>${innerHtml}</li>`;
    case 'blockquote':
      return `<blockquote>${innerHtml}</blockquote>`;
    case 'codeBlock': {
      const codeText = getRawText(node.content);
      return `<pre><code>${escapeHtml(codeText)}</code></pre>`;
    }
    case 'horizontalRule':
      return '<hr/>';
    case 'hardBreak':
      return '<br/>';
    default:
      return innerHtml ? `<p>${innerHtml}</p>` : '';
  }
}

function getInitialHtmlContent(rawContent?: string | null, isDark?: boolean): string {
  const css = `<style>
    html, body {
      overflow-x: hidden !important;
      max-width: 100% !important;
      width: 100% !important;
    }
    body {
      padding-bottom: 120px !important;
      line-height: 1.65 !important;
      overflow-wrap: break-word !important;
      word-wrap: break-word !important;
      color: ${isDark ? '#f3f4f6' : '#1a1a1a'} !important;
    }
    img, video, iframe {
      max-width: 100% !important;
      height: auto !important;
    }
    p {
      line-height: 1.65 !important;
      margin-bottom: 0.75em !important;
    }
    pre {
      background-color: ${isDark ? '#121215' : '#f5f5f3'} !important;
      border: 1px solid ${isDark ? '#26262e' : '#e0e0dc'} !important;
      border-radius: 8px !important;
      padding: 16px 20px !important;
      font-family: monospace !important;
      font-size: 13px !important;
      line-height: 1.6 !important;
      overflow-x: auto !important;
      margin: 16px 0 !important;
      white-space: pre-wrap !important;
      word-break: break-word !important;
      display: block !important;
    }
    pre code {
      background: transparent !important;
      background-color: transparent !important;
      color: inherit !important;
      padding: 0 !important;
      margin: 0 !important;
      border: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      display: inline !important;
      vertical-align: normal !important;
    }
    code, p code, li code, span code {
      background-color: ${isDark ? '#1e1e24' : '#f0f0ed'} !important;
      color: ${isDark ? '#e6e6e6' : '#242424'} !important;
      padding: 3px 6px !important;
      border-radius: 6px !important;
      font-family: monospace !important;
      font-size: 0.88em !important;
      line-height: 1.3 !important;
      display: inline-block !important;
      vertical-align: baseline !important;
      margin: 0 2px !important;
      border: 1px solid ${isDark ? '#2d2e36' : '#e2e2df'} !important;
    }
    ::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }
  </style>`;

  if (!rawContent || !rawContent.trim()) return css;
  const trimmed = rawContent.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      return css + tiptapJsonToHtml(parsed);
    } catch {
      return css + trimmed;
    }
  }
  return css + trimmed;
}

// ── Section: Editor Component ──

interface EditorProps {
  page: Page;
}

function Editor({ page }: EditorProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const colors = theme.colors;

  const [title, setTitle] = useState(page.title || '');
  const [isFavorite, setIsFavorite] = useState(page.isFavorite || false);
  const [syncState, setSyncState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentSaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editorTheme = useMemo(() => ({
    webview: {
      backgroundColor: colors.canvas,
      color: colors.ink,
    },
    webviewContainer: {
      backgroundColor: colors.canvas,
    },
    toolbar: {
      toolbarBody: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
      },
    },
  }), [colors.canvas, colors.ink, colors.surface, colors.border]);

  const initialHtml = useMemo(() => getInitialHtmlContent(page.content, isDark), [page.content, isDark]);

  const editor = useEditorBridge({
    initialContent: initialHtml,
    avoidIosKeyboard: true,
    theme: editorTheme,
  });

  const content = useEditorContent(editor, { type: 'html', debounceInterval: 500 });

  // Dynamic CSS injection into WebView DOM to guarantee zero line overlap & clean code blocks
  useEffect(() => {
    if (editor?.webviewRef?.current) {
      const cssString = `
        html, body { overflow-x: hidden !important; max-width: 100% !important; width: 100% !important; }
        body { padding-bottom: 120px !important; line-height: 1.65 !important; overflow-wrap: break-word !important; word-wrap: break-word !important; color: ${isDark ? '#f3f4f6' : '#1a1a1a'} !important; }
        img, video, iframe { max-width: 100% !important; height: auto !important; }
        p { line-height: 1.65 !important; margin-bottom: 0.75em !important; }
        pre { background-color: ${isDark ? '#121215' : '#f5f5f3'} !important; border: 1px solid ${isDark ? '#26262e' : '#e0e0dc'} !important; border-radius: 8px !important; padding: 16px 20px !important; margin: 16px 0 !important; font-family: monospace !important; font-size: 13px !important; line-height: 1.6 !important; white-space: pre-wrap !important; word-break: break-word !important; display: block !important; overflow-x: auto !important; }
        pre code { background: transparent !important; color: inherit !important; padding: 0 !important; margin: 0 !important; border: none !important; display: inline !important; vertical-align: normal !important; }
        code, p code, li code, span code { background-color: ${isDark ? '#1e1e24' : '#f0f0ed'} !important; color: ${isDark ? '#e6e6e6' : '#242424'} !important; padding: 3px 6px !important; border-radius: 6px !important; font-size: 0.88em !important; line-height: 1.3 !important; display: inline-block !important; vertical-align: baseline !important; margin: 0 2px !important; border: 1px solid ${isDark ? '#2d2e36' : '#e2e2df'} !important; }
        ::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
      `;
      const js = `
        (function() {
          var existing = document.getElementById('tentap-custom-css');
          if (!existing) {
            var style = document.createElement('style');
            style.id = 'tentap-custom-css';
            style.innerHTML = \`${cssString}\`;
            document.head.appendChild(style);
          } else {
            existing.innerHTML = \`${cssString}\`;
          }
        })();
      `;
      editor.webviewRef.current.injectJavaScript(js);
    }
  }, [editor, isDark]);

  useEffect(() => {
    setTitle(page.title || '');
    setIsFavorite(page.isFavorite || false);
  }, [page.title, page.isFavorite]);

  const safeCall = (action: () => void) => {
    if (!isLoadedRef.current || !editor || !editor.webviewRef?.current) {
      console.log("Editor isn't ready yet");
      return;
    }
    try {
      action();
    } catch (e) {
      console.warn("Action failed:", e);
    }
  };

  // Toolbar keyboard animation
  const keyboardHeight = useSharedValue(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e: KeyboardEvent) => {
        keyboardHeight.value = withTiming(e.endCoordinates.height, { duration: 250 });
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        keyboardHeight.value = withTiming(0, { duration: 250 });
      }
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const toolbarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -keyboardHeight.value }],
    };
  });

  // Auto-save title
  useEffect(() => {
    if (title === page.title) return;
    
    setSyncState('saving');
    
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
    
    saveTimeout.current = setTimeout(async () => {
      try {
        await db.write(async () => {
          await page.update(p => {
            p.title = title;
          });
        });
        setSyncState('saved');
        setTimeout(() => setSyncState('idle'), 2000);
      } catch (e) {
        setSyncState('error');
      }
    }, 1000);

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [title, page]);

  const isLoadedRef = useRef(false);

  // Safety grace period on mount / page change so WebView has time to load initialContent
  useEffect(() => {
    isLoadedRef.current = false;
    const timer = setTimeout(() => {
      isLoadedRef.current = true;
    }, 1800);
    return () => clearTimeout(timer);
  }, [page.id]);

  // Auto-save rich text content with safety guards
  useEffect(() => {
    if (content === undefined || content === null) return;
    if (!isLoadedRef.current) return;

    // Failsafe: if page originally has content, but editor content evaluates to empty HTML/string, NEVER overwrite!
    const isPageOriginallyNotEmpty = !!(page.content && page.content.trim().length > 0);
    const isEditorContentEmpty = !content || !content.trim() || content.trim() === '<p></p>' || content.trim() === '<p><br></p>' || content.trim() === '<p></p><br>';

    if (isPageOriginallyNotEmpty && isEditorContentEmpty) {
      return;
    }

    if (content === page.content) return;

    setSyncState('saving');

    if (contentSaveTimeout.current) {
      clearTimeout(contentSaveTimeout.current);
    }

    contentSaveTimeout.current = setTimeout(async () => {
      try {
        await db.write(async () => {
          await page.update(p => {
            p.content = content;
          });
        });
        setSyncState('saved');
        setTimeout(() => setSyncState('idle'), 2000);
      } catch (e) {
        setSyncState('error');
      }
    }, 1000);

    return () => {
      if (contentSaveTimeout.current) clearTimeout(contentSaveTimeout.current);
    };
  }, [content, page]);

  const toggleFavorite = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newVal = !isFavorite;
    setIsFavorite(newVal);
    try {
      if (typeof page.toggleFavorite === 'function') {
        await page.toggleFavorite();
      } else {
        await db.write(async () => {
          await page.update(p => {
            p.isFavorite = newVal;
          });
        });
      }
    } catch (e) {
      setIsFavorite(!newVal);
    }
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Delete Page',
      'Are you sure you want to delete this page?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (typeof page.deletePage === 'function') {
                await page.deletePage();
              } else {
                await db.write(async () => {
                  await page.update(p => {
                    p.isDeleted = true;
                  });
                });
              }
              router.back();
            } catch (err) {
              console.error('Failed to delete page:', err);
            }
          },
        },
      ]
    );
  };

  const formatDate = (ts?: Date | number) => {
    if (!ts) return 'Unknown Date';
    const d = typeof ts === 'number' ? new Date(ts) : ts;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getRelativeTime = (ts?: Date | number) => {
    if (!ts) return '';
    const d = typeof ts === 'number' ? new Date(ts).getTime() : ts.getTime();
    const diffInSeconds = Math.floor((Date.now() - d) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const dateStr = formatDate(page.createdAt);
  const projectStr = page.projectId ? `Project ${page.projectId}` : '';
  const metadataStr = projectStr ? `in ${projectStr} · ${dateStr}` : dateStr;

  return (
    <View style={[s.container, { paddingTop: insets.top, backgroundColor: colors.canvas }]}>
      {/* Top Bar */}
      <View style={[s.topBar, { borderBottomColor: colors.border }]}>
        <AnimatedButton onPress={() => router.back()} style={s.iconButton}>
          <Feather name="arrow-left" size={22} color={colors.inkSubtle} />
        </AnimatedButton>
        
        <View style={s.syncStatus}>
          {syncState === 'saving' && (
            <Text style={[typography.caption, { color: colors.inkTertiary }]}>Saving...</Text>
          )}
          {syncState === 'saved' && (
            <View style={s.syncRow}>
              <Text style={[typography.caption, { color: colors.success }]}>Saved</Text>
              <Feather name="check" size={12} color={colors.success} style={{ marginLeft: 4 }} />
            </View>
          )}
          {syncState === 'error' && (
            <Text style={[typography.caption, { color: colors.warning }]}>Offline</Text>
          )}
        </View>
        
        <View style={s.rightActions}>
          <AnimatedButton onPress={toggleFavorite} style={s.iconButton}>
            <Feather 
              name="star" 
              size={20} 
              color={isFavorite ? (colors.accent || colors.primary) : colors.inkTertiary} 
            />
          </AnimatedButton>
          <AnimatedButton onPress={handleDelete} style={s.iconButton}>
            <Feather name="trash-2" size={20} color={colors.danger || colors.inkTertiary} />
          </AnimatedButton>
        </View>
      </View>

      {/* Editor Content */}
      <View style={s.editorWrapper}>
        <View style={s.headerArea}>
          <TextInput
            style={[s.titleInput, { color: colors.ink }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Untitled"
            placeholderTextColor={colors.inkSubtle}
            multiline
            scrollEnabled={false}
          />

          <View style={s.metaRow}>
            {!!page.projectId && (
              <View style={[s.projectChip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[s.projectDot, { backgroundColor: colors.accent }]} />
                <Text style={[s.projectChipText, { color: colors.inkSubtle }]}>Project</Text>
              </View>
            )}

            <View style={s.metaItem}>
              <Feather name="calendar" size={12} color={colors.inkTertiary} style={{ marginRight: 4 }} />
              <Text style={[s.metaText, { color: colors.inkTertiary }]}>
                {formatDate(page.createdAt)}
              </Text>
            </View>

            <Text style={[s.metaDot, { color: colors.inkTertiary }]}>·</Text>

            <View style={s.metaItem}>
              <Feather name="clock" size={12} color={colors.inkTertiary} style={{ marginRight: 4 }} />
              <Text style={[s.metaText, { color: colors.inkTertiary }]}>
                {getRelativeTime(page.updatedAt)}
              </Text>
            </View>
          </View>

          {/* Hairline Divider - 1:1 Aligned with Title and Editor Content */}
          <View style={[s.divider, { backgroundColor: colors.border }]} />
        </View>

        <View style={s.richTextContainer}>
          <RichText editor={editor} />
        </View>
      </View>

      {/* Format Toolbar */}
      <Animated.View style={[s.formatToolbar, toolbarStyle, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: insets.bottom || spacing.xs }]}>
        <AnimatedButton onPress={() => safeCall(() => editor.toggleBold())} style={s.formatButton}>
          <Text style={[s.formatText, { color: colors.inkSubtle }]}>B</Text>
        </AnimatedButton>
        <AnimatedButton onPress={() => safeCall(() => editor.toggleItalic())} style={s.formatButton}>
          <Text style={[s.formatText, { fontStyle: 'italic', color: colors.inkSubtle }]}>I</Text>
        </AnimatedButton>
        <AnimatedButton onPress={() => safeCall(() => editor.toggleHeading(1))} style={s.formatButton}>
          <Text style={[s.formatText, { color: colors.inkSubtle }]}>H1</Text>
        </AnimatedButton>
        <AnimatedButton onPress={() => safeCall(() => editor.toggleHeading(2))} style={s.formatButton}>
          <Text style={[s.formatText, { color: colors.inkSubtle }]}>H2</Text>
        </AnimatedButton>
        <AnimatedButton onPress={() => safeCall(() => editor.toggleBulletList())} style={s.formatButton}>
          <Feather name="list" size={20} color={colors.inkSubtle} />
        </AnimatedButton>
        <AnimatedButton onPress={() => safeCall(() => editor.toggleOrderedList())} style={s.formatButton}>
          <Feather name="list" size={18} color={colors.inkSubtle} />
        </AnimatedButton>
        <AnimatedButton onPress={() => safeCall(() => editor.toggleBlockquote())} style={s.formatButton}>
          <Feather name="message-square" size={20} color={colors.inkSubtle} />
        </AnimatedButton>
        <AnimatedButton onPress={() => safeCall(() => editor.toggleCode())} style={s.formatButton}>
          <Feather name="code" size={20} color={colors.inkSubtle} />
        </AnimatedButton>
        <AnimatedButton onPress={() => safeCall(() => editor.undo())} style={s.formatButton}>
          <Feather name="corner-up-left" size={20} color={colors.inkSubtle} />
        </AnimatedButton>
        <AnimatedButton onPress={() => safeCall(() => editor.redo())} style={s.formatButton}>
          <Feather name="corner-up-right" size={20} color={colors.inkSubtle} />
        </AnimatedButton>
      </Animated.View>
    </View>
  );
}

// ── Section: Screen Container ──

const enhance = withObservables(['id'], ({ id }: { id: string }) => ({
  page: db.get<Page>('pages').findAndObserve(id),
}));

const EnhancedEditor = enhance(Editor);

export default function EditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    if (id === 'new') {
      (async () => {
        try {
          let newId = '';
          await db.write(async () => {
            const newPage = await db.get<Page>('pages').create((p) => {
              p.title = 'Untitled';
              p.content = '';
              p.isFavorite = false;
            });
            newId = newPage.id;
          });
          if (newId) {
            router.replace(`/editor/${newId}`);
          }
        } catch (err) {
          console.error('Failed to pre-allocate page for /editor/new route:', err);
        }
      })();
    }
  }, [id, router]);

  if (!id || id === 'new') return null;

  return <EnhancedEditor id={id} />;
}

// ── Section: Styles ──

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    height: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncStatus: {
    flex: 1,
    alignItems: 'center',
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editorWrapper: {
    flex: 1,
    paddingBottom: 54,
  },
  headerArea: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  iconWrapper: {
    marginBottom: spacing.xs,
  },
  titleInput: {
    fontFamily: fonts.semiBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.4,
    paddingVertical: 4,
    paddingHorizontal: 0,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  projectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.xs || 4,
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: spacing.xs,
  },
  projectDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  projectChipText: {
    fontFamily: fonts.medium,
    fontSize: 11,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontFamily: fonts.regular,
    fontSize: 12,
  },
  metaDot: {
    fontSize: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    marginHorizontal: 0,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  richTextContainer: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  formatToolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.none,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: spacing.xs,
  },
  formatButton: {
    width: 36,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formatText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },
});
