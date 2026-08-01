declare module 'highlight.js' {
  interface HighlightResult {
    value: string;
    relevance: number;
    language?: string;
    illegal: boolean;
  }

  interface HLJSApi {
    highlight(code: string, options: { language: string; ignoreIllegals?: boolean }): HighlightResult;
    highlightAuto(code: string, languageSubset?: string[]): HighlightResult;
    getLanguage(languageName: string): any;
    [key: string]: any;
  }

  const hljs: HLJSApi;
  export default hljs;
}
