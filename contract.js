"use strict";
  // functions/postMessage.ts
  var postMessage = async (state, action) => {
    if (!action.input.content?.trim()) {
      throw new ContractError("No content.");
    }
    if (action.input.timestamp > Date.now()) {
      throw new ContractError("Timestamp cannot be in the future.");
    }
    let message = {
      id: state.messages.length || 0,
      timestamp: action.input.timestamp,
      creator: action.caller,
      content: action.input.content,
      votes: {
        dislikes: [],
        likes: []
      },
      comments: []
    };
    if (action.input.image) {
      message.image = action.input.image;
    }
    state.messages.push(message);
    return { state };
  };

  // functions/upVoteMessage.ts
  var upVoteMessage = async (state, action) => {
    if (isNaN(action.input.messageId)) {
      throw new ContractError("No message id.");
    }
    state.messages.forEach((message) => {
      if (message.id == action.input.messageId) {
        if (message.votes.likes.includes(action.caller)) {
          throw new ContractError("Caller has already voted.");
        }
        if (message.votes.dislikes.includes(action.caller)) {
          message.votes.dislikes = message.votes.dislikes.filter((caller) => caller !== action.caller);
        }
        message.votes.likes.push(action.caller);
      }
    });
    return { state };
  };

  // functions/downVoteMessage.ts
  var downVoteMessage = async (state, action) => {
    if (isNaN(action.input.messageId)) {
      throw new ContractError("No message id.");
    }
    state.messages.forEach((message) => {
      if (message.id === action.input.messageId) {
        if (message.votes.dislikes.includes(action.caller)) {
          throw new ContractError("Caller has already voted.");
        }
        if (message.votes.likes.includes(action.caller)) {
          message.votes.likes = message.votes.likes.filter((caller) => caller !== action.caller);
        }
        message.votes.dislikes.push(action.caller);
      }
    });
    return { state };
  };

  // functions/readMessages.ts
  var readMessages = async (state, action) => {
    if (isNaN(action.input.count)) {
      throw new ContractError("Not a number.");
    }
    const messages = state.messages.slice(state.messages.length - action.input.count, action.input.count);
    return { messages };
  };

  // functions/setUserName.ts
  var setUserName = async (state, action) => {
    if (action.input.name.length > 50) {
      throw new ContractError("Name is too long.");
    }
    if (state.nameToAddress[action.input.name] && state.nameToAddress[action.input.name] !== action.caller) {
      throw new ContractError("Name is already taken.");
    }
    state.addressToName[action.caller] = action.input.name;
    state.nameToAddress[action.input.name] = action.caller;
    if (action.input.picture) {
      state.addressToImage[action.caller] = action.input.picture;
    }
    return { state };
  };

  // functions/setProfilePicture.ts
  var setProfilePicture = async (state, action) => {
    state.addressToImage[action.caller] = action.input.picture;
    return { state };
  };

  // app.ts
  async function handle(state, action) {
    switch (action.input.function) {
      case "readMessages":
        return await readMessages(state, action);
      case "postMessage":
        return await postMessage(state, action);
      case "upVoteMessage":
        return await upVoteMessage(state, action);
      case "downVoteMessage":
        return await downVoteMessage(state, action);
      case "setUserName":
        return await setUserName(state, action);
      case "setProfilePicture":
        return await setProfilePicture(state, action);
      default:
        throw new ContractError(`No function supplied or function not recognised: "${action.function}"`);
    }
  }
