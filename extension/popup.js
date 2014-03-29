var getHistory = function(callback) {
    chrome.storage.sync.get("history", function(data) {
        callback(data.history);
    });
    debugger;
};

var doSearch = function(term, doNotSave) {
    if(!doNotSave) {
        saveTerm(term);
    }

    var destination = "https://search.wdf.sap.corp/ui/#query="+encodeURIComponent(term)+"&startindex=1";

    chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.update(tab.id, {url: destination});
    });

    window.close();
};


var saveTerm = function(term) {

    getHistory(function(data) {
        if(data) {
            data.unshift(term);
        }
        else {
            data = [term];
        }

        chrome.storage.sync.set({ "history": data});
    });
};


var initLogic = function() {
   $("button").click(function() {
       var searchTerm = $('#inputQuery').val();
       doSearch(searchTerm);
   });

    $("#inputQuery").keyup(function(event){
        if(event.keyCode === 13){ //ENTER KEY
            $("button").click();
        }
    });


    getHistory(function(tab) {
        if(tab) {
            for(i=0 ; i<5 && i<tab.length ; ++i) {
                $("#historyList").append("<li class=\"historyItem\">"+tab[i]+"</li>");
            }
        }

        $(".historyItem").click(function(event) {
            doSearch($(event.target).html(), true);
        });
    });


};

document.addEventListener('DOMContentLoaded', function () {
    initLogic();
});
