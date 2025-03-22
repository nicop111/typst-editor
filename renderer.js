window.addEventListener('DOMContentLoaded', () => {
    const monaco = require('monaco-editor');

    monaco.editor.create(document.getElementById('editor'), {
        value: 'Hello, Typst!',
        language: 'plaintext',
        theme: 'vs-dark'
    });
});
