const MultiGuestbook = artifacts.require("MultiGuestbook");

module.exports = async (deployer, network, accounts) => {
  const guestbook = await MultiGuestbook.deployed();

  // set ENS name for MultiGuestbook service
  await deployer.ens.setAddress(
    "multi.guestbook", guestbook, { from: accounts[0] }
  );

  // set ENS name for a few participants
  await deployer.ens.setAddress(
    "alice.name", accounts[0], { from: accounts[0] }
  );
  await deployer.ens.setAddress(
    "bob.name", accounts[1], { from: accounts[0] }
  );
  await deployer.ens.setAddress(
    "calhoun.name", accounts[2], { from: accounts[0] }
  );

};
