'use client';

import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type EditorVersion = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export type EditorDoc = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  versions: EditorVersion[];
};

type EditorState = {
  docs: EditorDoc[];
  activeId: string | null;
  createDoc: (title?: string) => string;
  updateDoc: (id: string, data: Partial<Pick<EditorDoc, 'title' | 'content'>>) => void;
  setActive: (id: string) => void;
  deleteDoc: (id: string) => void;
  saveVersion: (id: string) => void;
  restoreVersion: (docId: string, versionId: string) => void;
};

const now = () => new Date().toISOString();
const MAX_VERSIONS = 12;

const createSampleDoc = (): EditorDoc => ({
  id: nanoid(),
  title: 'Welcome',
  content: '<h2>Welcome to Rich Editor</h2><p>Start writing your story here.</p>',
  updatedAt: now(),
  versions: [],
});

const initialDoc = createSampleDoc();

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      docs: [initialDoc],
      activeId: initialDoc.id,
      createDoc: (title) => {
        const id = nanoid();
        const doc: EditorDoc = {
          id,
          title: title?.trim() || 'Untitled',
          content: '<p></p>',
          updatedAt: now(),
          versions: [],
        };
        set((state) => ({
          docs: [doc, ...state.docs],
          activeId: id,
        }));
        return id;
      },
      updateDoc: (id, data) => {
        set((state) => ({
          docs: state.docs.map((doc) =>
            doc.id === id
              ? {
                  ...doc,
                  ...data,
                  updatedAt: now(),
                }
              : doc
          ),
        }));
      },
      setActive: (id) => set({ activeId: id }),
      deleteDoc: (id) => {
        set((state) => {
          const nextDocs = state.docs.filter((doc) => doc.id !== id);
          const nextActive =
            state.activeId === id ? nextDocs[0]?.id ?? null : state.activeId;
          const fallbackDoc = createSampleDoc();
          return {
            docs: nextDocs.length ? nextDocs : [fallbackDoc],
            activeId: nextDocs.length ? nextActive : fallbackDoc.id,
          };
        });
      },
      saveVersion: (id) => {
        set((state) => ({
          docs: state.docs.map((doc) => {
            if (doc.id !== id) return doc;
            const version: EditorVersion = {
              id: nanoid(),
              title: doc.title,
              content: doc.content,
              createdAt: now(),
            };
            return {
              ...doc,
              versions: [version, ...doc.versions].slice(0, MAX_VERSIONS),
            };
          }),
        }));
      },
      restoreVersion: (docId, versionId) => {
        set((state) => ({
          docs: state.docs.map((doc) => {
            if (doc.id !== docId) return doc;
            const version = doc.versions.find((item) => item.id === versionId);
            if (!version) return doc;
            return {
              ...doc,
              title: version.title,
              content: version.content,
              updatedAt: now(),
            };
          }),
        }));
      },
    }),
    {
      name: 'rich-editor-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
