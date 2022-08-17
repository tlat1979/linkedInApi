const linkedIn = require("./linkedinAPI.js");
//linkedIn = new LinkedIn();

//class LinkedInAPI {

    const connect = async _ => await linkedIn.connectLinkedIn();

    //var filters =  { currentCompany: "", pastCompany: "", company: "", geoUrn: "", industry: "", network: "", profileLanguage: "", school: "", connectionOf: "", contactInterest: "", serviceCategory: "", firstName: "", lastName: "", title: ""}
    const searchPeople = async (keywords, filters, limit) => await linkedIn.searchPeople(keywords ,filters, limit);   //(keywords, filters, limit)

    const getProfile = async filters => await linkedIn.getProfile(keywords = "", filters = {}, limit = 10);

    const getRecivedInvitations = async _ => await linkedIn.getRecivedInvitations();  

    const sentInvitations = async _ => await linkedIn.getSentInvitations();

    const getMyProfile = async _ => await linkedIn.getMyProfile();

    const sendInvitationWithMessage = async (name, text) => await linkedIn.sendInvitationWithMessage(name, text);

    const searchJobs = async job => await linkedIn.searchJobs(job);

    const searchForCompanies = async company => await linkedIn.searchCompanies(company);

    const searchMyConnections = async connection => await linkedIn.searchMyConnections(connection);

    const getConversation = async contactConversationName => await linkedIn.getConversation(contactConversationName);

    const sendMessage = async (contactName, text) => await linkedIn.sendMessage(contactName, text)

    const getAllMesseges = async _ => await linkedIn.getAllMesseges()

module.exports = {
    connect: connect,
    searchPeople: searchPeople,
    getProfile: getProfile,
    getRecivedInvitations: getRecivedInvitations,
    sentInvitations: sentInvitations,
    getMyProfile: getMyProfile,
    sendInvitationWithMessage: sendInvitationWithMessage,
    searchJobs: searchJobs,
    searchForCompanies: searchForCompanies,
    searchMyConnections: searchMyConnections,
    getConversation: getConversation,
    sendMessage: sendMessage,
    getAllMesseges: getAllMesseges
}

// const main = async _ => {
//     var linkedInAPI = new LinkedInAPI();
//     await linkedInAPI.connect();

//     var company = await linkedIn.searchCompanies("Wiz");
//     var a = 5;

// }

// main();

//module.exports = LinkedInAPI