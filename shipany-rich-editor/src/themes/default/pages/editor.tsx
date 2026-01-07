'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bold,
  Code2,
  FileDown,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Italic,
  LayoutGrid,
  Link as LinkIcon,
  List,
  ListOrdered,
  Menu,
  PenLine,
  Plus,
  Quote,
  Redo2,
  Save,
  Strikethrough,
  Table as TableIcon,
  Trash2,
  Undo2,
  Underline,
} from 'lucide-react';
import { EditorContent, useEditor } from '@tiptap/react';
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { TextStyle } from '@tiptap/extension-text-style';
import UnderlineExtension from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Input } from '@/shared/components/ui/input';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { Separator } from '@/shared/components/ui/separator';
import { Sheet, SheetContent } from '@/shared/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';
import { useMedia } from '@/shared/hooks/use-media';
import { useEditorStore } from '@/shared/stores/editor-store';

type Template = {
  key: string;
  title: string;
  description: string;
  content: string;
};

type Prompt = {
  key: string;
  title: string;
  content: string;
};

export default function EditorPage() {
  const t = useTranslations('editor');
  const locale = useLocale();
  const isDesktop = useMedia('(min-width: 1024px)');

  const {
    docs,
    activeId,
    createDoc,
    updateDoc,
    setActive,
    deleteDoc,
    saveVersion,
    restoreVersion,
  } = useEditorStore();

  const activeDoc = docs.find((doc) => doc.id === activeId) ?? docs[0];
  const activeIdRef = useRef<string | null>(activeId ?? null);

  const [search, setSearch] = useState('');
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageValue, setImageValue] = useState('');
  const [docsDrawerOpen, setDocsDrawerOpen] = useState(false);
  const [toolsDrawerOpen, setToolsDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    activeIdRef.current = activeId ?? null;
  }, [activeId]);

  useEffect(() => {
    if (!activeId && docs.length) {
      setActive(docs[0].id);
    }
  }, [activeId, docs, setActive]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      UnderlineExtension,
      Link.configure({ openOnClick: false, autolink: true }),
      TextStyle,
      Color,
      Image.configure({ inline: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder: t('editor.placeholder') }),
    ],
    content: activeDoc?.content || '<p></p>',
    immediatelyRender: false,
    editorProps: {
      attributes: { class: 'tiptap' },
    },
    onUpdate: ({ editor }) => {
      const id = activeIdRef.current;
      if (id) {
        updateDoc(id, { content: editor.getHTML() });
      }
    },
  });

  useEffect(() => {
    if (!editor || !activeDoc) return;
    editor.commands.setContent(activeDoc.content || '<p></p>', {
      emitUpdate: false,
    });
  }, [editor, activeDoc?.id]);

  const templates = useMemo<Template[]>(() => {
    if (locale.startsWith('zh')) {
      return [
        {
          key: 'brief',
          title: '产品概览',
          description: '快速梳理产品定位与核心功能。',
          content:
            '<h2>产品概览</h2><p>一句话描述产品定位与目标用户。</p><h3>核心价值</h3><ul><li>解决的问题</li><li>核心差异化</li><li>关键指标</li></ul><h3>下一步</h3><p>列出近期要完成的行动项。</p>',
        },
        {
          key: 'meeting',
          title: '会议纪要',
          description: '记录讨论要点与行动项。',
          content:
            '<h2>会议纪要</h2><p><strong>时间：</strong>YYYY-MM-DD</p><p><strong>参会人：</strong></p><h3>讨论要点</h3><ul><li></li><li></li></ul><h3>行动项</h3><ol><li></li><li></li></ol>',
        },
        {
          key: 'blog',
          title: '文章大纲',
          description: '生成一篇长文结构。',
          content:
            '<h2>文章标题</h2><p>简要说明文章主题与受众。</p><h3>一、背景与问题</h3><p></p><h3>二、核心观点</h3><ul><li></li><li></li></ul><h3>三、案例与数据</h3><p></p><h3>四、结论与行动</h3><p></p>',
        },
      ];
    }

    return [
      {
        key: 'brief',
        title: 'Product Brief',
        description: 'Outline positioning, goals, and next steps.',
        content:
          '<h2>Product Brief</h2><p>Summarize the product in one sentence.</p><h3>Goals</h3><ul><li></li><li></li></ul><h3>Key Differentiators</h3><ul><li></li><li></li></ul><h3>Next Steps</h3><p></p>',
      },
      {
        key: 'meeting',
        title: 'Meeting Notes',
        description: 'Capture decisions and action items.',
        content:
          '<h2>Meeting Notes</h2><p><strong>Date:</strong> YYYY-MM-DD</p><p><strong>Attendees:</strong></p><h3>Highlights</h3><ul><li></li><li></li></ul><h3>Action Items</h3><ol><li></li><li></li></ol>',
      },
      {
        key: 'blog',
        title: 'Blog Outline',
        description: 'Structure a long-form article quickly.',
        content:
          '<h2>Post Title</h2><p>Explain the topic and target audience.</p><h3>1. Context</h3><p></p><h3>2. Key Insights</h3><ul><li></li><li></li></ul><h3>3. Examples</h3><p></p><h3>4. Summary</h3><p></p>',
      },
    ];
  }, [locale]);

  const assistantPrompts = useMemo<Prompt[]>(() => {
    if (locale.startsWith('zh')) {
      return [
        {
          key: 'outline',
          title: '生成大纲',
          content: '请在这里补充：\n- 背景\n- 关键观点\n- 行动建议',
        },
        {
          key: 'rewrite',
          title: '润色当前段落',
          content: '润色建议：\n1. 精简冗余\n2. 强化重点\n3. 统一语气',
        },
        {
          key: 'summary',
          title: '生成摘要',
          content: '摘要：请在这里补充 2-3 句核心结论。',
        },
      ];
    }

    return [
      {
        key: 'outline',
        title: 'Generate outline',
        content: 'Outline:\n- Context\n- Key insights\n- Next steps',
      },
      {
        key: 'rewrite',
        title: 'Polish paragraph',
        content: 'Editing notes:\n1. Reduce redundancy\n2. Highlight the main point\n3. Align tone',
      },
      {
        key: 'summary',
        title: 'Create summary',
        content: 'Summary: Add 2-3 sentences that capture the core message.',
      },
    ];
  }, [locale]);

  const turndownService = useMemo(() => {
    const service = new TurndownService({ codeBlockStyle: 'fenced' });
    service.use(gfm);
    return service;
  }, []);

  const filteredDocs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return docs;
    return docs.filter((doc) => doc.title.toLowerCase().includes(query));
  }, [docs, search]);

  const formatTime = (value?: string) => {
    if (!value) return '';
    const date = new Date(value);
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  const handleExport = async (format: 'html' | 'markdown') => {
    if (!editor) return;
    const html = editor.getHTML();
    if (!navigator.clipboard) {
      toast.error(t('export.clipboard_unavailable'));
      return;
    }

    if (format === 'markdown') {
      const markdown = turndownService.turndown(html);
      await navigator.clipboard.writeText(markdown);
      toast.success(t('export.markdown'));
      return;
    }

    await navigator.clipboard.writeText(html);
    toast.success(t('export.html'));
  };

  const applyTemplate = (template: Template) => {
    if (!activeDoc) return;
    updateDoc(activeDoc.id, {
      title: template.title,
      content: template.content,
    });
    editor?.commands.setContent(template.content, { emitUpdate: false });
  };

  const insertPrompt = (prompt: Prompt) => {
    editor?.chain().focus().insertContent(prompt.content).run();
  };

  const applyLink = () => {
    if (!editor || !linkValue) return;
    const { empty } = editor.state.selection;
    editor.chain().focus();
    if (empty) {
      editor.chain().insertContent(linkValue).setLink({ href: linkValue }).run();
    } else {
      editor.chain().setLink({ href: linkValue }).run();
    }
    setLinkValue('');
    setLinkModalOpen(false);
  };

  const applyImage = () => {
    if (!editor || !imageValue) return;
    editor.chain().focus().setImage({ src: imageValue }).run();
    setImageValue('');
    setImageModalOpen(false);
  };

  const insertTable = () => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const requestDeleteDoc = (id: string) => {
    setPendingDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteDoc = () => {
    if (pendingDeleteId) {
      deleteDoc(pendingDeleteId);
    }
    setDeleteDialogOpen(false);
    setPendingDeleteId(null);
  };

  const toolbarButton = (
    label: string,
    icon: React.ReactNode,
    onClick: () => void,
    isActive?: boolean,
    disabled?: boolean
  ) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={isActive ? 'secondary' : 'ghost'}
          size="icon-sm"
          onClick={onClick}
          disabled={disabled}
          className="h-8 w-8"
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );

  const docList = (
    <div className="flex h-full flex-col">
      <div className="border-b border-border/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <PenLine className="size-4 text-primary" />
            {t('doc_list.title')}
          </div>
          <Button size="sm" onClick={() => createDoc()} className="gap-1">
            <Plus className="size-4" />
            {t('actions.new')}
          </Button>
        </div>
        <div className="mt-3">
          <Input
            placeholder={t('doc_list.search')}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {filteredDocs.length ? (
            filteredDocs.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => setActive(doc.id)}
                className={cn(
                  'w-full rounded-xl border px-3 py-3 text-left transition',
                  doc.id === activeDoc?.id
                    ? 'border-primary/30 bg-primary/5 shadow-sm'
                    : 'border-border/60 hover:border-primary/20 hover:bg-muted/50'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        {doc.title || t('editor.title_placeholder')}
                      </span>
                      {doc.id === activeDoc?.id && (
                        <Badge variant="secondary">{t('status.active')}</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t('status.updated', { time: formatTime(doc.updatedAt) })}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={(event) => {
                      event.stopPropagation();
                      requestDeleteDoc(doc.id);
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-border/70 px-4 py-6 text-center text-sm text-muted-foreground">
              {t('doc_list.empty')}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  const toolsPanel = (
    <div className="flex h-full flex-col">
      <Tabs defaultValue="templates" className="flex h-full flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">{t('panels.templates')}</TabsTrigger>
          <TabsTrigger value="versions">{t('panels.versions')}</TabsTrigger>
          <TabsTrigger value="assistant">{t('panels.assistant')}</TabsTrigger>
        </TabsList>
        <TabsContent value="templates" className="mt-4 flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-2">
            <div className="space-y-3">
              {templates.map((template) => (
                <Card key={template.key} className="gap-3 border-border/60 py-4">
                  <CardContent className="space-y-3 px-4">
                    <div>
                      <p className="text-sm font-semibold">{template.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => applyTemplate(template)}
                    >
                      {t('templates.apply')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="versions" className="mt-4 flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-2">
            {activeDoc?.versions?.length ? (
              <div className="space-y-3">
                {activeDoc.versions.map((version) => (
                  <Card key={version.id} className="gap-3 border-border/60 py-4">
                    <CardContent className="space-y-2 px-4">
                      <div>
                        <p className="text-sm font-semibold">{version.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(version.createdAt)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => restoreVersion(activeDoc.id, version.id)}
                      >
                        {t('versions.restore')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border/70 px-4 py-6 text-center text-sm text-muted-foreground">
                {t('versions.empty')}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="assistant" className="mt-4 flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-2">
            <div className="space-y-3">
              <div className="rounded-xl border border-dashed border-border/70 px-4 py-3 text-xs text-muted-foreground">
                {t('assistant.hint')}
              </div>
              {assistantPrompts.map((prompt) => (
                <Card key={prompt.key} className="gap-3 border-border/60 py-4">
                  <CardContent className="flex items-center justify-between px-4">
                    <p className="text-sm font-semibold">{prompt.title}</p>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => insertPrompt(prompt)}
                    >
                      {t('assistant.insert')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="rich-editor-page">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {isDesktop && (
          <aside className="rich-editor-panel w-full border-b border-border/60 lg:w-72 lg:border-b-0 lg:border-r">
            {docList}
          </aside>
        )}

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4">
              <div className="flex items-center gap-3">
                {!isDesktop && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setDocsDrawerOpen(true)}
                  >
                    <Menu className="size-5" />
                  </Button>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <PenLine className="size-5" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold leading-tight">
                      {t('title')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('subtitle')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{t('status.autosave')}</Badge>
                <Button
                  type="button"
                  onClick={() => {
                    if (!activeDoc) return;
                    saveVersion(activeDoc.id);
                    toast.success(t('actions.save'));
                  }}
                  className="gap-2"
                >
                  <Save className="size-4" />
                  {t('actions.save')}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline" className="gap-2">
                      <FileDown className="size-4" />
                      {t('actions.export')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onSelect={() => handleExport('html')}
                      className="gap-2"
                    >
                      <Code2 className="size-4" />
                      {t('export.html')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => handleExport('markdown')}
                      className="gap-2"
                    >
                      <FileDown className="size-4" />
                      {t('export.markdown')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {!isDesktop && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setToolsDrawerOpen(true)}
                  >
                    <LayoutGrid className="size-5" />
                  </Button>
                )}
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-6">
            {!activeDoc ? (
              <div className="rounded-2xl border border-dashed border-border/70 px-6 py-10 text-center text-sm text-muted-foreground">
                {t('doc_list.empty')}
              </div>
            ) : (
              <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
                <Input
                  placeholder={t('editor.title_placeholder')}
                  value={activeDoc.title}
                  onChange={(event) =>
                    updateDoc(activeDoc.id, { title: event.target.value })
                  }
                  className="h-12 rounded-xl text-base font-semibold"
                />
                <Card className="gap-0 border-border/60 py-0 shadow-sm">
                  <CardContent className="p-0">
                    <div className="flex flex-wrap items-center gap-1 border-b border-border/60 bg-muted/50 px-3 py-2">
                      {toolbarButton(
                        t('toolbar.bold'),
                        <Bold className="size-4" />,
                        () => editor?.chain().focus().toggleBold().run(),
                        editor?.isActive('bold'),
                        !editor?.can().chain().focus().toggleBold().run()
                      )}
                      {toolbarButton(
                        t('toolbar.italic'),
                        <Italic className="size-4" />,
                        () => editor?.chain().focus().toggleItalic().run(),
                        editor?.isActive('italic'),
                        !editor?.can().chain().focus().toggleItalic().run()
                      )}
                      {toolbarButton(
                        t('toolbar.underline'),
                        <Underline className="size-4" />,
                        () => editor?.chain().focus().toggleUnderline().run(),
                        editor?.isActive('underline'),
                        !editor?.can().chain().focus().toggleUnderline().run()
                      )}
                      {toolbarButton(
                        t('toolbar.strike'),
                        <Strikethrough className="size-4" />,
                        () => editor?.chain().focus().toggleStrike().run(),
                        editor?.isActive('strike'),
                        !editor?.can().chain().focus().toggleStrike().run()
                      )}
                      <Separator orientation="vertical" className="mx-1 h-5" />
                      {toolbarButton(
                        t('toolbar.heading'),
                        <Heading1 className="size-4" />,
                        () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
                        editor?.isActive('heading', { level: 1 })
                      )}
                      {toolbarButton(
                        t('toolbar.heading'),
                        <Heading2 className="size-4" />,
                        () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
                        editor?.isActive('heading', { level: 2 })
                      )}
                      {toolbarButton(
                        t('toolbar.bullet'),
                        <List className="size-4" />,
                        () => editor?.chain().focus().toggleBulletList().run(),
                        editor?.isActive('bulletList')
                      )}
                      {toolbarButton(
                        t('toolbar.ordered'),
                        <ListOrdered className="size-4" />,
                        () => editor?.chain().focus().toggleOrderedList().run(),
                        editor?.isActive('orderedList')
                      )}
                      {toolbarButton(
                        t('toolbar.quote'),
                        <Quote className="size-4" />,
                        () => editor?.chain().focus().toggleBlockquote().run(),
                        editor?.isActive('blockquote')
                      )}
                      {toolbarButton(
                        t('toolbar.code'),
                        <Code2 className="size-4" />,
                        () => editor?.chain().focus().toggleCodeBlock().run(),
                        editor?.isActive('codeBlock')
                      )}
                      <Separator orientation="vertical" className="mx-1 h-5" />
                      {toolbarButton(
                        t('toolbar.link'),
                        <LinkIcon className="size-4" />,
                        () => setLinkModalOpen(true)
                      )}
                      {toolbarButton(
                        t('toolbar.image'),
                        <ImageIcon className="size-4" />,
                        () => setImageModalOpen(true)
                      )}
                      {toolbarButton(
                        t('toolbar.table'),
                        <TableIcon className="size-4" />,
                        insertTable
                      )}
                      <Separator orientation="vertical" className="mx-1 h-5" />
                      {toolbarButton(
                        t('toolbar.undo'),
                        <Undo2 className="size-4" />,
                        () => editor?.chain().focus().undo().run(),
                        false,
                        !editor?.can().chain().focus().undo().run()
                      )}
                      {toolbarButton(
                        t('toolbar.redo'),
                        <Redo2 className="size-4" />,
                        () => editor?.chain().focus().redo().run(),
                        false,
                        !editor?.can().chain().focus().redo().run()
                      )}
                    </div>
                    <div className="rich-editor-shell">
                      {editor ? <EditorContent editor={editor} /> : null}
                    </div>
                  </CardContent>
                </Card>
                <p className="text-sm text-muted-foreground">
                  {t('status.updated', { time: formatTime(activeDoc.updatedAt) })}
                </p>
              </div>
            )}
          </div>
        </main>

        {isDesktop && (
          <aside className="rich-editor-panel w-full border-t border-border/60 lg:w-80 lg:border-t-0 lg:border-l">
            <div className="h-full p-4">{toolsPanel}</div>
          </aside>
        )}
      </div>

      <Sheet open={docsDrawerOpen} onOpenChange={setDocsDrawerOpen}>
        <SheetContent side="left" className="p-0">
          {docList}
        </SheetContent>
      </Sheet>

      <Sheet open={toolsDrawerOpen} onOpenChange={setToolsDrawerOpen}>
        <SheetContent side="right" className="p-0">
          <div className="h-full p-4">{toolsPanel}</div>
        </SheetContent>
      </Sheet>

      <Dialog open={linkModalOpen} onOpenChange={setLinkModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('toolbar.link')}</DialogTitle>
            <DialogDescription>{t('dialogs.link_hint')}</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="https://"
            value={linkValue}
            onChange={(event) => setLinkValue(event.target.value)}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setLinkModalOpen(false)}>
              {t('actions.cancel')}
            </Button>
            <Button type="button" onClick={applyLink}>
              {t('assistant.insert')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('toolbar.image')}</DialogTitle>
            <DialogDescription>{t('dialogs.image_hint')}</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="https://"
            value={imageValue}
            onChange={(event) => setImageValue(event.target.value)}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setImageModalOpen(false)}>
              {t('actions.cancel')}
            </Button>
            <Button type="button" onClick={applyImage}>
              {t('assistant.insert')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dialogs.delete_title')}</DialogTitle>
            <DialogDescription>{t('dialogs.delete_description')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t('actions.cancel')}
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDeleteDoc}>
              {t('actions.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
