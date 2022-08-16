const LinkedIn = require("./linkedinAPI.js");

const main = async _ => {

    var linkedIn = new LinkedIn();
    await linkedIn.connect();

    //var filters =  { currentCompany: "", pastCompany: "", company: "", geoUrn: "", industry: "", network: "", profileLanguage: "", school: "", connectionOf: "", contactInterest: "", serviceCategory: "", firstName: "", lastName: "", title: ""}
    var ppl = await linkedIn.searchPeople("" ,{firstName: "Rami"}, 20);   //(keywords, filters, limit)

    var matanProfile = await linkedIn.getProfile("Matan Nataf");

    var recivedInvitations = await linkedIn.getRecivedInvitations();  

    var sentInvitations = await linkedIn.getSentInvitations();

    var myProfile = await linkedIn.getMyProfile();

    var invitation = await linkedIn.sendInvitationWithMessage("Bar Shknevsky", "Hi Bar");

    var jobs = await linkedIn.searchJobs("Software Engineer");

    var companies = await linkedIn.searchCompanies("Wiz");

    var connection = await linkedIn.searchMyConnections("sabo taylor diab");

    var conversation = await linkedIn.getConversation("Ran Zaslavsky");

    var msg = await linkedIn.sendMessage("Ran Zaslavsky", "Thanks!")

    var allMesseges = await linkedIn.getAllMesseges()

    console.log(myProfile);
}

main();