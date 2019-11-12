const GuestbookLib = artifacts.require("GuestbookLib");
const MultiGuestbook = artifacts.require("MultiGuestbook");

module.exports = async (deployer) => {
  await deployer.deploy(GuestbookLib);
  await deployer.link(GuestbookLib, MultiGuestbook);
  await deployer.deploy(MultiGuestbook);
};
