pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

/*
 * Basic guestbook library - implements a basic append-only message log
 */
library GuestbookLib {
  struct Message {
    address author;
    string contents;
  }

  struct Guestbook {
    Message[] log;
  }

  event SignGuestbook(Message message);

  // save a new signature to storage
  function sign(
    Guestbook storage self,
    address author,
    string calldata contents
  )
    external
  {
    Message memory message = Message({ author: author, contents: contents });
    self.log.push(message);

    emit SignGuestbook(message);
  }

  // retrieve existing signatures from storage
  function signatures(Guestbook storage self)
    external
    view
    returns (Message[] memory log)
  {
    return self.log;
  }
}
