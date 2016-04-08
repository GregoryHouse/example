"use strict";
(function () {
    var userLink = document.querySelector(".users-link");

    var companyLink = document.querySelector(".companies-link");

    userLink.addEventListener("click", app.Users.UsersCtrl.renderUsers);
    companyLink.addEventListener("click", app.Companies.CompaniesCtrl.renderCompanies);

}());