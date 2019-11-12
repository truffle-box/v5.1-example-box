const Decoder = require("@truffle/decoder");

module.exports = {
  forGuestbook: async (instance, library) => {
    const decoder = await Decoder.forContractInstance(instance, [library]);

    return {
      readSignGuestbookEvent: async (log) => {
        const results = await decoder.decodeLog(log);

        // log decoding may be ambiguous; here just grab the first result
        const result = results[0];

        return readMessage(result.arguments[0].value)
      },

      readGuestbookStorage: async (guestbookAddress) => {
        // make sure we get `guestbook.forAddress[guestbookAddress]`
        await decoder.watchMappingKey("forAddress", guestbookAddress);

        // run decoder
        const forAddress = await decoder.variable("forAddress");

        // stop watching (just clean-up)
        await decoder.unwatchMappingKey("forAddress", guestbookAddress);

        const guestbook = findMatchingGuestbook(forAddress, guestbookAddress);
        const log = getGuestbookLog(guestbook);
        return readMessages(log);
      }
    }
  }
}

/*
 * Functions for reading decoded guestbook data:
 */

// find matching Guestbook struct in decoded mapping
const findMatchingGuestbook = (forAddress, guestbookAddress) => {
  // ensure we have a mapping
  assert(forAddress.type.typeClass === "mapping");

  // with address key
  assert(forAddress.type.keyType.typeClass === "address");

  // and Guestbook struct
  assert(forAddress.type.valueType.typeClass === "struct");
  assert(forAddress.type.valueType.typeName === "Guestbook");

  // then filter the mapping for the Guestbook at specified address
  return forAddress.value.find(
    ({ key }) => key.value.asAddress === guestbookAddress
  ).value;
};

// read the log from a Guestbook struct
const getGuestbookLog = (guestbook) => {
  assert(guestbook.type.typeClass === "struct");
  assert(guestbook.type.typeName === "Guestbook");

  // find guestbook.log member of struct
  return guestbook.value.find(({ name }) => name === "log").value;
}

// reads a decoded Message struct
const readMessage = (message) => {
  assert(message.type.typeClass === "struct");
  assert(message.type.typeName === "Message");

  // struct members stored as name/value pairs
  const { author, contents } = message.value.map(({ name, value }) => ({
    [name]: value
  })).reduce((a, b) => Object.assign({}, a, b));

  // each message has contents and who wrote it
  assert(author.type.typeClass === "address");
  assert(contents.type.typeClass === "string");

  return {
    author: author.value.asAddress,
    contents: contents.value.asString
  };
};

// read all Messages in a Guestbook log
const readMessages = (guestbookLog) => {
  assert(guestbookLog.type.typeClass === "array");
  assert(guestbookLog.type.baseType.typeClass === "struct");
  assert(guestbookLog.type.baseType.typeName === "Message");

  return guestbookLog.value.map(readMessage);
}
