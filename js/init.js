
require('./materialize.min');
const Vue = require('./vue');
const dialog = require('electron').remote.dialog;
const remote = require('electron');
const fileSystem = require('fs');
let openingIndex=-1;
let openedFiles = new Array();
let sideNav = M.Sidenav.init(document.querySelector('.sidenav'));
let collapSible = M.Collapsible.init(document.querySelector('.collapsible'));
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
        removeFile(fileName) {

        },
        click(file, index) {
            if (this.activeIndex >= 0 && this.activeIndex !== index) {
                this.files[this.activeIndex].isActive = false;
                file.isActive = true;
                this.activeIndex = index;
                mainContent.updateMainContent(index);
            }
        },
        revert(fileListStatus){
            fileListStatus.files.forEach(element => {
                this.files.push(element);
            });
            activeIndex = fileListStatus.activeIndex;
            collapSible.open();
        }
    }
});
let mainContent = new Vue({
    el: '#mainContent',
    data: {
        rawHtml: '<span></span>'
    },
    methods: {
        addMainContent: function (fileName, formatHtml) {
            openedFiles.push({ name: fileName, html: formatHtml });
            openingIndex = openedFiles.length - 1;
            this.rawHtml = formatHtml;
            saveStatusToSessionStorage();
        },
        updateMainContent: function (index) {
            openingIndex = index;
            let openedFile = openedFiles[index];
            if (openedFile) {
                this.rawHtml = openedFile.html;
                saveStatusToSessionStorage();
            }
        }
    }
});
revertFromStatus();

/*
 * 打开Markdown文件
 */
function openMarkdown() {
    dialog.showOpenDialog({ properties: ['openFile'] }, (filePaths) => {
        let openingFileName = tranferPathToName(filePaths[0]);
        let originMd = fileSystem.readFileSync(filePaths[0].toString()).toString();
        let mdHtml = tranferMDToHtml(originMd);
        fileList.addFile(openingFileName);

        mainContent.addMainContent(openingFileName, mdHtml);
    });
}

/*
 * 根据路径获取文件名称
 */
function tranferPathToName(filePath) {
    const path = require('path');
    return path.basename(filePath);
}

/*
 * 
 */
function tranferMDToHtml(mdContent) {
    const showdown = require('showdown');
    const convertor = new showdown.Converter();
    return convertor.makeHtml(mdContent);
}

function saveStatusToSessionStorage(){
    let status = {
        fileListStatus:{
            files:fileList.files,
            activeIndex:fileList.activeIndex
        },
        pageStatus:{
            openingIndex:openingIndex,
            openedFiles:openedFiles
        }
    };
    sessionStorage.setItem('status',JSON.stringify(status));
}

function revertFromStatus(){
    let statusJson = sessionStorage.getItem('status');
    if(statusJson){
        let status = JSON.parse(statusJson);
        debugger
        fileList.revert(status.fileListStatus);
        openingIndex = status.pageStatus.openingIndex;
        openedFiles = status.pageStatus.openedFiles;
        mainContent.updateMainContent(openingIndex);
    }
}

