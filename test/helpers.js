const Decoder = require("../../truffle/packages/decoder");

module.exports = {
  forGuestbook: async (instance, library) => {
    const decoder = await Decoder.forContractInstance(instance, [library]);

    const readMessage = (message) => {
      // struct members stored as name/value pairs
      assert(message.type.typeClass === "struct");
      assert(message.type.typeName === "Message");

      // each message has contents and who wrote it
      const { author, contents } = message.value.map(({ name, value }) => ({
        [name]: value
      })).reduce((a, b) => Object.assign({}, a, b));

      assert(author.type.typeClass === "address");
      assert(contents.type.typeClass === "string");

      return {
        author: author.value.asAddress,
        contents: contents.value.asString
      };
    };

    return {
      messageLog: async (log) => {
        const result = (await decoder.decodeLog(log))[0];

        return readMessage(result.arguments[0].value)
      },

      readGuestbookStorage: async (guestbookAddress) => {
        // make sure we get `guestbook.forAddress[guestbookAddress]`
        await decoder.watchMappingKey("forAddress", guestbookAddress);

        // run decoder
        const forAddress = await decoder.variable("forAddress");

        // stop watching (just clean-up)
        await decoder.unwatchMappingKey("forAddress", guestbookAddress);

        // find matching mapping key
        const guestbook = forAddress.value.find(
          ({ key }) => key.value.asAddress === guestbookAddress
        ).value;

        assert(guestbook.type.typeClass === "struct");
        assert(guestbook.type.typeName === "Guestbook");

        const messages = guestbook.value[0].value;

        return messages.value.map(readMessage);
      }
    }
  }
}
