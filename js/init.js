
require('./materialize.min');
const Vue = require('./vue');
const dialog = require('electron').remote.dialog;
const fileSystem = require('fs');
let openingFileName;
let sideNav = M.Sidenav.init(document.querySelector('.sidenav'));
let collapSible = M.Collapsible.init(document.querySelectorAll('.collapsible'));
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
        files: []
    },
    methods: {
        addFile(fileName) {
            this.files.push({ name: fileName });
        }
    }
});
let mainContent = new Vue({
    el: '#mainContent',
    data: {
        rawHtml: '<span>fuck</span>'
    },
    methods: {
        updataMainContent: function (formatHtml) {
            this.rawHtml = formatHtml;
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
        mainContent.updataMainContent(mdHtml);
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
