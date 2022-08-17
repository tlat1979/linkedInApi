var Client = require('linkedin-private-api');
var fs = require('fs');
var nconf = require('nconf');
var client;

    const connectLinkedIn = async _ => {

        nconf.file({ file: './config.json' });

        const username = nconf.get('username');
        const password = nconf.get('password');

        client = new Client.Client();
        await client.login.userPass({ username, password });
        var a = 5;
    } 

    const searchPeople = async (keywords = "", filters = {}, limit = 10) => {
        
        var searchFilters =  {};
        searchFilters["currentCompany"] =   filters["currentCompany"] ? filters["currentCompany"] : "";
        searchFilters["pastCompany"] =      filters["pastCompany"] ? filters["pastCompany"] : "";
        searchFilters["company"] =          filters["company"] ? filters["company"] : "";
        searchFilters["geoUrn"] =           filters["geoUrn"] ? filters["geoUrn"] : "";
        searchFilters["industry"] =         filters["industry"] ? filters["industry"] : "";
        searchFilters["network"] =          filters["network"] ? filters["network"] : "";
        searchFilters["profileLanguage"] =  filters["profileLanguage"] ? filters["profileLanguage"] : "";
        searchFilters["school"] =           filters["school"] ? filters["school"] : "";
        searchFilters["contactInterest"] =  filters["contactInterest"] ? filters["contactInterest"] : "";
        searchFilters["serviceCategory"] =  filters["serviceCategory"] ? filters["serviceCategory"] : "";
        searchFilters["firstName"] =        filters["firstName"] ? filters["firstName"] : "";
        searchFilters["lastName"] =         filters["lastName"] ? filters["lastName"] : "";
        searchFilters["title"] =            filters["title"] ? filters["title"] : "";
             
        const peopleScroller = client.search.searchPeople({ 
            keywords: keywords,
            filters: searchFilters,
            limit: limit
        });
    
        var users = [];
        var i = 0;
        while (!peopleScroller.hitEndOfResults) {
            try {
                const user = (await peopleScroller.scrollNext())[i];
                if (!user) break;
                if (client && client.profile && user && user.profile) {
                    //console.log(user.profile.firstName + " " + user.profile.lastName);
                    const userFullProfile = await client.profile.getProfile({ publicIdentifier: user.profile.publicIdentifier });
                    users.push(userFullProfile);
                } else continue;
            } catch(e) {console.error(e)}
            i++;
        }
        return users;
    }

    const sendInvitationWithMessage = async (name, message = "") => {

        const peopleScroller = client.search.searchPeople({ keywords: name });
        const user = (await peopleScroller.scrollNext())[0];
        const userFullProfile = await client.profile.getProfile({ publicIdentifier: user.profile.publicIdentifier });
        
        await client.invitation.sendInvitation({
            profileId: user.profile.profileId,
            trackingId: user.trackingId,
            message: message
        }); 
    }

    const sendInvitationWithMessageById = async (profileId, trackingId, message, skip = 0) => {
        
        await client.invitation.sendInvitation({
            profileId: profileId,
            trackingId: trackingId,
            message: message,
            skip: skip
        });
    }
    

    const getMyProfile = async _ => await client.profile.getOwnProfile();

    const searchJobs = async (keywords, location = "Israel", limit = 20, skip = 0) => {
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

    const searchCompanies = async companyName => {
        const companiesScroller = await client.search.searchCompanies({ keywords: companyName });
       return await companiesScroller.scrollNext();
    }

    const searchMyConnections = async (keywords, limit = 1) => {
        const ownConnectionsScroller = await client.search.searchOwnConnections({ keywords: keywords, limit: limit });
        return ownConnectionsScroller.scrollNext();  
    }

    const getConversation = async keywords => {
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

    const getAllMesseges = async _ => {
        const conversationScroller = client.conversation.getConversations();
        const conversations = await conversationScroller.scrollNext();
        var msgs = [];

        for (let i = 0; i < conversations.length; i++) {
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

    const getSentInvitations = async _ => {
        const sentScroller = client.invitation.getSentInvitations();
        return await sentScroller.scrollNext();
    }

    const getRecivedInvitations = async _ => {
        const receivedScroller = client.invitation.getReceivedInvitations();
        return await receivedScroller.scrollNext();
    }

    const getProfile = async keywords => {
        const peopleScroller = await client.search.searchPeople({
            keywords: keywords,
        });
        const [{ profile: profile }] = await peopleScroller.scrollNext();
        const fullProfile = await client.profile.getProfile({ publicIdentifier: profile.publicIdentifier });
        return fullProfile;
    }

module.exports = {
    connectLinkedIn: connectLinkedIn,
    searchPeople: searchPeople,
    sendInvitationWithMessage: sendInvitationWithMessage,
    getMyProfile: getMyProfile,
    searchJobs: searchJobs,
    searchCompanies: searchCompanies,
    searchMyConnections: searchMyConnections,
    getConversation: getConversation,
    getAllMesseges: getAllMesseges,
    sendMessage: sendMessage,
    getSentInvitations: getSentInvitations,
    getRecivedInvitations: getRecivedInvitations,
    getProfile: getProfile,
    sendInvitationWithMessageById: sendInvitationWithMessageById,
}