const Guestbook = artifacts.require("Guestbook");
const Lib = artifacts.require("Lib");

const { forGuestbook } = require("./helpers");

contract("Guestbook", function(accounts) {
  const alice = accounts[0];
  const bob = accounts[1];

  let guestbook;
  let helpers;

  before("setup tests", async function() {
    guestbook = await Guestbook.deployed();
    helpers = await forGuestbook(guestbook, Lib);
  });

  it("stores messages", async function() {
    const { readMessagesTo } = helpers;

    // use ENS name for recipient and sender
    await guestbook.sign(
      "alice.name", "hello", { from: "bob.name" }
    );

    // check for message from bob
    const messages = await readMessagesTo(alice);
    const message = messages.find(
      ({ from }) => from === bob
    );

    assert.equal(message.contents, "hello");
  });

  it("emits events", async function() {
    const { messageLog } = helpers;

    // capture receipt to inspect event
    const { receipt } = await guestbook.sign(
      "alice.name", "hello", { from: "bob.name" }
    );

    // check raw log matches signed guestbook message
    const { from, contents } = await messageLog(receipt.rawLogs[0]);
    assert.equal(from, bob);
    assert.equal(contents, "hello");
  });
});
