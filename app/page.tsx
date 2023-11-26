"use client";

import React, { useCallback, useEffect, useState } from "react";
import ChatABI from "../artifacts/contracts/Chat.sol/Chat.json";
import { ethers, BrowserProvider } from "ethers";

function Home() {
  const contractAddress = "0xfC4C1c8f5BE78B8645227F58081AeF69685C9AC1";
  const abi = ChatABI.abi;

  const [provider, setProvider] = useState<BrowserProvider>();
  const [address, setAddress] = useState("");
  const [signer, setSigner] = useState<ethers.Signer>();
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const timestamp = new Date().getTime();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.sendMessage(message, BigInt(timestamp));
      await tx.wait();
      setMessage("");

      const c = new ethers.Contract(contractAddress, abi, provider);

      const newMessages = await c.getAllMessages();
      // newMessages
      setMessages(newMessages);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="main">
      {address === "" ? (
        <p>Not connected</p>
      ) : (
        <p>
          Your address: <strong>{address}</strong>
        </p>
      )}
      <div className="input">
        <input
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          type="text"
        />
        {/* <br /> */}
        <button onClick={sendMessage}>Submit</button>
      </div>
      {messages.length > 0 ? (
        <>
          {loading ? <p>Loading...</p> : <></>}
          <h2>Messages:</h2>
          <ul>
            {messages.map((m) => {
              if (m[1] != "")
                return (
                  <li
                    className="chat-box"
                    style={{
                      backgroundColor: "rgb(218, 134,8)",
                    }}
                    key={messages.indexOf(m)}
                  >
                    <p>{m[0]}</p>
                    <h2>{m[1]}</h2>
                  </li>
                );
            })}
          </ul>
        </>
      ) : (
        <p>No messages</p>
      )}

      <p>
        This website is hosted on the <strong>Sepolia</strong> network. Go to{" "}
        <a href="https://sepoliafaucet.com/">Sepolia Faucet</a> and get free
        SepoliaETH
      </p>
    </div>
  );
}

export default Home;
