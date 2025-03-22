window.addEventListener('DOMContentLoaded', () => {
    const monaco = require('monaco-editor');

    const editor = monaco.editor.create(document.getElementById('editor'), {
        value: 'Hello, Typst!',
        language: 'plaintext',
        theme: 'vs-dark'
    });

    const sidebar = document.getElementById('sidebar');

    window.electron.onFolderSelected((folderStructure) => {
        sidebar.innerHTML = '';
        const renderFolder = (folder, parentElement) => {
            folder.forEach(item => {
                const element = document.createElement('div');
                element.textContent = item.name;
                element.className = 'file';
                parentElement.appendChild(element);

                if (item.type === 'folder') {
                    element.addEventListener('click', () => {
                        if (element.nextSibling && element.nextSibling.className === 'folder-contents') {
                            element.nextSibling.remove();
                        } else {
                            const folderContents = document.createElement('div');
                            folderContents.className = 'folder-contents';
                            folderContents.style.paddingLeft = '10px';
                            renderFolder(item.children, folderContents);
                            parentElement.insertBefore(folderContents, element.nextSibling);
                        }
                    });
                } else {
                    element.addEventListener('click', () => {
                        window.electron.openFile(item.path).then(content => {
                            editor.setValue(content);
                        });
                    });
                }
            });
        };
        renderFolder(folderStructure, sidebar);
    });
});
