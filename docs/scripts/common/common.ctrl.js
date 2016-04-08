"use strict";
(function () {

    app.Common.CommonCtrl = {
        addClass: addClass,
        removeClass: removeClass
        //addItemForm: addItemForm
    };

    //function validateName() {
    //
    //    var nameInput = this;
    //    var btnDisabled = document.querySelector('.button-save');
    //    var parentElement = nameInput.parentElement;
    //    var labelInput = parentElement.querySelector('.label');
    //
    //    if (!nameInput.value) {
    //        addClass.call(parentElement, 'has-error');
    //        labelInput.textContent = "Name is required";
    //        btnDisabled.disabled = true;
    //        return false
    //    }
    //    if (nameInput.value.length < 3) {
    //        addClass.call(parentElement, 'has-error');
    //        labelInput.textContent = "Name is too hort";
    //        btnDisabled.disabled = true;
    //        return false
    //    }
    //    if (nameInput.value.length > 20) {
    //        addClass.call(parentElement, 'has-error');
    //        labelInput.textContent = "Name is too large";
    //        btnDisabled.disabled = true;
    //        return false
    //    }
    //
    //    labelInput.textContent = "Name";
    //    removeClass.call(parentElement, 'has-error');
    //    btnDisabled.disabled = false;
    //    return true
    //}
    //
    //function validateMail() {
    //
    //    var emailInput = this;
    //    var btnDisabled = document.querySelector('.button-save');
    //    var parentElement = emailInput.parentElement;
    //    var labelInput = parentElement.querySelector('.label');
    //
    //    if (!emailInput.value) {
    //        addClass.call(parentElement, 'has-error');
    //        labelInput.textContent = "Email is required";
    //        btnDisabled.disabled = true;
    //        return false
    //    }
    //    if (!(/^\w+@\w+\.\w{2,4}$/).test(emailInput.value)) {
    //        addClass.call(parentElement, 'has-error');
    //        labelInput.textContent = "Incorrect email";
    //        btnDisabled.disabled = true;
    //        return false
    //    }
    //
    //    labelInput.textContent = "Mail";
    //    removeClass.call(parentElement, 'has-error');
    //    btnDisabled.disabled = false;
    //
    //    return true
    //}

    function addClass(){
        this.classList.add('has-error');
    }

    function removeClass(){
        this.classList.remove('has-error');
    }

}());