[한국어](README-KR.md)

# Obsidian Paster

A simple Obsidian plugin that makes pasting links faster and fixes YouTube Shorts embedding issues.

## Why Paster?

**Problem 1**: Creating links in Obsidian requires multiple steps - copy URL, type `[`, paste, type `]`, type `(`, paste again, type `)`. It's tedious and breaks your flow.

**Problem 2**: YouTube Shorts URLs don't embed properly in Obsidian. The `youtu.be` format works much better for embedding.

**Solution**: Paster provides quick keyboard shortcuts and automatically converts YouTube Shorts URLs to the embeddable format.

## Features

-   **Quick Link Creation**: `Ctrl + Alt + V` to paste as `[text](url)` format
-   **Quick Image Links**: `Ctrl + Shift + Alt + V` to paste as `![](url)` format
-   **YouTube Shorts Fix**: Automatically converts `youtube.com/shorts/` URLs to `youtu.be/` format for proper embedding

## Installation

1. Download the latest release from the [releases page](https://github.com/yourusername/obsidian-paster/releases)
2. Extract `main.js`, `manifest.json` to your vault's `.obsidian/plugins/obsidian-paster/` folder
3. Enable the plugin in **Settings → Community plugins**

## Usage

### Quick Commands

-   **`Ctrl + Alt + V`**: Paste clipboard content as a link `[text](url)`
-   **`Ctrl + Shift + Alt + V`**: Paste clipboard content as an image link `![](url)`

### YouTube Shorts Conversion

When enabled, these URLs are automatically converted:

-   `https://www.youtube.com/shorts/VIDEO_ID` → `https://www.youtu.be/VIDEO_ID`
-   `https://m.youtube.com/shorts/VIDEO_ID` → `https://www.youtu.be/VIDEO_ID`

## Settings

Go to **Settings → Community plugins → Obsidian Paster**:

-   **Convert YouTube Shorts URLs**: Enable/disable automatic conversion

## Development

```bash
npm install
npm run dev
```

## License

MIT License
