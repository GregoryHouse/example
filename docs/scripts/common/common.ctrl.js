"use strict";
(function () {

    app.Common.CommonCtrl = {
        addClass: addClass,
        removeClass: removeClass
    };

    function addClass(){
        this.classList.add('has-error');
    }

    function removeClass(){
        this.classList.remove('has-error');
    }

}());