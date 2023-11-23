"use client";

import React, { useCallback, useEffect, useState } from "react";
import ChatABI from "../artifacts/contracts/Chat.sol/Chat.json";
import { ethers, BrowserProvider } from "ethers";

function Home() {
  const contractAddress = "0x8260cbc13393d3A310AE4765F9B0382C8F6AFa9C";
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
    checkIfAccountChanged();
  }, []);

  async function checkIfAccountChanged() {
    try {
      const { ethereum } = window;
      ethereum.on("accountsChanged", async (accounts: string[]) => {
        console.log("Account changed to:", accounts[0]);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        setAddress(accounts[0]);
        setProvider(provider);
        setSigner(signer);
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfAccountChanged();
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
    try {
      const timestamp = new Date().getTime();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.sendMessage(message, BigInt(timestamp));
      await tx.wait();
      setMessage("");

      const c = new ethers.Contract(contractAddress, abi, provider);

      const newMessages = await c.getAllMessages();
      // newMessages
      setMessages(newMessages);
    } catch (error) {
      console.log(error);
    }
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
              flexDirection: "column-reverse",
              width: "97%",
              borderRadius: "10px",
              border: "1px solid black",
            }}
          >
            {messages.map((m) => {
              if (m[0] == address) {
                console.log("address", address);
                console.log("m[0]", m[0]);
              }
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
                          }
                        : {
                            backgroundColor: "rgba(0,0, 255, 0.5)",
                            margin: "1rem 2rem",
                            listStyle: "none",
                            width: "fit-content",
                            padding: "1rem",
                            borderRadius: "10px",
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
