// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

contract Chat {
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
    }

    mapping(uint256 => Message) public messages;

    uint256 _numMessages = 0;

    function sendMessage(string memory _content, uint256 timestamp) public {
        messages[_numMessages++] = Message(msg.sender, _content, timestamp);
    }

    function getAllMessages() public view returns (Message[] memory) {
        Message[] memory _messages = new Message[](_numMessages);
        for (uint256 i = 1; i < _numMessages; i++) {
            _messages[i - 1] = messages[i];
        }
        return _messages;
    }
}
