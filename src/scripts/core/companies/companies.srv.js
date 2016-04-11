"use strict";
(function () {

    app.Companies.CompaniesSrv= {
        getAllCompanies: getAllCompanies,
        deleteCompany: deleteCompany,
        saveCompany: saveCompany
    };

    var companies = [
        {companyName: "Samsung", addressCompany: "Seocho-daero", companyMail: "samsung@mail.com", id: createId()},
        {companyName: "Lenovo", addressCompany: "Apachi", companyMail: "lenovo@mail.com", id: createId()},
        {companyName: "Apple", addressCompany: "Cupertino", companyMail: "apple@mail.com", id: createId()}
    ];

    function getAllCompanies (callback) {
        if (callback) {
            callback(companies)
        }
        return companies;
    }

    function deleteCompany (companyId, callback) {

        var removeCompany = companyId;

        for (var i = 0; i < companies.length; i++) {
            if (companyId === companies[i].id)
                companies.splice(i, 1);
        }
        if (callback) {
            callback(removeCompany);
        }

        return removeCompany;
    }

    function saveCompany (companyDTO, callback) {

        var editCompany = companyDTO;

        if (editCompany.id !== undefined) {
            for (var i = 0; i < companies.length; i++) {
                if (editCompany.id === companies[i].id)
                    companies.splice(i, 1, editCompany)
            }
        } else {
            editCompany.id = createId();
            companies.push(editCompany);
        }

        if (callback) {
            callback(editCompany);
        }

        return editCompany;
    }

    function createId() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

}());




