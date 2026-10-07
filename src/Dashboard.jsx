import { useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");
  const [expenses, setExpenses] = useState([]);

  const addExpense = () => {
    if (expense === "") return;

    setExpenses([...expenses, Number(expense)]);
    setExpense("");
  };

  const totalExpenses = expenses.reduce((a, b) => a + b, 0);
  const balance = Number(income || 0) - totalExpenses;

  return (
    <div className="dashboard">
      <h1>Personal Expense Tracker</h1>

      <div className="cards">
        <div className="card">
          <h3>Total Income</h3>
          <p>₹{income || 0}</p>
        </div>

        <div className="card">
          <h3>Total Expenses</h3>
          <p>₹{totalExpenses}</p>
        </div>

        <div className="card">
          <h3>Balance</h3>
          <p>₹{balance}</p>
        </div>
      </div>

      <div className="form">
        <h2>Add Income</h2>

        <input
          type="number"
          placeholder="Enter income"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
        />

        <h2>Add Expense</h2>

        <input
          type="number"
          placeholder="Enter expense"
          value={expense}
          onChange={(e) => setExpense(e.target.value)}
        />

        <button onClick={addExpense}>Add Expense</button>
      </div>
    </div>
  );
}

export default Dashboard;