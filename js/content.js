const electron = require('electron');
const Mousetrap = require('mousetrap');
const currentWindow = electron.remote.getCurrentWindow();
const Vue = require('./vue');

const contentView = new Vue({
    el: '#content',
    data:{
        rawHtml:''
    },
    methods:{
        showContent(){
            currentWindow.setFullScreen(true);
            let status = getStatusFromSessionStorage();
            if(status){
                let openingIndex = status.pageStatus.openingIndex;
                let file = status.pageStatus.openedFiles[openingIndex];
                this.rawHtml = file.html;
            }
        }
    }
});

init();

function getStatusFromSessionStorage() {
    return JSON.parse(sessionStorage.getItem('status'));
}
function init(){
    Mousetrap.bind('esc',()=>{
        currentWindow.setFullScreen(false);
        history.back();
    });
    contentView.showContent();
}