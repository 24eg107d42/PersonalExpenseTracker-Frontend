import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Entertainment",
  "Education",
  "Medical",
  "Bills",
  "Other"
];

const incomeSources = [
  "Salary",
  "Freelance",
  "Business",
  "Part-time Job",
  "Bonus",
  "Scholarship",
  "Allowance",
  "Investment",
  "Interest",
  "Rental Income",
  "Gift",
  "Other"
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ff6666",
  "#a4a4a4"
];

function App() {

  const [page, setPage] = useState(
    localStorage.getItem("userEmail")
      ? "dashboard"
      : "login"
  );

  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || ""
  );

  /* =========================
     AUTH
  ========================= */

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [authErrors, setAuthErrors] = useState({});

  /* =========================
     DATA
  ========================= */

  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [budget, setBudget] = useState(null);
  const [savingsGoal, setSavingsGoal] = useState(null);

  /* =========================
     INCOME
  ========================= */

  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeSource, setIncomeSource] = useState("");
  const [editingIncomeId, setEditingIncomeId] =
    useState(null);

  const [incomeErrors, setIncomeErrors] =
    useState({});

  /* =========================
     EXPENSE
  ========================= */

  const [expenseTitle, setExpenseTitle] =
    useState("");

  const [expenseAmount, setExpenseAmount] =
    useState("");

  const [expenseCategory, setExpenseCategory] =
    useState("Food");

  const [expenseErrors, setExpenseErrors] =
    useState({});

  /* =========================
     BUDGET
  ========================= */

  const [budgetAmount, setBudgetAmount] =
    useState("");

  const [budgetError, setBudgetError] =
    useState("");

  /* =========================
     SAVINGS
  ========================= */

  const [goalName, setGoalName] =
    useState("");

  const [targetAmount, setTargetAmount] =
    useState("");

  const [savedAmount, setSavedAmount] =
    useState("");

  const [savingsErrors, setSavingsErrors] =
    useState({});

  /* =========================
     SEARCH
  ========================= */

  const [globalSearch, setGlobalSearch] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [filterCategory, setFilterCategory] =
    useState("All");

  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {

    if (page === "dashboard" && userEmail) {
      loadExpenses();
      loadIncome();
      loadBudget();
      loadSavingsGoal();
    }

  }, [page, userEmail]);

  const loadExpenses = async () => {
    try {

      const res = await axios.get(
        `${API}/api/expenses/${userEmail}`
      );

      setExpenses(res.data || []);

    } catch (error) {
      console.error(error);
    }
  };

  const loadIncome = async () => {
    try {

      const res = await axios.get(
        `${API}/api/income/${userEmail}`
      );

      setIncome(res.data || []);

    } catch (error) {
      console.error(error);
    }
  };

  const loadBudget = async () => {
    try {

      const res = await axios.get(
        `${API}/api/budget/${userEmail}`
      );

      setBudget(res.data);

      if (res.data) {
        setBudgetAmount(res.data.amount);
      }

    } catch (error) {
      console.error(error);
    }
  };

  const loadSavingsGoal = async () => {
    try {

      const res = await axios.get(
        `${API}/api/savings/${userEmail}`
      );

      setSavingsGoal(res.data);

      if (res.data) {

        setGoalName(res.data.goalName);
        setTargetAmount(res.data.targetAmount);
        setSavedAmount(res.data.savedAmount);

      }

    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     EMAIL VALIDATION
  ========================= */

  const validEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      value
    );
  };

  /* =========================
     REGISTER
  ========================= */

  const register = async (e) => {

    e.preventDefault();

    const errors = {};

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      errors.name = "Name is required";
    } else if (cleanName.length < 2) {
      errors.name =
        "Name must contain at least 2 characters";
    }

    if (!cleanEmail) {
      errors.email = "Email is required";
    } else if (!validEmail(cleanEmail)) {
      errors.email =
        "Enter a valid email address";
    }

    if (!password) {
      errors.password =
        "Password is required";
    } else if (password.length < 6) {
      errors.password =
        "Password must contain at least 6 characters";
    }

    setAuthErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {

      await axios.post(
        `${API}/api/auth/register`,
        {
          name: cleanName,
          email: cleanEmail,
          password
        }
      );

      alert("Registration successful!");

      setName("");
      setEmail("");
      setPassword("");
      setAuthErrors({});

      setPage("login");

    } catch (error) {

      console.error("Registration error:", error);

      if (error.response?.status === 409) {
        setAuthErrors({
          email: "This email is already registered. Please log in."
        });
      } else if (!error.response) {
        setAuthErrors({
          email: "Cannot connect to the server. Please try again later."
        });
      } else {
        setAuthErrors({
          email: error.response?.data?.message ||
            `Registration failed (HTTP ${error.response.status}). Please try again.`
        });
      }
    }
  };

  /* =========================
     LOGIN
  ========================= */

  const login = async (e) => {

    e.preventDefault();

    const errors = {};

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      errors.email = "Email is required";
    } else if (!validEmail(cleanEmail)) {
      errors.email =
        "Enter a valid email address";
    }

    if (!password) {
      errors.password =
        "Password is required";
    }

    setAuthErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {

      await axios.post(
        `${API}/api/auth/login`,
        {
          email: cleanEmail,
          password
        }
      );

      localStorage.setItem(
        "userEmail",
        cleanEmail
      );

      setUserEmail(cleanEmail);
      setAuthErrors({});
      setPage("dashboard");

    } catch (error) {

      console.error("Login error:", error);

      if (!error.response) {
        setAuthErrors({
          password: "Cannot connect to the server. Please try again later."
        });
      } else {
        setAuthErrors({
          password: error.response?.data?.message ||
            "Login failed. Please check your email and password."
        });
      }
    }
  };

  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {

    localStorage.removeItem("userEmail");

    setUserEmail("");
    setPage("login");

    setExpenses([]);
    setIncome([]);
    setBudget(null);
    setSavingsGoal(null);

  };

  /* =========================
     INCOME
  ========================= */

  const addIncome = async (e) => {

    e.preventDefault();

    const errors = {};
    const amount = Number(incomeAmount);

    if (!incomeAmount) {
      errors.amount = "Amount is required";
    } else if (
      isNaN(amount) ||
      amount <= 0
    ) {
      errors.amount =
        "Amount must be greater than 0";
    }

    if (!incomeSource.trim()) {
      errors.source =
        "Income source is required";
    }

    setIncomeErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {

      if (editingIncomeId) {

        const res = await axios.put(
          `${API}/api/income/${editingIncomeId}`,
          {
            amount,
            source: incomeSource.trim(),
            userEmail
          }
        );

        setIncome((previous) =>
          previous.map((item) =>
            item.id === editingIncomeId
              ? res.data
              : item
          )
        );

        setEditingIncomeId(null);

      } else {

        const res = await axios.post(
          `${API}/api/income`,
          {
            amount,
            source: incomeSource.trim(),
            userEmail
          }
        );

        setIncome((previous) => [
          ...previous,
          res.data
        ]);
      }

      setIncomeAmount("");
      setIncomeSource("");
      setIncomeErrors({});

    } catch (error) {

      console.error(error);
      alert("Could not save income");

    }
  };

  const editIncome = (item) => {

    setEditingIncomeId(item.id);
    setIncomeAmount(item.amount);
    setIncomeSource(item.source);
    setIncomeErrors({});

  };

  const deleteIncome = async (id) => {

    try {

      await axios.delete(
        `${API}/api/income/${id}`
      );

      setIncome((previous) =>
        previous.filter(
          (item) => item.id !== id
        )
      );

    } catch (error) {

      console.error(error);
      alert("Could not delete income");

    }
  };

  /* =========================
     EXPENSE
  ========================= */

  const addExpense = async (e) => {

    e.preventDefault();

    const errors = {};
    const amount = Number(expenseAmount);

    if (!expenseTitle.trim()) {

      errors.title =
        "Expense title is required";

    } else if (
      expenseTitle.trim().length < 2
    ) {

      errors.title =
        "Title must contain at least 2 characters";
    }

    if (!expenseAmount) {

      errors.amount =
        "Amount is required";

    } else if (
      isNaN(amount) ||
      amount <= 0
    ) {

      errors.amount =
        "Amount must be greater than 0";
    }

    if (!expenseCategory) {

      errors.category =
        "Please select a category";
    }

    setExpenseErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {

      const res = await axios.post(
        `${API}/api/expenses`,
        {
          title: expenseTitle.trim(),
          amount,
          category: expenseCategory,
          userEmail
        }
      );

      setExpenses((previous) => [
        ...previous,
        res.data
      ]);

      setExpenseTitle("");
      setExpenseAmount("");
      setExpenseCategory("Food");
      setExpenseErrors({});

    } catch (error) {

      console.error(error);
      alert("Could not add expense");

    }
  };

  const deleteExpense = async (id) => {

    try {

      await axios.delete(
        `${API}/api/expenses/${id}`
      );

      setExpenses((previous) =>
        previous.filter(
          (item) => item.id !== id
        )
      );

    } catch (error) {

      console.error(error);
      alert("Could not delete expense");

    }
  };

  /* =========================
     BUDGET
  ========================= */

  const saveBudget = async () => {

    const amount = Number(budgetAmount);

    if (!budgetAmount) {

      setBudgetError(
        "Budget amount is required"
      );

      return;
    }

    if (isNaN(amount) || amount <= 0) {

      setBudgetError(
        "Budget must be greater than 0"
      );

      return;
    }

    try {

      const res = await axios.post(
        `${API}/api/budget`,
        {
          amount,
          userEmail
        }
      );

      setBudget(res.data);
      setBudgetError("");

    } catch (error) {

      console.error(error);
      alert("Could not save budget");

    }
  };

  const deleteBudget = async () => {

    if (!budget) return;

    try {

      await axios.delete(
        `${API}/api/budget/${budget.id}`
      );

      setBudget(null);
      setBudgetAmount("");

    } catch (error) {

      console.error(error);
      alert("Could not delete budget");

    }
  };

  /* =========================
     SAVINGS GOAL
  ========================= */

  const saveSavingsGoal = async () => {

    const errors = {};

    const target = Number(targetAmount);
    const saved = Number(savedAmount);

    if (!goalName.trim()) {

      errors.goal =
        "Goal name is required";

    }

    if (!targetAmount) {

      errors.target =
        "Target amount is required";

    } else if (
      isNaN(target) ||
      target <= 0
    ) {

      errors.target =
        "Target must be greater than 0";
    }

    if (savedAmount === "") {

      errors.saved =
        "Saved amount is required";

    } else if (
      isNaN(saved) ||
      saved < 0
    ) {

      errors.saved =
        "Saved amount cannot be negative";

    } else if (
      saved > target
    ) {

      errors.saved =
        "Saved amount cannot exceed target";
    }

    setSavingsErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {

      const res = await axios.post(
        `${API}/api/savings`,
        {
          goalName: goalName.trim(),
          targetAmount: target,
          savedAmount: saved,
          userEmail
        }
      );

      setSavingsGoal(res.data);
      setSavingsErrors({});

    } catch (error) {

      console.error(error);
      alert("Could not save savings goal");

    }
  };

  const deleteSavingsGoal = async () => {

    if (!savingsGoal) return;

    try {

      await axios.delete(
        `${API}/api/savings/${savingsGoal.id}`
      );

      setSavingsGoal(null);

      setGoalName("");
      setTargetAmount("");
      setSavedAmount("");

    } catch (error) {

      console.error(error);
      alert("Could not delete savings goal");

    }
  };

  /* =========================
     TOTALS
  ========================= */

  const totalIncome = income.reduce(
    (sum, item) =>
      sum + Number(item.amount),
    0
  );

  const totalExpenses = expenses.reduce(
    (sum, item) =>
      sum + Number(item.amount),
    0
  );

  const balance =
    totalIncome - totalExpenses;

  const remainingBudget = budget
    ? Number(budget.amount) - totalExpenses
    : 0;

  /* =========================
     EXPENSE FILTER
  ========================= */

  const filteredExpenses =
    expenses.filter((expense) => {

      const text =
        search.toLowerCase();

      const matchesSearch =
        expense.title
          ?.toLowerCase()
          .includes(text) ||
        expense.category
          ?.toLowerCase()
          .includes(text) ||
        expense.amount
          ?.toString()
          .includes(text);

      const matchesCategory =
        filterCategory === "All" ||
        expense.category === filterCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  /* =========================
     GLOBAL SEARCH
  ========================= */

  const globalText =
    globalSearch.trim().toLowerCase();

  const globalIncomeResults =
    globalText
      ? income.filter((item) =>
          `${item.source} ${item.amount}`
            .toLowerCase()
            .includes(globalText)
        )
      : [];

  const globalExpenseResults =
    globalText
      ? expenses.filter((item) =>
          `${item.title} ${item.category} ${item.amount}`
            .toLowerCase()
            .includes(globalText)
        )
      : [];

  const budgetMatches =
    globalText &&
    budget &&
    `budget monthly ${budget.amount}`
      .toLowerCase()
      .includes(globalText);

  const savingsMatches =
    globalText &&
    savingsGoal &&
    `${savingsGoal.goalName}
     ${savingsGoal.targetAmount}
     ${savingsGoal.savedAmount}`
      .toLowerCase()
      .includes(globalText);

  const totalGlobalResults =
    globalIncomeResults.length +
    globalExpenseResults.length +
    (budgetMatches ? 1 : 0) +
    (savingsMatches ? 1 : 0);

  /* =========================
     CHART
  ========================= */

  const categoryData =
    categories
      .map((category) => ({
        name: category,
        value: expenses
          .filter(
            (expense) =>
              expense.category === category
          )
          .reduce(
            (sum, expense) =>
              sum + Number(expense.amount),
            0
          )
      }))
      .filter(
        (item) => item.value > 0
      );

  /* =========================
     LOGIN PAGE
  ========================= */

  if (page === "login") {

    return (
      <div className="auth-page">

        <div className="auth-card">

          <h1>
            💰 Personal Expense Tracker
          </h1>

          <p>
            Login to manage your finances
          </p>

          <form onSubmit={login}>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setAuthErrors({
                  ...authErrors,
                  email: ""
                });
              }}
            />

            {authErrors.email && (
              <small className="error">
                {authErrors.email}
              </small>
            )}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setAuthErrors({
                  ...authErrors,
                  password: ""
                });
              }}
            />

            {authErrors.password && (
              <small className="error">
                {authErrors.password}
              </small>
            )}

            <button type="submit">
              Login
            </button>

          </form>

          <p>
            Don't have an account?

            <button
              className="link-button"
              type="button"
              onClick={() => {
                setPage("register");
                setAuthErrors({});
              }}
            >
              Create Account
            </button>

          </p>

        </div>

      </div>
    );
  }

  /* =========================
     REGISTER PAGE
  ========================= */

  if (page === "register") {

    return (
      <div className="auth-page">

        <div className="auth-card">

          <h1>
            Create Account
          </h1>

          <p>
            Register to start tracking
            your expenses
          </p>

          <form onSubmit={register}>

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setAuthErrors({
                  ...authErrors,
                  name: ""
                });
              }}
            />

            {authErrors.name && (
              <small className="error">
                {authErrors.name}
              </small>
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setAuthErrors({
                  ...authErrors,
                  email: ""
                });
              }}
            />

            {authErrors.email && (
              <small className="error">
                {authErrors.email}
              </small>
            )}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setAuthErrors({
                  ...authErrors,
                  password: ""
                });
              }}
            />

            {authErrors.password && (
              <small className="error">
                {authErrors.password}
              </small>
            )}

            <button type="submit">
              Register
            </button>

          </form>

          <p>
            Already have an account?

            <button
              className="link-button"
              type="button"
              onClick={() => {
                setPage("login");
                setAuthErrors({});
              }}
            >
              Login
            </button>

          </p>

        </div>

      </div>
    );
  }

  /* =========================
     DASHBOARD
  ========================= */

  return (
    <div className="dashboard">

      <header className="topbar">

        <h2>
          💰 Personal Expense Tracker
        </h2>

        <button
          onClick={logout}
          className="logout-button"
        >
          Logout
        </button>

      </header>

      <section className="welcome-section">

        <h1>
          Welcome back! 👋
        </h1>

        <p>
          Manage your income, expenses
          and savings.
        </p>

      </section>

      {/* GLOBAL SEARCH */}

      <section className="global-search-container">

        <div className="global-search-box">

          <span>
            🔎
          </span>

          <input
            type="text"
            placeholder="Search everything..."
            value={globalSearch}
            onChange={(e) =>
              setGlobalSearch(
                e.target.value
              )
            }
          />

          {globalSearch && (
            <button
              type="button"
              onClick={() =>
                setGlobalSearch("")
              }
            >
              ✕
            </button>
          )}

        </div>

        {globalText && (

          <div className="global-results">

            <h3>
              Search Results
            </h3>

            <p>
              {totalGlobalResults}
              {" "}result(s) found
            </p>

            {globalIncomeResults.map(
              (item) => (

                <div
                  className="global-result-item"
                  key={`income-${item.id}`}
                >

                  💵 {item.source}

                  <strong>
                    ₹{item.amount}
                  </strong>

                </div>

              )
            )}

            {globalExpenseResults.map(
              (item) => (

                <div
                  className="global-result-item"
                  key={`expense-${item.id}`}
                >

                  💸 {item.title}

                  <strong>
                    ₹{item.amount}
                  </strong>

                </div>

              )
            )}

            {budgetMatches && (

              <div className="global-result-item">

                🎯 Monthly Budget

                <strong>
                  ₹{budget.amount}
                </strong>

              </div>

            )}

            {savingsMatches && (

              <div className="global-result-item">

                🎯 {savingsGoal.goalName}

                <strong>
                  ₹{savingsGoal.savedAmount}
                </strong>

              </div>

            )}

            {totalGlobalResults === 0 && (
              <p>
                No results found.
              </p>
            )}

          </div>

        )}

      </section>

      {/* SUMMARY */}

      <div className="summary-grid">

        <div className="summary-card">
          <h3>Total Income</h3>
          <strong>
            ₹{totalIncome.toFixed(2)}
          </strong>
        </div>

        <div className="summary-card">
          <h3>Total Spending</h3>
          <strong>
            ₹{totalExpenses.toFixed(2)}
          </strong>
        </div>

        <div className="summary-card">
          <h3>Balance</h3>
          <strong>
            ₹{balance.toFixed(2)}
          </strong>
        </div>

        <div className="summary-card">
          <h3>Remaining Budget</h3>
          <strong>
            ₹{remainingBudget.toFixed(2)}
          </strong>
        </div>

      </div>

      <div className="main-grid">

        {/* INCOME */}

        <div className="section-card">

          <h2>
            💵 Income
          </h2>

          <form onSubmit={addIncome}>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Amount"
              value={incomeAmount}
              onChange={(e) => {
                setIncomeAmount(
                  e.target.value
                );
                setIncomeErrors({
                  ...incomeErrors,
                  amount: ""
                });
              }}
            />

            {incomeErrors.amount && (
              <small className="error">
                {incomeErrors.amount}
              </small>
            )}

            <input
              type="text"
              list="incomeSources"
              placeholder="Income Source"
              value={incomeSource}
              onChange={(e) => {
                setIncomeSource(
                  e.target.value
                );
                setIncomeErrors({
                  ...incomeErrors,
                  source: ""
                });
              }}
            />

            <datalist id="incomeSources">

              {incomeSources.map(
                (source) => (
                  <option
                    key={source}
                    value={source}
                  />
                )
              )}

            </datalist>

            {incomeErrors.source && (
              <small className="error">
                {incomeErrors.source}
              </small>
            )}

            <button type="submit">
              {editingIncomeId
                ? "Update Income"
                : "Add Income"}
            </button>

          </form>

          {income.map((item) => (

            <div
              className="list-item"
              key={item.id}
            >

              <div>
                <strong>
                  {item.source}
                </strong>

                <p>
                  ₹{item.amount}
                </p>
              </div>

              <div>

                <button
                  type="button"
                  onClick={() =>
                    editIncome(item)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deleteIncome(item.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* BUDGET */}

        <div className="section-card">

          <h2>
            🎯 Monthly Budget
          </h2>

          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Monthly Budget"
            value={budgetAmount}
            onChange={(e) => {
              setBudgetAmount(
                e.target.value
              );
              setBudgetError("");
            }}
          />

          {budgetError && (
            <small className="error">
              {budgetError}
            </small>
          )}

          <button
            type="button"
            onClick={saveBudget}
          >
            Save Budget
          </button>

          {budget && (

            <div className="budget-result">

              <p>
                Budget: ₹{budget.amount}
              </p>

              <p>
                Spent: ₹
                {totalExpenses.toFixed(2)}
              </p>

              <p>
                Remaining: ₹
                {remainingBudget.toFixed(2)}
              </p>

              <button
                type="button"
                onClick={deleteBudget}
              >
                Delete Budget
              </button>

            </div>

          )}

        </div>

        {/* SAVINGS */}

        <div className="section-card">

          <h2>
            🎯 Savings Goal
          </h2>

          <input
            type="text"
            placeholder="Goal Name"
            value={goalName}
            onChange={(e) => {
              setGoalName(e.target.value);
              setSavingsErrors({
                ...savingsErrors,
                goal: ""
              });
            }}
          />

          {savingsErrors.goal && (
            <small className="error">
              {savingsErrors.goal}
            </small>
          )}

          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Target Amount"
            value={targetAmount}
            onChange={(e) => {
              setTargetAmount(
                e.target.value
              );
              setSavingsErrors({
                ...savingsErrors,
                target: ""
              });
            }}
          />

          {savingsErrors.target && (
            <small className="error">
              {savingsErrors.target}
            </small>
          )}

          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Saved Amount"
            value={savedAmount}
            onChange={(e) => {
              setSavedAmount(
                e.target.value
              );
              setSavingsErrors({
                ...savingsErrors,
                saved: ""
              });
            }}
          />

          {savingsErrors.saved && (
            <small className="error">
              {savingsErrors.saved}
            </small>
          )}

          <button
            type="button"
            onClick={saveSavingsGoal}
          >
            Save Goal
          </button>

          {savingsGoal && (

            <div className="goal-result">

              <h3>
                {savingsGoal.goalName}
              </h3>

              <p>
                ₹{savingsGoal.savedAmount}
                {" / "}
                ₹{savingsGoal.targetAmount}
              </p>

              <button
                type="button"
                onClick={
                  deleteSavingsGoal
                }
              >
                Delete Goal
              </button>

            </div>

          )}

        </div>

        {/* EXPENSE */}

        <div className="section-card">

          <h2>
            💸 Expenses
          </h2>

          <form onSubmit={addExpense}>

            <input
              type="text"
              placeholder="Expense Title"
              value={expenseTitle}
              onChange={(e) => {
                setExpenseTitle(
                  e.target.value
                );
                setExpenseErrors({
                  ...expenseErrors,
                  title: ""
                });
              }}
            />

            {expenseErrors.title && (
              <small className="error">
                {expenseErrors.title}
              </small>
            )}

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Amount"
              value={expenseAmount}
              onChange={(e) => {
                setExpenseAmount(
                  e.target.value
                );
                setExpenseErrors({
                  ...expenseErrors,
                  amount: ""
                });
              }}
            />

            {expenseErrors.amount && (
              <small className="error">
                {expenseErrors.amount}
              </small>
            )}

            <select
              value={expenseCategory}
              onChange={(e) => {
                setExpenseCategory(
                  e.target.value
                );
                setExpenseErrors({
                  ...expenseErrors,
                  category: ""
                });
              }}
            >

              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}

            </select>

            {expenseErrors.category && (
              <small className="error">
                {expenseErrors.category}
              </small>
            )}

            <button type="submit">
              Add Expense
            </button>

          </form>

          {/* EXPENSE SEARCH */}

          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={filterCategory}
            onChange={(e) =>
              setFilterCategory(
                e.target.value
              )
            }
          >

            <option value="All">
              All Categories
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}

          </select>

          {filteredExpenses.map(
            (expense) => (

              <div
                className="list-item"
                key={expense.id}
              >

                <div>

                  <strong>
                    {expense.title}
                  </strong>

                  <p>
                    {expense.category}
                  </p>

                </div>

                <div>

                  <strong>
                    ₹{expense.amount}
                  </strong>

                  <button
                    type="button"
                    onClick={() =>
                      deleteExpense(
                        expense.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            )
          )}

        </div>

        {/* CHART */}

        <div className="section-card">

          <h2>
            📊 Spending by Category
          </h2>

          {categoryData.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <PieChart>

                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >

                  {categoryData.map(
                    (entry, index) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip />
                <Legend />

              </PieChart>

            </ResponsiveContainer>

          ) : (

            <p>
              Add expenses to see the chart.
            </p>

          )}

        </div>

      </div>

    </div>
  );
}

export default App;
