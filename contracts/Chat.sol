// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

contract Chat {
    struct Message {
        address sender;
        string content;
    }

    Message[] public messages;

    function sendMessage(string memory content) public {
        messages.push(Message({sender: msg.sender, content: content}));
    }

    function getMessages() public view returns (Message[] memory) {
        return messages;
    }
}