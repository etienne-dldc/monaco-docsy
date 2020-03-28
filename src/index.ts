import { languages } from 'monaco-editor';

export const DOCSY_MONARCH_TOKENS: languages.IMonarchLanguage = {
  // defaultToken: 'invalid',

  // @ts-ignore
  keywords: ['true', 'false', 'null'],

  brackets: [
    { open: '{', close: '}', token: 'delimiter.bracket' },
    { open: '[', close: ']', token: 'delimiter.bracket' },
    { open: '(', close: ')', token: 'delimiter.parenthesis' },
  ],

  start: 'root',

  tokenizer: {
    root: [
      { include: 'comment' },
      { include: 'tag' },
      { include: 'inject' },
      // text
      [/[^<|/]+/, 'text'],
      [/[<|/]/, 'text'],
    ],
    comment: [
      // line comment
      [/([ \t\r]*)(\/\/.*)/, ['', 'comment.line']],
      [/\/\*/, { token: 'comment.block', next: '@commentBlock' }],
    ],
    commentBlock: [
      [/\*\//, { token: 'comment.block', next: '@pop' }],
      [/[^*]+/, 'comment.block'],
      [/[*]/, 'comment.block'],
    ],
    inject: [[/(\{)/, { token: 'punctuation.bracket', next: '@expression' }]],
    tag: [
      [/<\|>/, { token: 'tag.fragment', next: '@children' }],
      [/<#>/, { token: 'tag.rawfragment', next: '@rawFragmentChildren' }],
      [/<\|[a-zA-Z][a-zA-Z0-9.]*/, { token: '@rematch', next: '@tagInner' }],
      [/<#[a-zA-Z][a-zA-Z0-9.]*/, { token: '@rematch', next: '@tagRawInner' }],
    ],
    tagInner: [
      // open with new line before props
      [
        /(<\|)([a-zA-Z][a-zA-Z0-9.]*)$/,
        [{ token: 'delimiter.tag' }, { token: 'tag', switchTo: '@tagOpenning' }],
      ],
      // Open
      [
        /(<\|)([a-zA-Z][a-zA-Z0-9.]*)([ \t\r]*)/,
        [
          { token: 'delimiter.tag' },
          { token: 'tag' },
          { token: '@rematch', switchTo: '@tagOpenning' },
        ],
      ],
    ],
    tagOpenning: [
      { include: 'tagProps' },
      // self closing tag
      [/([ \t\r]?)(\|>)/, [{ token: '' }, { token: 'delimiter.tag', next: '@pop' }]],
      // end of opening tag
      [
        />/,
        {
          token: 'delimiter.tag',
          switchTo: '@children',
        },
      ],
    ],
    tagProps: [
      // props with space before
      [
        /([ \t\r]+)([a-zA-Z][\w]*)(=)/,
        [{ token: '' }, { token: 'attribute.name', next: '@expression' }, { token: 'delimiter' }],
      ],
      [/([ \t\r]+)([a-zA-Z][\w]*)/, [{ token: '' }, { token: 'attribute.name' }]],
      // props at the start of the line
      [
        /^([a-zA-Z][\w]*)(=)/,
        [{ token: 'attribute.name', next: '@expression' }, { token: 'delimiter' }],
      ],
      [/^([a-zA-Z][\w]*)/, [{ token: 'attribute.name' }]],
      { include: 'comment' },
    ],
    children: [
      // named closing tag
      [
        /(<)([a-zA-Z][a-zA-Z0-9.]*)(\|>)/,
        [{ token: 'delimiter.tag' }, { token: 'tag' }, { token: 'delimiter.tag', next: '@pop' }],
      ],
      // close
      [/(\|>)/, [{ token: 'delimiter.tag', next: '@pop' }]],
      { include: 'root' },
    ],
    tagRawInner: [
      // open with new line before props
      [
        /(<#)([a-zA-Z][a-zA-Z0-9.]*)$/,
        [{ token: 'delimiter.tag' }, { token: 'tag', switchTo: '@tagRawOpenning' }],
      ],
      // Open
      [
        /(<#)([a-zA-Z][a-zA-Z0-9.]*)([ \t\r]*)/,
        [
          { token: 'delimiter.tag' },
          { token: 'tag' },
          { token: '@rematch', switchTo: '@tagRawOpenning' },
        ],
      ],
    ],
    tagRawOpenning: [
      { include: 'tagProps' },
      // end of opening tag
      [
        />/,
        {
          token: 'delimiter.tag',
          switchTo: '@rawChildren',
        },
      ],
    ],
    rawChildren: [
      // unraw
      [/(<#>)/, [{ token: 'tag.unraw', next: '@unrawChildren' }]],
      // named closing tag
      [
        /(<)([a-zA-Z][a-zA-Z0-9.]*)(#>)/,
        [{ token: 'delimiter.tag' }, { token: 'tag' }, { token: 'delimiter.tag', next: '@pop' }],
      ],
      // close
      [/(#>)/, [{ token: 'delimiter.tag', next: '@pop' }]],
      // raw content
      [/[^<#]+/, { token: 'raw' }],
      [/[<#]/, { token: 'raw' }],
    ],
    rawFragmentChildren: [
      [/<#>/, { token: 'tag', next: '@pop' }],
      [/[^<]/, { token: 'raw' }],
    ],
    unrawChildren: [[/<#>/, { token: 'tag.unrawclose', next: '@pop' }], { include: 'root' }],
    expression: [
      [/{/, { token: 'delimiter', switchTo: '@object' }],
      [/\[/, { token: 'delimiter', switchTo: '@array' }],
      [/`/, { token: 'attribute.value', switchTo: '@string' }],
      [/"([^"]*)"/, { token: 'attribute.value', next: '@pop' }],
      [/'([^']*)'/, { token: 'attribute.value', next: '@pop' }],
      // number
      [/(-?)[\d]+(\.[\d]+)?/, { token: 'attribute.value', next: '@pop' }],
      [
        /[a-zA-Z][a-zA-Z0-9_$]+/,
        {
          cases: {
            '@keywords': { token: 'keyword', next: '@pop' },
            '@default': { token: 'identifier', switchTo: '@identifier' },
          },
        },
      ],
    ],
    string: [
      [/[^`]+/, 'attribute.value'],
      [/`/, 'attribute.value', '@pop'],
    ],
    identifier: [
      [/\./, 'dot'],
      [/[a-zA-Z][a-zA-Z0-9_$]+/, { token: 'identifier' }],
      [/\(\)/, { token: 'call' }],
      [/./, { token: '', next: '@pop', goBack: 1 }],
    ],
    object: [
      // foo:
      [
        /([a-zA-Z][\w]+)(:[ \t\r]*)/,
        [{ token: 'attribute.name' }, { token: 'delimiter', next: '@expression' }],
      ],
      // 'foo':
      [
        /('[^']+')(:[ \t\r]*)/,
        [{ token: 'attribute.name' }, { token: 'delimiter', next: '@expression' }],
      ],
      // "foo":
      [
        /("[^"]+")(:[ \t\r]*)/,
        [{ token: 'attribute.name' }, { token: 'delimiter', next: '@expression' }],
      ],
      // Computed start [@expression
      [/\[/, { token: 'attribute.bracket', next: '@computedProperty' }],
      [
        /(\.\.\.)([a-zA-Z][a-zA-Z0-9_$]+)/,
        [{ token: 'delimiter' }, { token: 'identifier', next: '@identifier' }],
      ],
      [/,/, 'delimiter'],
      [/}/, { token: 'delimiter', next: '@pop' }],
      [/[ \t\r]+/, { token: '' }],
    ],
    computedProperty: [
      // Computed end ]:
      [
        /(\])(:[ \t\r]*)/,
        [{ token: 'attribute.bracket' }, { token: 'delimiter', switchTo: '@expression' }],
      ],
      [/[^\]]+/, { token: '@rematch', next: '@expression' }],
    ],
    array: [
      [/,/, 'delimiter'],
      [/]/, { token: 'delimiter', next: '@pop' }],
      [/[ \t\r]+/, ''],
      [/[^,\]]+/, { token: '@rematch', next: '@expression' }],
    ],
  },
};

export const DOCSY_LANGUAGE_CONFIGURATION: languages.LanguageConfiguration = {
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/'],
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"', notIn: ['string'] },
    { open: "'", close: "'", notIn: ['string', 'comment'] },
    { open: '`', close: '`', notIn: ['string', 'comment'] },
    { open: '/*', close: '*/', notIn: ['string'] },
  ],
};

export function registerDocsy(monaco: typeof import('monaco-editor')) {
  monaco.languages.register({ id: 'docsy' });
  monaco.languages.setMonarchTokensProvider('docsy', DOCSY_MONARCH_TOKENS);
  monaco.languages.setLanguageConfiguration('docsy', DOCSY_LANGUAGE_CONFIGURATION);
}
