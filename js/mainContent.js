const electron = require('electron');
const currentWindow = electron.remote.getCurrentWindow();
const Vue = require('./vue');
const contentView = new Vue({
    el: '#contentView',
    data:{
        rawHtml:''
    },
    methods:{
        showView(){
            currentWindow.setFullScreen(true);
            let file = getFileFromSessionStorage();
            debugger
            this.rawHtml = file.html;
        }
    }
})
contentView.showView();
function getFileFromSessionStorage() {
    return JSON.parse(sessionStorage.getItem('openingFile'));
}