"use client";

import React, { useCallback, useEffect, useState } from "react";
import ChatABI from "../artifacts/contracts/Chat.sol/Chat.json";
import { ethers, BrowserProvider } from "ethers";

function Home() {
  const contractAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
  const abi = ChatABI.abi;

  const [provider, setProvider] = useState<BrowserProvider>();
  const [address, setAddress] = useState("");
  const [signer, setSigner] = useState<ethers.Signer>();
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProvider() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      if (provider) {
        console.log("Ethereum successfully detected!");

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const signer = await provider.getSigner();

        setAddress(accounts[0]);
        setProvider(provider);
        setSigner(signer);
      } else {
        console.log("Please install MetaMask!");
      }
    }

    loadProvider();
  }, []);

  useEffect(() => {
    async function loadMessages() {
      const c = new ethers.Contract(contractAddress, abi, provider);
      const newMessages = await c.getAllMessages();
      setMessages(newMessages);
    }

    if (provider) {
      loadMessages();
    }
  });

  async function sendMessage() {
    const timestamp = new Date().getTime();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.sendMessage(message, BigInt(timestamp));
    await tx.wait();
    setMessage("");

    const c = new ethers.Contract(contractAddress, abi, provider);

    const newMessages = await c.getAllMessages();
    // newMessages
    setMessages(newMessages);
  }

  return (
    <div>
      <p>Your address: {address}</p>
      <input
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        value={message}
        type="text"
      />
      <button onClick={sendMessage}>Submit</button>

      {messages.length > 0 ? (
        <div>
          <h2>Messages:</h2>
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              width: "97%",
              borderRadius: "10px",
              border: "1px solid black",
            }}
          >
            {messages.map((m) => {
              if (m[1] != "")
                return (
                  <li
                    style={
                      m[0] != address
                        ? {
                            backgroundColor: "rgba(255, 0, 0, 0.5)",
                            margin: "1rem 2rem",
                            listStyle: "none",
                            width: "fit-content",
                            padding: "1rem",
                            borderRadius: "10px",
                            right: "0",
                            left: "100%",
                          }
                        : {
                            backgroundColor: "rgba(0,0, 255, 0.5)",
                            margin: "1rem 2rem",
                            listStyle: "none",
                            width: "fit-content",
                            padding: "1rem",
                            borderRadius: "10px",
                            left: "0",
                          }
                    }
                    key={messages.indexOf(m)}
                  >
                    <h2>{m[1]}</h2>
                    <p>{m[0]}</p>
                  </li>
                );
            })}
          </ul>
        </div>
      ) : (
        <p>No messages</p>
      )}
    </div>
  );
}

export default Home;
