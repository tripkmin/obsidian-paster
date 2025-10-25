import {
	App,
	Editor,
	MarkdownView,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

interface PasterPluginSettings {
	convertYoutubeShorts: boolean;
	convertOnDefaultPaste: boolean;
}

const DEFAULT_SETTINGS: PasterPluginSettings = {
	convertYoutubeShorts: true,
	convertOnDefaultPaste: true,
};

export default class PasterPlugin extends Plugin {
	settings: PasterPluginSettings;

	async onload() {
		await this.loadSettings();

		// Register paste event listener for default paste (Ctrl + V)
		this.registerEvent(
			this.app.workspace.on("editor-paste", this.handlePaste.bind(this))
		);

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

		// Add settings tab
		this.addSettingTab(new PasterSettingTab(this.app, this));
	}

	async handlePaste(evt: ClipboardEvent, editor: Editor): Promise<void> {
		if (
			!this.settings.convertYoutubeShorts ||
			!this.settings.convertOnDefaultPaste
		) {
			return;
		}

		const clipboardText = evt.clipboardData?.getData("text/plain");
		if (!clipboardText) {
			return;
		}

		// Check if it's a YouTube Shorts URL
		const convertedText = this.convertYoutubeShortsUrl(clipboardText);
		if (convertedText !== clipboardText) {
			// Prevent default paste and insert converted URL
			evt.preventDefault();
			evt.stopPropagation();
			editor.replaceSelection(convertedText);
		}
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

		// Paste as link
		editor.replaceSelection(`[](${convertedText})`);
	}

	private convertYoutubeShortsUrl(url: string): string {
		if (!this.settings.convertYoutubeShorts) {
			return url;
		}

		// YouTube Shorts URL 패턴 매칭 (www, m, 또는 도메인 없음 모두 포함)
		const shortsRegex =
			/^https?:\/\/(?:www\.|m\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]+)(\?.*)?$/;
		const match = url.match(shortsRegex);

		if (match) {
			const videoId = match[1];
			const queryParams = match[2] || "";
			return `https://www.youtu.be/${videoId}${queryParams}`;
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
			.setName("Convert YouTube Shorts URLs")
			.setDesc(
				"Automatically convert YouTube Shorts URLs to regular YouTube URLs for better embedding compatibility"
			)
			.addToggle((val) =>
				val
					.setValue(this.plugin.settings.convertYoutubeShorts)
					.onChange(async (value) => {
						this.plugin.settings.convertYoutubeShorts = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Convert on default paste (Ctrl + V)")
			.setDesc(
				"Convert YouTube Shorts URLs when using the default paste command (Ctrl + V)"
			)
			.addToggle((val) =>
				val
					.setValue(this.plugin.settings.convertOnDefaultPaste)
					.onChange(async (value) => {
						this.plugin.settings.convertOnDefaultPaste = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
