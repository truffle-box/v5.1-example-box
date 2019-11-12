pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

import { GuestbookLib as Lib } from "./GuestbookLib.sol";

/*
 * Turns every Ethereum address into a guestbook
 */
contract MultiGuestbook {
  using Lib for Lib.Guestbook;

  mapping (address => Lib.Guestbook) forAddress;

  // sign a guestbook at a given address
  function sign(address guestbookAddress, string memory contents)
    public
  {
    Lib.Guestbook storage guestbook = forAddress[guestbookAddress];

    guestbook.sign(msg.sender, contents);
  }

  // see all the signed messages for a given guestbook
  function signatures(address guestbookAddress)
    public
    view
    returns (Lib.Message[] memory log)
  {
    Lib.Guestbook storage guestbook = forAddress[guestbookAddress];

    return guestbook.signatures();
  }
}
