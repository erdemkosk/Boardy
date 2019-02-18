const Store = require('electron-store');
const store = new Store();


exports.addDataToClipboards = function(data){
   
    if(data.length>9){
       
        store.set('clipboard.'+data.trim().substring(0,8), data);
        console.log('clipboard.'+data.trim().substring(0,8) + " kaydedildi");
    }
    else{
        
        store.set('clipboard.'+data.trim(), data);
    }
   
   
};
exports.getAllDataToClipboards = function(){
    
    return store.get('clipboard');
};

exports.deleteAllClipboard = function(){
    store.delete('clipboard');
};
exports.deleteSingleClipboard = function(data){
   
    if(data.length>9){
       
        store.delete('clipboard.'+data.trim().substring(0,8));
        console.log('clipboard.'+data.trim().substring(0,8) + " silidni");
    }
    else{
        store.delete('clipboard.'+data.trim());
    }
    
};