# Obsidian Paster

Obsidian에서 링크 붙여넣기를 빠르게 하고 YouTube Shorts 임베딩 문제를 해결하는 간단한한 플러그인입니다.

## Paster를 만든 이유

**문제 1**: Obsidian에서 링크를 만들려면 여러 단계가 필요합니다 - URL 복사, `[` 입력, 붙여넣기, `]` 입력, `(` 입력, 다시 붙여넣기, `)` 입력. 번거롭고 작업 흐름을 방해합니다.

**문제 2**: YouTube Shorts URL이 Obsidian에서 제대로 임베딩되지 않습니다. `youtu.be` 형식이 임베딩에 훨씬 더 잘 작동합니다.

**해결책**: Paster는 빠른 키보드 단축키를 제공하고 YouTube Shorts URL을 임베딩 가능한 형식으로 자동 변환합니다.

## 기능

-   **빠른 링크 생성**: `Ctrl + Alt + V`로 `[텍스트](URL)` 형식으로 붙여넣기
-   **빠른 이미지 링크**: `Ctrl + Shift + Alt + V`로 `![](URL)` 형식으로 붙여넣기
-   **YouTube Shorts 수정**: `youtube.com/shorts/` URL을 적절한 임베딩을 위해 `youtu.be/` 형식으로 자동 변환

## 설치

1. [릴리스 페이지](https://github.com/yourusername/obsidian-paster/releases)에서 최신 릴리스를 다운로드
2. `main.js`, `manifest.json`를 볼트의 `.obsidian/plugins/obsidian-paster/` 폴더에 추출
3. **설정 → 커뮤니티 플러그인**에서 플러그인 활성화

## 사용법

### 빠른 명령어

-   **`Ctrl + Alt + V`**: 클립보드 내용을 링크 `[텍스트](URL)` 형식으로 붙여넣기
-   **`Ctrl + Shift + Alt + V`**: 클립보드 내용을 이미지 링크 `![](URL)` 형식으로 붙여넣기

### YouTube Shorts 변환

활성화되면 다음 URL들이 자동으로 변환됩니다:

-   `https://www.youtube.com/shorts/VIDEO_ID` → `https://www.youtu.be/VIDEO_ID`
-   `https://m.youtube.com/shorts/VIDEO_ID` → `https://www.youtu.be/VIDEO_ID`

## 설정

**설정 → 커뮤니티 플러그인 → Obsidian Paster**로 이동:

-   **Convert YouTube Shorts URLs**: 자동 변환 활성화/비활성화

## 개발

```bash
npm install
npm run dev
```

## 라이선스

MIT License
