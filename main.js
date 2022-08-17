const linkedIn = require("./linkedinAPI.js");
const HubSpot = require("./hubSpotIntegration.js");
const { LinkedInContractInterest } = require("linkedin-private-api");

var msg = " how are you? If you are using AWS RDS Postgres on a large scale today, I would love to connect. Our solution might help to accelerate your performance & lower your costs. Is that relevant? P.S-Are you coming to the AWS summit in Anaheim? If so, I would love to meet."



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

    var people = await linkedIn.searchPeople("", {
        title: "CTO",
        geoUrn: "101620260"
    }, 30);

    //for(person of people) {
        // await linkedIn.sendInvitationWithMessageById(
        //     person.publicIdentifier, 
        //     person.trackingId,
        //     "Hi",
        //     5) //skip

       await linkedIn.sendInvitationWithMessageById(
            people[25].publicIdentifier, 
            people[25].trackingId,
            "Hi " +  people[1].firstName + "," + msg)
    //}
}

findPeopleAndConnect();


//main();