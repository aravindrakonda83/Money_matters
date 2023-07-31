import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import AddTransactionForm from "../AddTransactionForm";
import UpdateTransactionForm from "../UpdateTransactionForm";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert";

const YourTransactions = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const loadTransactions = async () => {
    if (!hasMore || loading) return;

    setLoading(true);

    try {
      const apiEndpoint =
        "https://bursting-gelding-24.hasura.app/api/rest/all-transactions";
      const pageSize = 10; // Number of transactions to load per page

      const response = await axios.get(apiEndpoint, {
        params: {
          page: page,
          pageSize: pageSize,
        },
      });

      const newTransactions = response.data;
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        ...newTransactions,
      ]);

      // If the API response has fewer transactions than the pageSize, it means no more data available
      if (newTransactions.length < pageSize) {
        setHasMore(false);
      } else {
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      // Call loadTransactions when the component mounts
      await loadTransactions();
    };

    fetchTransactions();

    // Cleanup function to reset transactions when the component unmounts
    return () => {
      setTransactions([]);
    };
  });

  // Rest of the component code...

  // State to manage the update form
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Function to show the update form
  const showUpdateTransactionForm = (transaction) => {
    setSelectedTransaction(transaction);
    setShowUpdateForm(true);
  };

  // Function to close the update form
  const closeUpdateTransactionForm = () => {
    setSelectedTransaction(null);
    setShowUpdateForm(false);
  };

  // Function to handle updating the transaction
  const handleUpdateTransaction = async (updatedTransaction) => {
    const updatedTransactions = transactions.map((transaction) =>
      transaction.id === updatedTransaction.id
        ? updatedTransaction
        : transaction
    );
    setTransactions(updatedTransactions);
  };

  // Function to handle deleting a transaction
  const handleDeleteTransaction = async (transactionId) => {
    try {
      const apiEndpoint =
        "https://bursting-gelding-24.hasura.app/api/rest/delete-transaction";

      // Make the API call to delete the transaction
      await axios.delete(`${apiEndpoint}/${transactionId}`);

      // Show a success toast message
      alert("Transaction deleted successfully");

      // Remove the deleted transaction from the state
      setTransactions((prevTransactions) =>
        prevTransactions.filter(
          (transaction) => transaction.id !== transactionId
        )
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderTransactions = () => {
    return transactions.map((transaction) => (
      // Render each transaction item here
      <div key={transaction.id}>
        <p>Transaction Name: {transaction.name}</p>
        <p>Category: {transaction.category}</p>
        <p>Amount: {transaction.amount}</p>
        <p>Date: {transaction.date}</p>
        <button onClick={() => showUpdateTransactionForm(transaction)}>
          Edit
        </button>
        <button onClick={() => confirmDeleteTransaction(transaction.id)}>
          Delete
        </button>
      </div>
    ));
  };

  // Function to show the confirmation dialog before deleting a transaction
  const confirmDeleteTransaction = (transactionId) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this transaction?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDeleteTransaction(transactionId),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div className="your-transactions">
      <h2>Your Transactions</h2>
      <div className="tab-buttons">
        <button
          className={`tab-button ${activeTab === "all" ? "active" : ""}`}
          onClick={() => handleTabChange("all")}
        >
          All Transactions
        </button>
        <button
          className={`tab-button ${activeTab === "credit" ? "active" : ""}`}
          onClick={() => handleTabChange("credit")}
        >
          Credit
        </button>
        <button
          className={`tab-button ${activeTab === "debit" ? "active" : ""}`}
          onClick={() => handleTabChange("debit")}
        >
          Debit
        </button>
      </div>
      <div>
        {activeTab === "all" && renderTransactions()}
        {activeTab === "credit" && <p>Credit Transactions</p>}
        {activeTab === "debit" && <p>Debit Transactions</p>}
        {loading && <p>Loading...</p>}
        <AddTransactionForm />
      </div>
      {showUpdateForm && (
        <UpdateTransactionForm
          transaction={selectedTransaction}
          onUpdate={handleUpdateTransaction}
          onClose={closeUpdateTransactionForm}
        />
      )}
    </div>
  );
};

export default YourTransactions;
