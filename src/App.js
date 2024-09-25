import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [completeTaskId, setCompleteTaskId] = useState("");
  const [activityTaskId, setActivityTaskId] = useState("");
  const [activityType, setActivityType] = useState("");

  const contractAddress = "0x96481F8958D21b19b55a50537B51B2f4ff4eE963"; // This contract address is deployed on Remix-IDE
  const contractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "activityId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "taskId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "activityType",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ActivityLogged",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_taskId",
          "type": "uint256"
        }
      ],
      "name": "completeTask",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "_assignedTo",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_deadline",
          "type": "uint256"
        }
      ],
      "name": "createTask",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_taskId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_activityType",
          "type": "string"
        }
      ],
      "name": "logActivity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "taskId",
          "type": "uint256"
        }
      ],
      "name": "TaskCompleted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "taskId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "assignedTo",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        }
      ],
      "name": "TaskCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "activities",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "taskId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "activityType",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_activityId",
          "type": "uint256"
        }
      ],
      "name": "getActivityDetails",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "taskId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "activityType",
              "type": "string"
            }
          ],
          "internalType": "struct TaskAssignment.Activity",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_taskId",
          "type": "uint256"
        }
      ],
      "name": "getTaskDetails",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "assignedTo",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isCompleted",
              "type": "bool"
            },
            {
              "internalType": "uint256[]",
              "name": "activityLog",
              "type": "uint256[]"
            }
          ],
          "internalType": "struct TaskAssignment.Task",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "tasks",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "assignedTo",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isCompleted",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
    setContract(contractInstance);
  };

  const createTask = async () => {
    if (!contract) return;
    await contract.methods
      .createTask(description, assignedTo, deadline)
      .send({ from: account })
      .on("receipt", (receipt) => {
        alert("Task created successfully!");
      })
      .on("error", (error) => {
        console.error(error);
        alert("Failed to create task.");
      });
  };

  const completeTask = async () => {
    if (!contract) return;
    await contract.methods
      .completeTask(completeTaskId)
      .send({ from: account })
      .on("receipt", (receipt) => {
        alert("Task completed successfully!");
      })
      .on("error", (error) => {
        console.error(error);
        alert("Failed to complete task.");
      });
  };

  const logActivity = async () => {
    if (!contract) return;
    await contract.methods
      .logActivity(activityTaskId, activityType)
      .send({ from: account })
      .on("receipt", (receipt) => {
        alert("Activity logged successfully!");
      })
      .on("error", (error) => {
        console.error(error);
        alert("Failed to log activity.");
      });
  };

  return (
    <div className="App">
      <h1>Task Assignment DApp</h1>
      <div className="container">
        <h2>Create a Task</h2>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task Description"
        />
        <input
          type="text"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          placeholder="Assignee Address"
        />
        <input
          type="number"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          placeholder="Deadline (Unix Timestamp)"
        />
        <button onClick={createTask}>Create Task</button>

        <h2>Complete a Task</h2>
        <input
          type="number"
          value={completeTaskId}
          onChange={(e) => setCompleteTaskId(e.target.value)}
          placeholder="Task ID to Complete"
        />
        <button onClick={completeTask}>Complete Task</button>

        <h2>Log Activity</h2>
        <input
          type="number"
          value={activityTaskId}
          onChange={(e) => setActivityTaskId(e.target.value)}
          placeholder="Task ID"
        />
        <input
          type="text"
          value={activityType}
          onChange={(e) => setActivityType(e.target.value)}
          placeholder="Activity Type"
        />
        <button onClick={logActivity}>Log Activity</button>
      </div>
    </div>
  );
}

export default App;
