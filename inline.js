const fs = require('fs');
const prettier = require('prettier');
const webResourceInliner = require('web-resource-inliner');

// Read index.html from single page application
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
    // Format file with prettier
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
    // Write inlined output file
    fs.writeFile('dist/inline.html', formatted, 'utf8', function (error) {
      if (error) {
        console.error('Error on writing file:', error);
      } else {
        console.log('Success on formatting file.');
      }
    });
  }
);
