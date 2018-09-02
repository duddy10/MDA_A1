// Data
let contacts = [];
let conversations = [];
let time = new Date();
let recipients = [];
let currentConversation;
contacts.push(new Person(1997, "Theodor"));
let newMessageFlag; // 0 no new message flag, 1 new message flag

function Person(id, name){
    this.id = id;
    this.name = name;
}

function Message(timestamp, person, message){
    this.handleTimestamp = function(timestamp){
        let date = new Date(timestamp);
        return date.toString();
    };
    
    this.decTimestamp = timestamp;
    this.timestamp = this.handleTimestamp(timestamp);
    this.person = person;
    this.message = message;
    this.imgURL;
    
}

function Conversation(convoId, recipients){
    this.convoId = convoId;
    this.messages = [];
    this.recipients = recipients;
}

// init some data
function initConvos(){
    // adds contacts
    contacts.push(new Person(0, "Lars"));
    contacts.push(new Person(1, "Per"));
    contacts.push(new Person(2, "Ole"));
    contacts.push(new Person(3, "Henrik"));
    contacts.push(new Person(4, "Eirik"));
    contacts.push(new Person(5, "Emma"));
    contacts.push(new Person(6, "Cathrine"));
    contacts.push(new Person(7, "Tone"));
    contacts.push(new Person(8, "Kurt"));
    contacts.push(new Person(9, "Mamma"));

    // adds conversations
   conversations.push(new Conversation(0, []));
   conversations.push(new Conversation(1, []));
   conversations.push(new Conversation(2, []));
   conversations.push(new Conversation(3, []));
   conversations.push(new Conversation(4, []));
   conversations.push(new Conversation(5, []));
   conversations.push(new Conversation(6, []));
   conversations.push(new Conversation(7, []));
   
   for(let i = 0; i < conversations.length; i++){
       conversations[i].recipients.push(contacts[i]);
       conversations[i].messages.push(new Message(
           time.getTime(), contacts[i], "Hello this is me"
       ));
   }
   newMessageFlag = 0;
   setHomeScreen();
}

// Enters conversation page with possibility to choose recipients
function onNewMessage(){
    console.log("onNewMessage()");
    cleanConversation();
    toggleVisible("conversations", "conversation", "newMessage");
    newMessageFlag = 1;
}

// adds the recipient
function addRecipient(){
    console.log("addRecipient()");
    let recName = document.getElementById("addRecipient").value;
    document.getElementById("recipients").innerHTML += recName + ", ";
    
    // checks if the person is in contacts and adds them if not
    let found = false;
    for(let i = 0; i < contacts.length; i++){
        if(contacts[i].name === recName){
            conversations[conversations.length-1].recipients.push(contacts[i]);
            recipients.push(contacts[i]);
            found = true;
        } 
    }
    if(!found){
        contacts.push(new Person(contacts.length, recName));
        recipients.push(contacts[contacts.length-1]);
    }
    
}

// toggles visibility for messaging app components
function toggleVisible(/**/){
    for(let i = 0; i < arguments.length; i++){
        console.log("toggleVisibility("+arguments[i]+")");
        const el = document.getElementById(arguments[i]);
        if(el.style.display === "none"){
            el.style.display = "block";
        } else {
            el.style.display = "none";
        }
    }
    
}

// triggers when back is pressed to show the homescreen
function loadHomeScreen(){
    console.log("loadHomeScreen()");
    setHomeScreen();
    if(newMessageFlag === 1){
        newMessageFlag = 0;
        toggleVisible("conversation", "conversations", "newMessage");
    } else {
        toggleVisible("conversation", "conversations");
    }
}

// loads a conversation from homescreen
function loadConversation(conversation){
    console.log("loadConversation()");
    cleanConversation();
    currentConversation = conversation;
    if(newMessageFlag !== 1){
        toggleVisible("conversations", "conversation");
    } 
    
    let recStr = "";
    for(let i = 0; i < conversation.recipients.length; i++){
        recStr += conversation.recipients[i].name + ", ";
    }
    document.getElementById("recipients").innerHTML += recStr;
    
    // creates a list with messages
    for(let i = 0; i < conversation.messages.length; i++){
        addMessageToConversation(conversation.messages[i]);
    }
}

