const Hubspot = require('hubspot');
const API_KEY = "pat-na1-e8caaa69-7a9c-4ce5-946d-2e4fa8b80d23";
var hubspot; 

class HubSpotAPI {

    constructor() {
        hubspot = new Hubspot({ accessToken: API_KEY });
    }

    createContact = async (firstName, lastName) => {
        var contactObj = {
            "properties": [
            { "property": "firstname","value": firstName },
            { "property": "lastname", "value": lastName }
            ]
        };
        
        var hubspotContact = await hubspot.contacts.create(contactObj);
        var a = 5;
    }
}

const main = async _ => {
    var hubSpotAPI = new HubSpotAPI();
    var contact = hubSpotAPI.createContact("Ran", "Zamir");
    var g = 6;
}


main();
