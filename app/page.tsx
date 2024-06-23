"use client";

import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useAccount } from "@starknet-react/core";
import { Abi, Contract, TypedData, shortString, WeierstrassSignatureType } from "starknet";
import { Tab } from "@headlessui/react";
import { WalletIcon, HandThumbUpIcon, LightBulbIcon, EyeIcon } from "@heroicons/react/24/outline";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home: NextPage = () => {
  const { account } = useAccount();
  const [selectedChain, setSelectedChain] = useState<string>("ethereum");
  const [channelId, setChannelId] = useState<string>("");
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [transactAmount, setTransactAmount] = useState<string>("");
  const [crossChainAmount, setCrossChainAmount] = useState<string>("");
  const [crossChainRecipient, setCrossChainRecipient] = useState<string>("");
  const [crossChainRecipientChain, setCrossChainRecipientChain] = useState<string>("ethereum");
  const [contract, setContract] = useState<Contract | null>(null);
  const [openChannels, setOpenChannels] = useState<string[]>([]);
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);
  const [activityLog, setActivityLog] = useState<any[]>([]);

  const contractAddress = "YourContractAddress"; // Replace with your contract address
  const abi: Abi = [/* ABI of your contract as JSON object */]; // Replace with your contract ABI

  useEffect(() => {
    if (account && abi && contractAddress) {
      try {
        const contractInstance = new Contract(abi, contractAddress);
        setContract(contractInstance);
      } catch (error) {
        console.error("Error creating contract instance:", error);
      }
    }
  }, [account, abi, contractAddress]);

  const handleOpenChannel = async () => {
    console.log("Open Channel Mock Transaction");
    toast.success("Channel opened successfully!");
    setOpenChannels([...openChannels, channelId]);
  };

  const handleDeposit = async () => {
    console.log("Deposit Mock Transaction");
    toast.success("Deposit successful!");
  };

  const handleTransact = async (channel: string) => {
    if (!account) return;
    try {
      const typedDataValidate: TypedData = {
        types: {
          StarkNetDomain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'felt' },
            { name: 'chainId', type: 'felt' },
          ],
          Airdrop: [
            { name: 'address', type: 'felt' },
            { name: 'amount', type: 'felt' },
          ],
          Validate: [
            { name: 'id', type: 'felt' },
            { name: 'from', type: 'felt' },
            { name: 'amount', type: 'felt' },
            { name: 'nameGamer', type: 'string' },
            { name: 'endDate', type: 'felt' },
            { name: 'itemsAuthorized', type: 'felt*' }, // array of felt
            { name: 'chkFunction', type: 'selector' }, // name of function
            { name: 'rootList', type: 'merkletree', contains: 'Airdrop' }, // root of a merkle tree
          ],
        },
        primaryType: 'Validate',
        domain: {
          name: 'myDapp',
          version: '1',
          chainId: '0x534e5f5345504f4c4941',
        },
        message: {
          id: '0x0000004f000f',
          from: account.address,
          amount: transactAmount,
          nameGamer: 'Hector26',
          endDate: '0x27d32a3033df4277caa9e9396100b7ca8c66a4ef8ea5f6765b91a7c17f0109c',
          itemsAuthorized: ['0x01', '0x03', '0x0a', '0x0e'],
          chkFunction: 'check_authorization',
          rootList: [
            {
              address: '0x69b49c2cc8b16e80e86bfc5b0614a59aa8c9b601569c7b80dde04d3f3151b79',
              amount: '1554785',
            },
            {
              address: '0x7447084f620ba316a42c72ca5b8eefb3fe9a05ca5fe6430c65a69ecc4349b3b',
              amount: '2578248',
            },
            {
              address: '0x3cad9a072d3cf29729ab2fad2e08972b8cfde01d4979083fb6d15e8e66f8ab1',
              amount: '4732581',
            },
            {
              address: '0x7f14339f5d364946ae5e27eccbf60757a5c496bf45baf35ddf2ad30b583541a',
              amount: '913548',
            },
          ],
        },
      };

      // Sign the transaction
      const signature = (await account.signMessage(typedDataValidate)) as WeierstrassSignatureType;
      console.log("Signature:", signature);

      // Mock transaction
      const transaction = {
        domain: typedDataValidate.domain,
        types: typedDataValidate.types,
        message: typedDataValidate.message,
        signature,
      };
      console.log("Transaction:", transaction);

      // Append to activity log
      setActivityLog([...activityLog, { id: activityLog.length + 1, stateTransfers: [transaction] }]);
      toast.success("Transaction successful!");

    } catch (error) {
      console.error("Error in transaction:", error);
      toast.error("Transaction failed!");
    }
  };

  const handleCloseChannel = async () => {
    console.log("Close Channel Mock Transaction");
    toast.success("Channel closed successfully!");
  };

  const handleZKProof = async () => {
    console.log("Generate ZK Proof Mock Transaction");
    toast.success("ZK Proof generated successfully!");
  };

  const handleCrossChainOpenChannel = async () => {
    console.log("Cross Chain Open Channel Mock Transaction");
    toast.success("Cross Chain Channel opened successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <ToastContainer />
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2">RootPe</h1>
        <p className="text-lg">Gas Saver transaction with zkstate channels</p>
      </div>

      <div className="w-full max-w-3xl px-5">
        <Tab.Group>
          <Tab.List className="flex space-x-1 bg-gray-700 rounded-xl p-1">
            <Tab className={({ selected }) =>
                selected ? "w-full py-2.5 text-sm leading-5 font-medium text-white bg-gray-600 rounded-lg"
                         : "w-full py-2.5 text-sm leading-5 font-medium text-gray-300 rounded-lg"
            }>
              <WalletIcon className="h-6 w-6 inline-block mr-2" />
               Pay
            </Tab>
            <Tab className={({ selected }) =>
                selected ? "w-full py-2.5 text-sm leading-5 font-medium text-white bg-gray-600 rounded-lg"
                         : "w-full py-2.5 text-sm leading-5 font-medium text-gray-300 rounded-lg"
            }>
              <HandThumbUpIcon className="h-6 w-6 inline-block mr-2" />
              Cross Chain Pay
            </Tab>
            <Tab className={({ selected }) =>
                selected ? "w-full py-2.5 text-sm leading-5 font-medium text-white bg-gray-600 rounded-lg"
                         : "w-full py-2.5 text-sm leading-5 font-medium text-gray-300 rounded-lg"
            }>
              <LightBulbIcon className="h-6 w-6 inline-block mr-2" />
              Open Channels
            </Tab>
            <Tab className={({ selected }) =>
                selected ? "w-full py-2.5 text-sm leading-5 font-medium text-white bg-gray-600 rounded-lg"
                         : "w-full py-2.5 text-sm leading-5 font-medium text-gray-300 rounded-lg"
            }>
              <EyeIcon className="h-6 w-6 inline-block mr-2" />
              Activity
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel className="bg-gray-800 p-4 rounded-xl">
              <form onSubmit={(e) => { e.preventDefault(); handleOpenChannel(); }}>
                <label htmlFor="channel-id" className="block mb-2">Channel ID</label>
                <input
                  id="channel-id"
                  type="text"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  className="p-2 border rounded w-full bg-gray-700 text-white"
                />

                <label htmlFor="deposit-amount" className="block mt-5 mb-2">Deposit Amount</label>
                <input
                  id="deposit-amount"
                  type="text"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="p-2 border rounded w-full bg-gray-700 text-white"
                />

                <button type="submit" className="mt-5 p-2 bg-blue-500 text-white rounded w-full">
                  Open Channel
                </button>
              </form>
            </Tab.Panel>
            <Tab.Panel className="bg-gray-800 p-4 rounded-xl">
              <form onSubmit={(e) => { e.preventDefault(); handleZKProof(); }}>
                <div className="mb-4">
                  <label htmlFor="cross-chain-amount" className="block mb-2">Sender Chain</label>
                  <select
                    id="cross-chain-amount"
                    value={crossChainAmount}
                    onChange={(e) => setCrossChainAmount(e.target.value)}
                    className="p-2 border rounded w-full bg-gray-700 text-white"
                  >
                    <option value="ethereum">Ethereum</option>
                    <option value="bitcoin">Bitcoin</option>
                    <option value="starknet">StarkNet</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="cross-chain-recipient" className="block mb-2">Recipient Chain</label>
                  <select
                    id="cross-chain-recipient-chain"
                    value={crossChainRecipientChain}
                    onChange={(e) => setCrossChainRecipientChain(e.target.value)}
                    className="p-2 border rounded w-full bg-gray-700 text-white"
                  >
                    <option value="ethereum">Ethereum</option>
                    <option value="bitcoin">Bitcoin</option>
                    <option value="starknet">StarkNet</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="cross-chain-recipient" className="block mb-2">Recipient Address</label>
                  <input
                    id="cross-chain-recipient"
                    type="text"
                    value={crossChainRecipient}
                    onChange={(e) => setCrossChainRecipient(e.target.value)}
                    className="p-2 border rounded w-full bg-gray-700 text-white"
                  />
                </div>

                <button type="submit" className="p-2 bg-green-500 text-white rounded w-full">
                  Generate ZK Proof
                </button>
              </form>

              <form onSubmit={(e) => { e.preventDefault(); handleOpenChannel(); }}>
                <button type="submit" className="mt-5 p-2 bg-blue-500 text-white rounded w-full">
                  Open Cross Chain State Channel
                </button>
              </form>
            </Tab.Panel>
            <Tab.Panel className="bg-gray-800 p-4 rounded-xl">
              <div className="space-y-4">
                {openChannels.map((channel, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p>Recipient: {channel}</p>
                        <p>Chain: Ethereum</p>
                      </div>
                      <button
                        onClick={() => setExpandedChannel(expandedChannel === channel ? null : channel)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        {expandedChannel === channel ? 'Collapse' : 'Expand'}
                      </button>
                    </div>
                    {expandedChannel === channel && (
                      <div className="mt-4">
                        <label htmlFor={`transact-amount-${index}`} className="block mb-2">Transact Amount</label>
                        <input
                          id={`transact-amount-${index}`}
                          type="text"
                          value={transactAmount}
                          onChange={(e) => setTransactAmount(e.target.value)}
                          className="p-2 border rounded w-full bg-gray-700 text-white"
                        />
                        <button
                          onClick={() => handleTransact(channel)}
                          className="mt-4 p-2 bg-yellow-500 text-white rounded w-full"
                        >
                          Transact
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Tab.Panel>
            <Tab.Panel className="bg-gray-800 p-4 rounded-xl">
              <div>
                <h2 className="text-2xl mb-4">Activity</h2>
                <div className="space-y-4">
                  {activityLog.map((activity, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <p>Activity ID: {activity.id}</p>
                        <button
                          onClick={() => setExpandedActivity(expandedActivity === index ? null : index)}
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          {expandedActivity === index ? 'Collapse' : 'Expand'}
                        </button>
                      </div>
                      {expandedActivity === index && (
                        <div className="mt-4">
                          {activity.stateTransfers.map((transfer, tIndex) => (
                            <div key={tIndex} className="bg-gray-600 p-4 rounded-lg mb-2">
                              <p>From: {transfer.message.from}</p>
                              <p>Amount: {transfer.message.amount}</p>
                              <p>Merkle Proof: {transfer.message.rootList[0].address}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Home;
