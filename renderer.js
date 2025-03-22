window.addEventListener('DOMContentLoaded', () => {
    try {
        console.log("Initializing Monaco Editor...");
        const monaco = require('monaco-editor');
        console.log("Monaco Editor loaded:", monaco);

        const editorElement = document.getElementById('editor');
        if (!editorElement) {
            console.error("Editor element not found");
            return;
        }

        const editor = monaco.editor.create(editorElement, {
            value: 'Hello, Typst!',
            language: 'plaintext',
            theme: 'vs-dark'
        });
        console.log("Monaco Editor initialized successfully");

        // Add a resize observer to ensure the editor resizes correctly
        const resizeObserver = new ResizeObserver(() => {
            editor.layout();
        });
        resizeObserver.observe(editorElement);

        const sidebar = document.getElementById('sidebar');
        if (!sidebar) {
            console.error("Sidebar element not found");
            return;
        }

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
    } catch (error) {
        console.error("Error initializing Monaco Editor:", error);
    }
});
