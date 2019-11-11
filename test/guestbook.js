const MultiGuestbook = artifacts.require("MultiGuestbook");
const GuestbookLib = artifacts.require("GuestbookLib");

const { forGuestbook } = require("./helpers");

contract("MultiGuestbook", function(accounts) {
  const alice = accounts[0];
  const bob = accounts[1];

  let guestbook;
  let helpers;

  before("setup tests", async function() {
    guestbook = await MultiGuestbook.deployed();
    helpers = await forGuestbook(guestbook, GuestbookLib);
  });

  it("stores messages", async function() {
    const { readGuestbookStorage } = helpers;

    // use ENS name for guestbook address and sender
    await guestbook.sign(
      "alice.name", "hello", { from: "bob.name" }
    );

    // check for message from bob
    const messages = await readGuestbookStorage(alice);
    const message = messages.find(
      ({ author }) => author === bob
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
    const { author, contents } = await messageLog(receipt.rawLogs[0]);
    assert.equal(author, bob);
    assert.equal(contents, "hello");
  });
});
