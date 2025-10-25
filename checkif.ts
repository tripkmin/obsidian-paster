import { Editor } from "obsidian";

export class CheckIf {
	public static isMarkdownLinkAlready(editor: Editor): boolean {
		let cursor = editor.getCursor();

		// Check if the characters before the url are ]( to indicate a markdown link
		var titleEnd = editor.getRange(
			{ ch: cursor.ch - 2, line: cursor.line },
			{ ch: cursor.ch, line: cursor.line }
		);

		return titleEnd == "](";
	}

	public static isAfterQuote(editor: Editor): boolean {
		let cursor = editor.getCursor();

		// Check if the characters before the url are " or ' to indicate we want the url directly
		// This is common in elements like <a href="linkhere"></a>
		var beforeChar = editor.getRange(
			{ ch: cursor.ch - 1, line: cursor.line },
			{ ch: cursor.ch, line: cursor.line }
		);

		return beforeChar == '"' || beforeChar == "'";
	}

	public static isUrl(text: string): boolean {
		const regex =
			/^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/i;
		return regex.test(text);
	}

	public static isImage(text: string): boolean {
		const imageRegex = /\.(gif|jpe?g|tiff?|png|webp|bmp|tga|psd|ai)$/i;
		return imageRegex.test(text);
	}

	public static isLinkedUrl(text: string): boolean {
		const linkRegex =
			/^\[([^\[\]]*)\]\((https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})\)$/i;
		return linkRegex.test(text);
	}
}
