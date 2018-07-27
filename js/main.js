
require('./materialize.min');

//md components
const sideNav = M.Sidenav.init(document.querySelector('.sidenav'));
const collapSible = M.Collapsible.init(document.querySelector('.collapsible'));

//raw lib
const dialog = require('electron').remote.dialog;
const fileSystem = require('fs');

//vue obj
const Vue = require('./vue');

const rawHtml = '<img src="asset/b.JPG"><h1>Welcome to Laurel😀</h1>';

let openButton = new Vue({
    el: '#openButton',
    data: {
        message: 'Open File'
    },
    methods: {
        readMD: openMarkdown
    }
});

let fileList = new Vue({
    el: '#fileList',
    data: {
        files: [],
        activeIndex: -1,

    },
    methods: {
        addFile(fileName) {
            this.files.push({ name: fileName, isActive: true });
            if (this.activeIndex < 0) {
                this.activeIndex = 0;
            } else {
                this.files[this.activeIndex].isActive = false;
                this.activeIndex = this.files.length - 1;
            }
            collapSible.open();
        },
        removeFile(openingIndex) {
            this.files.splice(openingIndex, 1);
            this.activeIndex--;
            if (this.files.length !== 0 && this.activeIndex === -1) {
                this.activeIndex++;
            }
            if (this.activeIndex !== -1) {
                this.files[this.activeIndex].isActive = true;
            }
        },
        click(file, index) {
            if (this.activeIndex >= 0 && this.activeIndex !== index) {
                this.files[this.activeIndex].isActive = false;
                file.isActive = true;
                this.activeIndex = index;
                mainContent.updateMainContent(index);
            }
        },
        revert(fileListStatus) {
            fileListStatus.files.forEach(element => {
                this.files.push(element);
            });
            this.activeIndex = fileListStatus.activeIndex;
            collapSible.open();
        },
        check(fileName) {
            let flag = false;
            this.files.forEach(ele => {
                if (ele.name === fileName) {
                    flag = true;
                }
            });
            return flag;
        }
    }
});

let mainContent = new Vue({
    el: '#mainContent',
    data: {
        rawHtml: rawHtml,
        isCenter: true
    },
    methods: {
        addMainContent: function (fileName, formatHtml) {
            openedFiles.push({ name: fileName, html: formatHtml });
            openingIndex = openedFiles.length - 1;
            this.rawHtml = formatHtml;
            this.isCenter = false;
            saveStatusToSessionStorage();
        },
        updateMainContent: function (index) {
            openingIndex = index;
            let openedFile = openedFiles[index];
            if (openedFile) {
                this.rawHtml = openedFile.html;
                this.isCenter = false;
                saveStatusToSessionStorage();
            }
        }
    }
});

let toolBar = new Vue({
    el: '#toolBarSection',
    data: {
        isDisabled: true
    },
    methods: {
        close() {
            closeFile();
        }
    }
});

let openingIndex;
let openedFiles;

revertFromStatus();

/*
 * 打开Markdown文件
 */
function openMarkdown() {
    dialog.showOpenDialog({ properties: ['openFile'] }, (filePaths) => {
        let openingFileName = tranferPathToName(filePaths[0]);
        if (fileList.check(openingFileName)) {
            return;
        }
        fileList.addFile(openingFileName);
        let originMd = fileSystem.readFileSync(filePaths[0].toString()).toString();
        let mdHtml = tranferMDToHtml(originMd);
        mainContent.addMainContent(openingFileName, mdHtml);
        toolBar.isDisabled = false;
    });
}

/*
 * 根据路径获取文件名称
 */
function tranferPathToName(filePath) {
    const path = require('path');
    return path.basename(filePath).split('.')[0];
}

/*
 * 
 */
function tranferMDToHtml(mdContent) {
    const showdown = require('showdown');
    const convertor = new showdown.Converter();
    return convertor.makeHtml(mdContent);
}

function saveStatusToSessionStorage() {
    let status = {
        fileListStatus: {
            files: fileList.files,
            activeIndex: fileList.activeIndex
        },
        pageStatus: {
            openingIndex: openingIndex,
            openedFiles: openedFiles
        }
    };
    sessionStorage.setItem('status', JSON.stringify(status));
}

function revertFromStatus() {
    let statusJson = sessionStorage.getItem('status');
    if (statusJson) {
        let status = JSON.parse(statusJson);
        fileList.revert(status.fileListStatus);
        openingIndex = status.pageStatus.openingIndex;
        openedFiles = status.pageStatus.openedFiles;
        mainContent.updateMainContent(openingIndex);
        toolBar.isDisabled = false;
    } else {
        openingIndex = -1;
        openedFiles = new Array();
    }
}

function closeFile() {
    if (openingIndex === -1) {
        return;
    }
    fileList.removeFile(openingIndex);
    openedFiles.splice(openingIndex, 1);
    openingIndex--;
    if (openingIndex === -1 && openedFiles.length !== 0) {
        openingIndex++;
    }
    if (openingIndex < 0) {
        toolBar.isDisabled = true;
        mainContent.rawHtml = rawHtml;
        mainContent.isCenter = true;
    } else {
        mainContent.updateMainContent(openingIndex);
    }
}

