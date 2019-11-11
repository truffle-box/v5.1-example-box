pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

contract Guestbook {
  using Lib for Lib.Guestbook;

  mapping (address => Lib.Guestbook) forAddress;

  function sign(address recipient, string memory contents) public {
    Lib.Guestbook storage guestbook = forAddress[recipient];

    guestbook.sign(msg.sender, contents);
  }
}

library Lib {
  struct Message {
    address from;
    string contents;
  }

  struct Guestbook {
    Message[] log;
  }

  event SignGuestbook(Message message);

  function sign(
    Guestbook storage self,
    address from,
    string calldata contents
  )
    external
  {
    Message memory message = Message({ from: from, contents: contents });
    self.log.push(message);

    emit SignGuestbook(message);
  }
}
