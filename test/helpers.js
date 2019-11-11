const Decoder = require("../../truffle/packages/decoder");

module.exports = {
  forGuestbook: async (instance, Lib) => {
    const decoder = await Decoder.forContractInstance(instance, [Lib]);

    const readMessage = (message) => {
      // struct members stored as name/value pairs
      assert(message.type.typeClass === "struct");
      assert(message.type.typeName === "Message");

      // each message has contents and who wrote it
      const { from, contents } = message.value.map(({ name, value }) => ({
        [name]: value
      })).reduce((a, b) => Object.assign({}, a, b));

      assert(from.type.typeClass === "address");
      assert(contents.type.typeClass === "string");

      return {
        from: from.value.asAddress,
        contents: contents.value.asString
      };
    };

    return {
      messageLog: async (log) => {
        const result = (await decoder.decodeLog(log))[0];

        return readMessage(result.arguments[0].value)
      },

      readMessagesTo: async (recipient) => {
        // make sure we get `guestbook.forAddress[recipient]`
        await decoder.watchMappingKey("forAddress", recipient);

        // run decoder
        const forAddress = await decoder.variable("forAddress");

        // stop watching
        await decoder.unwatchMappingKey("forAddress", recipient);

        // find matching mapping key
        const guestbook = forAddress.value.find(
          ({ key }) => key.value.asAddress === recipient
        ).value;

        assert(guestbook.type.typeClass === "struct");
        assert(guestbook.type.typeName === "Guestbook");

        const messages = guestbook.value[0].value;

        return messages.value.map(readMessage);
      }
    }
  }
}
