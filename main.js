const linkedIn = require("./linkedinAPI.js");
const HubSpot = require("./hubSpotIntegration.js");



const main = async _ => {

    await linkedIn.connectLinkedIn();
    const hubSpot = new HubSpot();

    var wizLinkedIn = await linkedIn.searchCompanies("Wiz");
    var wizHubSpot = await hubSpot.createCompany({
        name: wizLinkedIn[0].company.name, 
        description: wizLinkedIn[0].company.universalName
    })
}

const findPeopleAndConnect = async _ => {
    await linkedIn.connectLinkedIn();
    const hubSpot = new HubSpot();

    var ppl = await linkedIn.searchPeople("", {
        title: "CTO",
        geoUrn: "101620260"
    }, 10);

    var a = 5;
}

findPeopleAndConnect();


//main();