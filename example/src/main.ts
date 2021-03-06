import "./index.css";
import loader from "@monaco-editor/loader";
import { registerDocsyExpression } from "../../src";

const content = `
<|Title>{Foo.bar()} <|B>world|> !|>

Hello

<|Title color="red">Hello world !|>

<|Title color="red">Hello world !<Title|>

<|Title bold>Hello world !|>

<|Title bold|>

<|Title

|>

<|Title mainColor="red">
Hello <|B>world|> !
<Title|>

<|Title config={ color: "green", 'other': 'blue', [property]: true } hey="yoo" num=34 bool=true noop=null |>

<|Title config=[34, \`foo\`, Theme.bar]>Hello <|B>world|> !|>

<|Title
  config={ color: "green", ...Theme.spread }
  hey="yoo"
  num=-34.90
  bool=true
  noop=null
  access=Foo['bar'].foo()
>
Hello <|B>world|> !
|>

<|>Foo <|Bar|> <|>
<#>Foo <|Bar|> <#>

// Foo

/* Comment */

// More comment !

<|>A1<|Demo>B1<|>C1<|>B2|>A2<|>

<#>
Some raw code
// No comments in this !
<|Block color="red">
<|Agathe color="red">
<#>

<#Code language="javascript">
Some raw code
// No comments in this !
<Code#>

<#Code language="javascript">
Some raw code
// No comments in this !
<#><|Block color="red"|><#>
<|Block color="red">
<#>
// comment here
<|Block color="red"|>
/* More comment */<|Block color="red"|>
<#>
<|Agathe color="red">
<Code#>

<|Block color="red">
<|Agathe color="red">
bla bla bla
<Agathe|>
<Block|>

<|Block theme=Theme.dark() /* foo=43 */ |>
`;

// content = '{ foo: "hello" }';

loader.init().then((monaco) => {
  registerDocsyExpression(monaco);

  monaco.editor.defineTheme("docsy-theme", {
    base: "vs-dark",
    inherit: true,
    colors: {},
    rules: [
      { token: "tag", foreground: "32648e" },
      { token: "delimiter.tag", foreground: "32648e" },
      { token: "delimiter", foreground: "676767" },
      { token: "invalid", foreground: "73ff00" },
      { token: "identifier", foreground: "ee7070" },
      { token: "call", foreground: "ee7070" },
      { token: "dot", foreground: "ee7070" },
      { token: "attribute.name", foreground: "b33b44", fontStyle: "italic" },
      { token: "attribute.bracket", foreground: "b33b44", fontStyle: "italic" },
      { token: "comment", foreground: "546E7A" },
      { token: "raw", foreground: "5c5c5c" },
    ],
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const editor = monaco.editor.create(document.getElementById("root")!, {
    value: content,
    language: "docsy-expression",
    fontFamily: "Fira Code",
    theme: "docsy-theme",
    fontLigatures: true,
    tabSize: 2,
  });

  console.log(editor);
});
