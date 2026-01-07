# Rich Editor

A ShipAny Two (Next.js 16) app that ships a modern rich text editor with templates, version snapshots, and export to HTML/Markdown. This repo includes a refreshed landing page, localized content (EN/ZH), and a client-side editor built with Tiptap and Ant Design.

## Features

- Rich text editor (headings, lists, quotes, code blocks, tables, images)
- Templates and prompt inserts (demo)
- Version snapshots with restore
- Export to HTML or Markdown
- Local autosave (browser storage)
- EN/ZH localization

## Tech Stack

- Next.js 16 (App Router)
- ShipAny Two template
- Tiptap editor
- Ant Design UI
- Tailwind CSS
- next-intl
- Zustand

## Requirements

- Node.js 18+ (recommended)
- pnpm 10+

## Setup

```powershell
# from repo root
$env:PNPM_HOME="e:\jhy\code\.pnpm"
$env:PATH="$env:PNPM_HOME;$env:PNPM_HOME\bin;$env:PATH"

pnpm install
```

## Development

```powershell
pnpm dev -- --hostname 127.0.0.1 --port 5174
```

Open:
- http://127.0.0.1:5174/zh/editor
- http://127.0.0.1:5174/en/editor

## Build

```powershell
pnpm build
pnpm start
```

## Key Routes

- /zh/editor or /en/editor: rich text editor
- /zh or /en: landing page

## Environment Variables

These are defined in `.env.example` and used by the app:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_DEFAULT_LOCALE`

## Notes

- If you see a redirect loop, clear `localhost` cookies and visit a locale-prefixed route.
- If port 5174 is in use, pick another port, for example 5175.
