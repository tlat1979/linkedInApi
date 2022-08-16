var Client = require('linkedin-private-api');
var fs = require('fs');
var nconf = require('nconf');
var client;

class LinkedIn {

    connect = async _ => {

        nconf.file({ file: './config.json' });

        const username = nconf.get('username');
        const password = nconf.get('password');

        client = new Client.Client();
        await client.login.userPass({ username, password });
    } 

    searchPeople = async (keywords = "", filters = {}, limit = 10) => {
        //var filters =  { currentCompany: "", pastCompany: "", company: "", geoUrn: "", industry: "", network: "", profileLanguage: "", school: "", connectionOf: "", contactInterest: "", serviceCategory: "", firstName: "", lastName: "", title: ""}
        const peopleScroller = client.search.searchPeople({ 
            keywords: keywords,
            filters: filters,
            limit: limit
        });
    
        var users = [];
        var i = 0;
        while (!peopleScroller.hitEndOfResults) {
            try {
                const user = (await peopleScroller.scrollNext())[i];
                if (!user) break;
                if (client && client.profile && user && user.profile) {
                    console.log(user.profile.firstName + " " + user.profile.lastName);
                    const userFullProfile = await client.profile.getProfile({ publicIdentifier: user.profile.publicIdentifier });
                    users.push(userFullProfile);
                } else continue;
            } catch(e) {console.error(e)}
            i++;
        }
        return users;
    }

    sendInvitationWithMessage = async (name, message = "") => {

        const peopleScroller = client.search.searchPeople({ keywords: name });
        const user = (await peopleScroller.scrollNext())[0];
        const userFullProfile = await client.profile.getProfile({ publicIdentifier: user.profile.publicIdentifier });
        
        await client.invitation.sendInvitation({
            profileId: user.profile.profileId,
            trackingId: user.trackingId,
            message: message
        });
    }

    getMyProfile = async _ => await client.profile.getOwnProfile();

    searchJobs = async (keywords, location = "Israel", limit = 20, skip = 0) => {
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

    searchCompanies = async companyName => {
        const companiesScroller = await client.search.searchCompanies({ keywords: companyName });
        const [{ company: company }] = await companiesScroller.scrollNext();
        return company;
    }

    searchMyConnections = async (keywords, limit = 1) => {
        const ownConnectionsScroller = await client.search.searchOwnConnections({ keywords: keywords, limit: limit });
        return ownConnectionsScroller.scrollNext();  
    }

    getConversation = async keywords => {
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

    getAllMesseges = async _ => {
        const conversationScroller = client.conversation.getConversations();
        const conversations = await conversationScroller.scrollNext();
        var msgs = [];

        for (let i = 0; i < conversations.length; i++) {
            var messagesScroller = client.message.getMessages({ conversationId: conversations[i].conversationId });
            msgs.push(await messagesScroller.scrollNext());
        }

        return msgs;
    }

    sendMessage = async (keywords, text) => {
        const peopleScroller = await client.search.searchPeople({
            keywords: keywords
        });
        const [{ profile: user }] = await peopleScroller.scrollNext();

        return await client.message.sendMessage({
            profileId: user.profileId,
            text: text,
        });
    }

    getSentInvitations = async _ => {
        const sentScroller = client.invitation.getSentInvitations();
        return await sentScroller.scrollNext();
    }

    getRecivedInvitations = async _ => {
        const receivedScroller = client.invitation.getReceivedInvitations();
        return await receivedScroller.scrollNext();
    }

    getProfile = async keywords => {
        const peopleScroller = await client.search.searchPeople({
            keywords: keywords,
        });
        const [{ profile: profile }] = await peopleScroller.scrollNext();
        const fullProfile = await client.profile.getProfile({ publicIdentifier: profile.publicIdentifier });
        return fullProfile;
    }
}

module.exports = LinkedIn