
require('./materialize.min');
const Vue = require('./vue');
const dialog = require('electron').remote.dialog;
const fileSystem = require('fs');
let openingFileName;
const openedFiles = new Array();
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
        }
    }
});
let mainContent = new Vue({
    el: '#mainContent',
    data: {
        rawHtml: '<span>fuck</span>'
    },
    methods: {
        addMainContent: function (fileName, formatHtml) {
            openedFiles.push({ name: fileName, html: formatHtml });
            this.rawHtml = formatHtml;
        },
        updateMainContent: function (index) {
            let openedFile = openedFiles[index];
            if (openedFile) {
                this.rawHtml = openedFile.html;
            }
        }
    }
})

/*
 * 打开Markdown文件
 */
function openMarkdown() {
    dialog.showOpenDialog({ properties: ['openFile'] }, (filePaths) => {
        openingFileName = tranferPathToName(filePaths[0]);
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

