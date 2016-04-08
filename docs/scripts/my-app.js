"use strict";

var app;

(function () {
    app = {
        Users: {},
        Companies: {},
        Common: {}
        //Routing:{
        //    currentUrl: '/users',
        //    setUrl: function(url){
        //        if(url !== this.currentUrl){
        //            this.currentUrl = url
        //        }
        //    },
        //    getUrl: function(){
        //        return this.currentUrl
        //    }
        //}
    };


        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/app/scripts/core/header/header-tpl.html', true);

        xhr.onreadystatechange = function () {

            if (xhr.readyState != 4) return;
            if (this.status === 200) {
                document.getElementById('header').innerHTML = this.responseText;
            }
        };
        xhr.send();
}());