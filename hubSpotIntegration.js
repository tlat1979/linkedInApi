const Hubspot = require('hubspot');
const API_KEY = "pat-na1-e8caaa69-7a9c-4ce5-946d-2e4fa8b80d23";
var hubspot; 

class HubSpotAPI {

    constructor() {
        hubspot = new Hubspot({ accessToken: API_KEY });
    }

    // email, firstname, lastname, website, company, phone, address, city, state, zip
        createContact = async (data = {}) => {        
        var contactObj = {
            "properties": [
                { "property": "email", "value": data["email"] ? data["email"] : "" },
                { "property": "firstName", "value": data["firstName"] ? data["firstName"] : "" },
                { "property": "lastName", "value": data["lastName"] ? data["lastName"] : "" },
                { "property": "company", "value": data["company"] ? data["company"] : "" },
                { "property": "phone", "value": data["phone"] ? data["phone"] : "" },
            ]
        };
        if (data == {}) return false;
        return await hubspot.contacts.create(contactObj);
    }

    createCompany = async (data = {}) => {
        var companyObj = {
            "properties": [
                { "name": "name",           "value": data["name"] ? data["name"] : "" },
                { "name": "description",    "value": data["description"] ? data["description"] : "" },
            ]
        };
        if (data == {}) return false;
        return await hubspot.companies.create(companyObj);
    }
}

module.exports = HubSpotAPI


// const main = async _ => {
//     var hubSpotAPI = new HubSpotAPI();
//     var contactData = {
//         firstName: "Rannnnnnnn",
//         lastName: "Zamirrrrrrrrr",
//         email: "rannnnn@zamirr.com",
//         company: "Zamirr LTD",
//         phone: "0546688777"
//     }
//     //var contact = await hubSpotAPI.createContact(contactData);
//     var g = 6;

//     var companyData = {
//         name: "XXXXXX Company",
//         description: "Fly to sapce and back",
//     }
//     var company = await hubSpotAPI.createCompany(companyData);
//     var d = 5;
// }