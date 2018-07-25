const electron = require('electron');
const Mousetrap = require('mousetrap');
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
            let status = getStatusFromSessionStorage();
            debugger
            if(status){
                let openingIndex = status.pageStatus.openingIndex;
                let file = status.pageStatus.openedFiles[openingIndex];
                this.rawHtml = file.html;
            }
        }
    }
})
contentView.showView();
initExitShortCut();
function getStatusFromSessionStorage() {
    return JSON.parse(sessionStorage.getItem('status'));
}
function initExitShortCut(){
    Mousetrap.bind('esc',()=>{
        currentWindow.setFullScreen(false);
        history.back();
    });

}