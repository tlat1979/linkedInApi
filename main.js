var Client = require('linkedin-private-api');
var fs = require('fs');
var nconf = require('nconf');
var client;

var connect = async _ => {

    nconf.file({ file: './config.json' });

    const username = nconf.get('username');
    const password = nconf.get('password');

    client = new Client.Client();
    await client.login.userPass({ username, password });
} 

var sendInvitationWithMessage = async (name, message = "") => {

    const peopleScroller = client.search.searchPeople({ keywords: name });
    const user = (await peopleScroller.scrollNext())[0];
    const userFullProfile = await client.profile.getProfile({ publicIdentifier: user.profile.publicIdentifier });
    
    await client.invitation.sendInvitation({
        profileId: user.profile.profileId,
        trackingId: user.trackingId,
        message: message
    });
}

var getMyProfile = async _ => await client.profile.getOwnProfile();

var searchJobs = async (keywords, location = "Israel", limit = 20, skip = 0) => {
    const jobsScroller = await client.search.searchJobs({
        keywords: keywords,
        filters: { location: location },
        limit: limit,
        skip: skip,
    });
    
    const [jobHit] = await jobsScroller.scrollNext();
    const jobHitCompanyHit = jobHit.hitInfo.jobPosting.companyDetails.company.name;
    
    return jobHit;
}

var searchCompanies = async companyName => {
    const companiesScroller = await client.search.searchCompanies({ keywords: companyName });
    const [{ company: company }] = await companiesScroller.scrollNext();
    return company;
}

var searchMyConnections = async (keywords, limit = 1) => {
    const ownConnectionsScroller = await client.search.searchOwnConnections({ keywords: keywords, limit: limit });
    return ownConnectionsScroller.scrollNext();  
}

var getConversation = async keywords => {
    const peopleScroller = await client.search.searchPeople({
        keywords: keywords
    });
    const [{ profile: user }] = await peopleScroller.scrollNext();

    const [userCoversation] = await client.conversation.getConversations({
        recipients: user.profileId
      }).scrollNext();
     
    const conversationMessages = await client.message.getMessages({
        conversationId: userCoversation.conversationId
    }).scrollNext()

      return conversationMessages;
}

var getAllMesseges = async _ => {
    const conversationScroller = client.conversation.getConversations();
    const conversations = await conversationScroller.scrollNext();
    var msgs = [];

    for (i = 0; i < conversations.length; i++) {
        var messagesScroller = client.message.getMessages({ conversationId: conversations[i].conversationId });
        msgs.push(await messagesScroller.scrollNext());
    }

    return msgs;
}

const sendMessage = async (keywords, text) => {
    const peopleScroller = await client.search.searchPeople({
        keywords: keywords
    });
    const [{ profile: user }] = await peopleScroller.scrollNext();

    return await client.message.sendMessage({
        profileId: user.profileId,
        text: text,
    });
}

var getSentInvitations = async _ => {
    const sentScroller = client.invitation.getSentInvitations();
    return await sentScroller.scrollNext();
}

var getRecivedInvitations = async _ => {
    const receivedScroller = client.invitation.getReceivedInvitations();
    return await receivedScroller.scrollNext();
}

var getProfile = async keywords => {
    const peopleScroller = await client.search.searchPeople({
        keywords: keywords,
    });
    const [{ profile: profile }] = await peopleScroller.scrollNext();
    const fullProfile = await client.profile.getProfile({ publicIdentifier: profile.publicIdentifier });
    return fullProfile;
}
    

var main = async _ => {
    await connect();

    var matanPrifile = await getProfile("Matan Nataf");

    var recivedInvitations = await getRecivedInvitations();  

    var sentInvitatiosn = await getSentInvitations();

    var myProfile = await getMyProfile();

    var invitation = await sendInvitationWithMessage("Bar Shknevsky", "Hi Bar");

    var jobs = await searchJobs("Software Engineer");

    var companies = await searchCompanies("Wiz");

    var connection = await searchMyConnections("sabo taylor diab");

    var conversation = await getConversation("Ran Zaslavsky");

    var msg = await sendMessage("Ran Zaslavsky", "Thanks!")

    var allMesseges = await getAllMesseges()

    console.log(myProfile);
}

main();