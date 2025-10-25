import {
	App,
	Editor,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

interface PasterPluginSettings {
	convertYoutubeShorts: boolean;
}

const DEFAULT_SETTINGS: PasterPluginSettings = {
	convertYoutubeShorts: true,
};

export default class PasterPlugin extends Plugin {
	settings: PasterPluginSettings;

	async onload() {
		await this.loadSettings();

		// Add command for image paste (Ctrl + Shift + Alt + V)
		this.addCommand({
			id: "paste-as-image",
			name: "Paste as Image Link",
			editorCallback: (editor: Editor) => this.pasteAsImage(editor),
			hotkeys: [
				{
					modifiers: ["Ctrl", "Shift", "Alt"],
					key: "v",
				},
			],
		});

		// Add command for link paste (Ctrl + Alt + V)
		this.addCommand({
			id: "paste-as-link",
			name: "Paste as Link",
			editorCallback: (editor: Editor) => this.pasteAsLink(editor),
			hotkeys: [
				{
					modifiers: ["Ctrl", "Alt"],
					key: "v",
				},
			],
		});

		// Add command for plain link paste (Alt + V)
		this.addCommand({
			id: "paste-as-plain-link",
			name: "Paste as Plain Link",
			editorCallback: (editor: Editor) => this.pasteAsPlainLink(editor),
			hotkeys: [
				{
					modifiers: ["Alt"],
					key: "v",
				},
			],
		});

		// Add settings tab
		this.addSettingTab(new PasterSettingTab(this.app, this));
	}

	async pasteAsImage(editor: Editor): Promise<void> {
		const clipboardText = await navigator.clipboard.readText();
		if (!clipboardText) {
			new Notice("No text in clipboard");
			return;
		}

		// Convert YouTube Shorts URL if setting is enabled
		const convertedText = this.convertYoutubeShortsUrl(clipboardText);

		// Paste as image link
		editor.replaceSelection(`![](${convertedText})`);
	}

	async pasteAsLink(editor: Editor): Promise<void> {
		const clipboardText = await navigator.clipboard.readText();
		if (!clipboardText) {
			new Notice("No text in clipboard");
			return;
		}

		// Convert YouTube Shorts URL if setting is enabled
		const convertedText = this.convertYoutubeShortsUrl(clipboardText);

		// Paste as link and position cursor between brackets
		const linkText = `[](${convertedText})`;
		editor.replaceSelection(linkText);

		// Move cursor to position 1 (between the brackets)
		const cursor = editor.getCursor();
		editor.setCursor({
			line: cursor.line,
			ch: cursor.ch - convertedText.length - 3,
		});
	}

	async pasteAsPlainLink(editor: Editor): Promise<void> {
		const clipboardText = await navigator.clipboard.readText();
		if (!clipboardText) {
			new Notice("No text in clipboard");
			return;
		}

		// Convert YouTube Shorts URL if setting is enabled
		const convertedText = this.convertYoutubeShortsUrl(clipboardText);

		// Paste as plain link (no markdown formatting)
		editor.replaceSelection(convertedText);
	}

	private convertYoutubeShortsUrl(url: string): string {
		if (!this.settings.convertYoutubeShorts) {
			return url;
		}

		// YouTube URL 패턴들을 모두 처리
		// 1. YouTube Shorts: youtube.com/shorts/VIDEO_ID
		const shortsRegex =
			/^https?:\/\/(?:www\.|m\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]+)(\?.*)?$/;
		// 2. YouTube Shorts (youtu.be): youtu.be/VIDEO_ID
		const youtuBeRegex =
			/^https?:\/\/(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)(\?.*)?$/;
		// 3. YouTube watch: youtube.com/watch?v=VIDEO_ID
		const watchRegex =
			/^https?:\/\/(?:www\.|m\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)(&.*)?$/;
		// 4. YouTube embed: youtube.com/embed/VIDEO_ID
		const embedRegex =
			/^https?:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)(\?.*)?$/;

		// 각 패턴에 대해 매칭 시도
		let match = url.match(shortsRegex);
		if (match) {
			const videoId = match[1];
			return `https://www.youtube.com/watch?v=${videoId}`;
		}

		match = url.match(youtuBeRegex);
		if (match) {
			const videoId = match[1];
			return `https://www.youtube.com/watch?v=${videoId}`;
		}

		match = url.match(watchRegex);
		if (match) {
			const videoId = match[1];
			return `https://www.youtube.com/watch?v=${videoId}`;
		}

		match = url.match(embedRegex);
		if (match) {
			const videoId = match[1];
			return `https://www.youtube.com/watch?v=${videoId}`;
		}

		return url;
	}

	onunload() {
		console.log("unloading obsidian-paster");
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class PasterSettingTab extends PluginSettingTab {
	plugin: PasterPlugin;

	constructor(app: App, plugin: PasterPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Convert YouTube URLs")
			.setDesc(
				"Automatically convert all YouTube URLs (Shorts, youtu.be, embed, etc.) to standard watch format for better embedding compatibility"
			)
			.addToggle((val) =>
				val
					.setValue(this.plugin.settings.convertYoutubeShorts)
					.onChange(async (value) => {
						this.plugin.settings.convertYoutubeShorts = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
