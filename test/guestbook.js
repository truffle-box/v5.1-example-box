const MultiGuestbook = artifacts.require("MultiGuestbook");
const GuestbookLib = artifacts.require("GuestbookLib");

const { forGuestbook } = require("./helpers");

contract("MultiGuestbook", function(accounts) {
  const alice = accounts[0];
  const bob = accounts[1];
  const calhoun = accounts[2];

  let guestbook;
  let helpers;

  before("setup tests", async function() {
    guestbook = await MultiGuestbook.deployed();
    helpers = await forGuestbook(guestbook, GuestbookLib);
  });

  it("returns guestbook signatures via ABI", async function() {
    const message = "hello world!";

    /*
     * sign guestbook's own guestbook using ENS name for both function
     * parameter and tx parameter
     *
     * to debug this transaction: comment this out and uncomment the next line
     */
    await guestbook.sign("multi.guestbook", message, { from: "alice.name" });
    // await debug(guestbook.sign("multi.guestbook", message, { from: "alice.name" }));

    /*
     * read guestbook signatures via external view
     *
     * to debug this call: comment this out and uncomment the line below,
     * run `truffle test --debug`
     */
    const signatures = await guestbook.signatures("multi.guestbook");
    // const signatures = await debug(guestbook.signatures("multi.guestbook"));


    // find alice's message
    const { contents } = signatures.find( ({ author }) => author === alice );

    assert.equal(contents, message);
  });

  it("stores guestbook messages", async function() {
    const message = "interesting concept, perhaps... -bob";

    // use ENS name for guestbook address and sender
    await guestbook.sign("multi.guestbook", message, { from: "bob.name" });

    const { readGuestbookStorage } = helpers;

    // read storage and find message from bob
    const messages = await readGuestbookStorage(guestbook.address);
    const { contents } = messages.find(
      ({ author }) => author === bob
    );

    assert.equal(contents, message);
  });

  it("emits events", async function() {
    const message = "no like button?";

    // capture receipt to inspect event
    const { receipt } = await guestbook.sign(
      "multi.guestbook", message, { from: "calhoun.name" }
    );

    const { readSignGuestbookEvent } = helpers;

    // check raw log matches signed guestbook message
    const { author, contents } = await readSignGuestbookEvent(
      receipt.rawLogs[0]
    );

    assert.equal(author, calhoun);
    assert.equal(contents, message);
  });
});
