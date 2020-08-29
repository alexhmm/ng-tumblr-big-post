const fs = require('fs');
const prettier = require('prettier');
const webResourceInliner = require('web-resource-inliner');

const input = fs.readFileSync('dist/ng-tumblr/index.html', 'utf8');

new webResourceInliner.html(
  {
    fileContent: input,
    relativeTo: 'dist/ng-tumblr'
  },
  function (error, result) {
    if (error) {
      console.error('Error on formatting result:', error);
    }
    const formatted = prettier.format(result, {
      arrowParens: 'avoid',
      bracketSpacing: true,
      endOfLine: 'auto',
      htmlWhitespaceSensitivity: 'css',
      insertPragma: false,
      jsxBracketSameLine: false,
      jsxSingleQuote: true,
      parser: 'html',
      printWidth: 80,
      proseWrap: 'preserve',
      quoteProps: 'consistent',
      requirePragma: false,
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'none',
      useTabs: false,
      vueIndentScriptAndStyle: false
    });
    fs.writeFile('dist/inline.html', formatted, 'utf8', function (error) {
      if (error) {
        console.error('Error on writing file:', error);
      } else {
        console.log('Success on formatting file.');
      }
    });
  }
);
