const Lib = artifacts.require("Lib");
const Guestbook = artifacts.require("Guestbook");

module.exports = async (deployer, network, accounts) => {
  await deployer.ens.setAddress("alice.name", accounts[0], { from: accounts[0] });
  await deployer.ens.setAddress("bob.name", accounts[1], { from: accounts[0] });
};