// Loads the homescreen with all conversations
function setHomeScreen(){
    console.log("setHomeScreen()");
    cleanConversations();
    cList = document.getElementById("conversationsList");
    for(let i = 0; i < conversations.length; i++){
        // Creates a li element with a button child
        let liEl = document.createElement("li");
        cList.appendChild(liEl);
        let liBu = document.createElement("button");
        liEl.appendChild(liBu);
        
        // adds information about last conversation to the button element
        let lastM = conversations[i].messages[conversations[i].messages.length - 1];
        liBu.innerHTML = lastM.person.name + ": " + lastM.message + "  [" + lastM.timestamp.toLocaleString() +  "]";
        // adds an onclick event to load the conversation pressed
        liBu.onclick = function(){
            loadConversation(conversations[i]);
        };
    }
}

// removes all children of a parent element by id of parent
function removeElements(idParent){
    console.log("removeElements()");
    let toRemove = document.getElementById(idParent);
    while(toRemove.hasChildNodes()){
        toRemove.removeChild(toRemove.lastChild);
    }
}

// removes all semantics created for conversations
function cleanConversations(){
    console.log("cleanConversations()");
    removeElements("conversationsList");
}

// removes all semantics created for conversation
function cleanConversation(){
    console.log("cleanConversation()");
    currentConversation = null;
    removeElements("messagesList");
    document.getElementById("recipients").innerHTML = "Recipients: ";
}

function sendMessage(){
    console.log("sendMessage()");
    if(newMessageFlag === 1){
        toggleVisible("newMessage");
        let convo = checkIfConversationExist();
        if(convo){
            currentConversation = convo;
            loadConversation(convo);
        } else {
            conversations.push(new Conversation(conversations.length, []));
            currentConversation = conversations[conversations.length-1];
            for(let i = 0; i < recipients.length; i++){
                conversations[conversations.length-1].recipients.push(recipients[i]);
            }  
        }
        recipients = [];
        newMessageFlag = 0;
    }
    
    let message = document.getElementById("sendMessage").value;
    
    currentConversation.messages.push(new Message(time.getTime(), contacts[0], message));
    
    if(document.getElementById("imageUpload").files[0]){
        let src = window.URL.createObjectURL(document.getElementById("imageUpload").files[0]);
        currentConversation.messages[currentConversation.messages.length-1].imgURL = src;
        removeElements("imagePrev");
    }
    
    addMessageToConversation(currentConversation.messages[currentConversation.messages.length-1]);
    
    sortConversations(currentConversation);
}

function sortConversations(currentConvo){
    conversations = conversations.reverse();
    let ix = conversations.indexOf(currentConvo);
    conversations.splice(ix, 1);
    conversations.push(currentConvo);
    conversations = conversations.reverse();
}

function checkIfConversationExist(){
    recipients = recipients.sort();
    console.log("checkIfConversationExist()");
    for(let i = 0; i < conversations.length; i++){
        let crep = conversations[i].recipients.sort();
        let counter = 0;
        if(crep.length === recipients.length){
            for(let j = 0; j < crep.length; j++){
                if(crep[j]===recipients[j]){
                    counter++;
                }
            }
            if(counter === recipients.length){
                return conversations[i];
            }
        }
        
    }
    return null;
}

function addMessageToConversation(currentMessage){
    console.log("addMessageToConversation()");
    let mList = document.getElementById("messagesList");
    let liEl = document.createElement("li");
    mList.appendChild(liEl);
    liEl.innerHTML = currentMessage.person.name + ": " + currentMessage.message + "  [" + currentMessage.timestamp.toLocaleString() +  "]";
    if(currentMessage.imgURL){
            let img = document.createElement("img");
            img.src = currentMessage.imgURL;
            img.height = 60;
            img.class = "imgMessage";
            liEl.appendChild(img);
    }
}

function displayPreviewImage(){
    console.log("displayPreviewImage()");
    let image = document.getElementById("imageUpload").files[0];
    let divImgPrv = document.getElementById("imagePrev");
    let img = document.createElement("img");
    img.src = window.URL.createObjectURL(image);
    img.height = 60;
    img.onload = () => (window.URL.revokeObjectURL(this.src));
    divImgPrv.appendChild(img);
}

