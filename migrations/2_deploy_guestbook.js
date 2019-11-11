const Lib = artifacts.require("Lib");
const Guestbook = artifacts.require("Guestbook");

module.exports = async (deployer) => {
  await deployer.deploy(Lib);
  await deployer.link(Lib, Guestbook);
  await deployer.deploy(Guestbook);
};
