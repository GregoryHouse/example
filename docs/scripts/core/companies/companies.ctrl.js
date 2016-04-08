"use strict";
(function () {

    var Routing = app.Routing;
    var CompanyService = app.Companies.CompaniesSrv;
    var CommonControl = app.Common.CommonCtrl;

    var companies = CompanyService.getAllCompanies();

    companies.sort(function (a, b) {
        if (a.companyName > b.companyName) {
            return 1;
        }
        if (a.companyName < b.companyName) {
            return -1;
        }
        return 0;
    });


    app.Companies.CompaniesCtrl = {
        renderCompany: renderCompany,
        renderCompanies: renderCompanies,
        openCompanyForm: openCompanyForm,
        saveCompany: saveCompany,
        deleteCompany: deleteCompany,
        closeForm: closeForm
    };

    function renderCompany(company, isCreate, companiesList) {

        if (!companiesList) {
            var companiesList = document.querySelector('.companies-list');
        }
        if (!isCreate) {
            var oldCompanyElement = document.querySelector('[data-company-id=\'' + company.id + '\']');
        }
        var companyElement = function() {
            var clone = document.querySelector('.company-content');
            var companyLi = clone.cloneNode(true);
            companyLi.setAttribute('data-company-id', company.id);
            companyLi.classList.remove('hide');

            companyLi.querySelector('.name-field').textContent = company.companyName;
            companyLi.querySelector('.address-field').textContent = company.addressCompany;
            companyLi.querySelector('.email-field').textContent = company.companyMail;

            var editButton = companyLi.querySelector(".button-edit");
            var deleteButton = companyLi.querySelector(".button-delete");

            editButton.addEventListener("click", app.Companies.CompaniesCtrl.openCompanyForm.bind(company));
            deleteButton.addEventListener("click", app.Companies.CompaniesCtrl.deleteCompany.bind(company));


            return companyLi;
        };

        if (isCreate) {
            companiesList.appendChild(companyElement());
        } else {
            companiesList.replaceChild(companyElement(), oldCompanyElement);
        }
    }

    function renderCompanies() {


        //
        //document.querySelector('.companies-link').style.textDecoration = 'underline';
        //document.querySelector('.users-link').style.textDecoration = 'none';
        if (companies.length === 0) {
            return
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/app/scripts/core/companies/companies.tpl.html', true);

        xhr.onreadystatechange = function () {

            if (xhr.readyState != 4) return;
            if (this.status === 200) {

                document.getElementById('container').innerHTML = this.responseText;
                var companyForm = document.querySelector('.add-company');
                companyForm.setAttribute('data-company-id', 'undefined');

                var addButton = companyForm.querySelector(".button-add");
                addButton.addEventListener("click", openCompanyForm);

                var companiesList = document.querySelector('.companies-list');

                for (var i = 0; i < companies.length; i++) {
                    renderCompany(companies[i], true, companiesList);
                }

            }
        };
        xhr.send();
    }

    function openCompanyForm() {

        var company = this;

        if (!company.id) {
            company = {companyName: "", addressCompany: "", companyMail: ""};
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/app/scripts/core/companies/company.form.tpl.html', false);

        var companyForma = document.createElement('div');
        companyForma.className = " edit-company-form";
        companyForma.setAttribute('data-edit-company-form', company.id);

        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;
            if (this.status === 200) {
                companyForma.innerHTML = this.responseText;
            }
        };

        xhr.send();

        var userElement = document.querySelector('[data-company-id=\'' + company.id + '\']');
        userElement.className =  company.id ? 'edit-company' : 'new-company';
        userElement.appendChild(companyForma);
        form(company);
    }

    function saveCompany(company) {

        var company = this;

        var form = document.querySelector('[data-edit-company-form=\'' + company.id + '\']').firstChild;
        var isValidName = CommonControl.validateName.call(form.companyName);
        var isValidEmail = CommonControl.validateMail.call(form.companyMail);

        if (isValidName && isValidEmail) {

            var companyDTO = {
                id: company.id ? company.id : undefined,
                companyName: form.companyName.value,
                addressCompany: form.addressCompany.value,
                companyMail: form.companyMail.value
            };

            CompanyService.saveCompany(companyDTO, function (editCompany) {
                closeForm(company);
                renderCompany(editCompany, !company.id);
            });
        }
    }

    function deleteCompany() {

        var companiesList = document.querySelector('.companies-list');
        CompanyService.deleteCompany(this.id, function (removeCompany) {
            var oldCompanyElement = document.querySelector('[data-company-id=\'' + removeCompany + '\']');
            companiesList.removeChild(oldCompanyElement);
        });
    }

    function closeForm(company) {
        if (company === event) {
            var company = this;
        }

        var companyElement = document.querySelector('[data-company-id=\'' + company.id + '\']');
        companyElement.removeChild(companyElement.lastChild);
        companyElement.className =  company.id ?  'company-content' :'add-company';
    }

    function form(company) {

        var companyForm = document.querySelector('[data-edit-company-form=\'' + company.id + '\']');
        var inputName = companyForm.querySelector('[data-input-name=input-company-name]');
        var inputSurname = companyForm.querySelector('[data-input-address=input-company-address]');
        var inputMail = companyForm.querySelector('[data-input-mail=input-company-mail]');

        inputName.value = company.companyName;
        inputSurname.value = company.addressCompany;
        inputMail.value = company.companyMail;

        var saveButton = companyForm.querySelector(".button-save");
        var closeButton = companyForm.querySelector(".button-close");

        saveButton.addEventListener("click", app.Companies.CompaniesCtrl.saveCompany.bind(company));
        closeButton.addEventListener("click", app.Companies.CompaniesCtrl.closeForm.bind(company));
        inputName.addEventListener("input", app.Common.CommonCtrl.validateName.bind(inputName));
        inputMail.addEventListener("input", app.Common.CommonCtrl.validateMail.bind(inputMail));

    }

}());