var Client = require('linkedin-private-api');

var client;
const username = "tal.tamir.1979@gmail.com";
const password = "1979Rooly";

var connect = async _ => {
    client = new Client.Client();
    await client.login.userPass({ username, password });
} 

var sendInvitation = async name => {

    const peopleScroller = client.search.searchPeople({ keywords: name });
    const user = (await peopleScroller.scrollNext())[0];
    const userFullProfile = await client.profile.getProfile({ publicIdentifier: user.profile.publicIdentifier });
    
    await client.invitation.sendInvitation({
        profileId: user.profile.profileId,
        trackingId: user.trackingId,
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

const sentMessage = async (keywords, text) => {
    const peopleScroller = await client.search.searchPeople({
        keywords: keywords
    });
    const [{ profile: user }] = await peopleScroller.scrollNext();

    return await client.message.sendMessage({
        profileId: user.profileId,
        text: text,
    });
}
    

var main = async _ => {
    await connect();

    var myProfile = await getMyProfile();

    var invitation = await sendInvitation("Itamar Avraham");

    var jobs = await searchJobs("Software Engineer");

    var companies = await searchCompanies("Wiz");

    var connection = await searchMyConnections("sabo taylor diab");

    var conversation = await getConversation("Ran Zaslavsky");

    //var msg = await sentMessage("Ran Zaslavsky", "Thanks!")

    console.log(myProfile);
}

main();