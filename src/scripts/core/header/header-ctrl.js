"use strict";
(function () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/app/scripts/core/header/header-tpl.html', true);

    xhr.onreadystatechange = function () {

        if (xhr.readyState != 4) return;
        if (this.status === 200) {
            document.getElementById('header').innerHTML = this.responseText;
            var userLink = document.querySelector(".users-link");

            var companyLink = document.querySelector(".companies-link");

            userLink.addEventListener("click", app.Users.UsersCtrl.renderUsers);
            companyLink.addEventListener("click", app.Companies.CompaniesCtrl.renderCompanies);
        }
    };
    xhr.send();

}());