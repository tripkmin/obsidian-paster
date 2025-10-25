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

		// Paste as link
		editor.replaceSelection(`[](${convertedText})`);
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
	}
}
