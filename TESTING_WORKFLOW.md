# 🧪 Pump Manager QA & Financial Testing Workflow

This document provides a rigorous, step-by-step workflow to guarantee that your financial calculations, inventory state, and dashboard UI are 100% accurate before you launch to production.

We have structured this specifically around real-world business flows: injecting cash, buying from suppliers (both cash and credit), selling to customers, and edge-cases.

---

## 🛑 Prerequisites Before Testing

1. **Empty State:** Make sure your database is completely wiped or use a dedicated "staging" database. Your Cash Balance, Sales, Expenses, and Inventories should all read `0`.
2. **Setup Initial Status (Parties):**
   - Go to **Parties** -> Add `Customer`: "Test Transport Co".
   - Go to **Parties** -> Add `Supplier`: "Test Oil Supplier".

---

## Phase 1: Startup & Cash Operations

### Test 1: Initial Injection of Business Funds

- **Action:** Create a **Cash In (Other)** transaction of `Rs. 1,000,000` (1 Million).
- **Expected UI Result (Dashboard):**
  - Cash Balance = `Rs. 1,000,000`
  - Today's Net = Depends on logic, but likely `+ 1,000,000`.

### Test 2: Standard Cash Purchase from Supplier

- **Action:** Create a **Fuel Purchase** of `3,000 Liters` of Petrol at `Rs. 250` per liter (`Rs. 750,000` total). Leave "Party" empty (Cash transaction).
- **Expected UI Result (Dashboard):**
  - Cash Balance drops by `750,000` (New Balance: `Rs. 250,000`).
  - Inventory Status for Petrol goes up to `3,000 L`.
  - Petrol Avg Cost reads `Rs. 250.00`.
  - "Today's Expenses" increases by `Rs. 750,000`.

### Test 3: Standard Cash Sale to Walk-in Customer

- **Action:** Create a **Fuel Sale** of `1,000 Liters` of Petrol at `Rs. 280` per liter. Leave "Party" empty.
- **Expected UI Result (Dashboard):**
  - Today's Sales = `Rs. 280,000`.
  - Petrol stock decreases to `2,000 L`.
  - Cash Balance goes up by `280,000` (New Balance: `Rs. 530,000`).

---

## Phase 2: Supplier & Customer Credit Scenarios (Accounts Payable/Receivable)

### Test 4: Credit Purchase from Supplier (Accounts Payable)

- **Problem Context:** You buy fuel but haven't paid the supplier yet. Your physical cash shouldn't drop.
- **Action:**
  1. Create a **Fuel Purchase** of `2,000 Liters` of Diesel at `Rs. 260`.
  2. **Crucial:** Select the **Party** "Test Oil Supplier".
- **Expected UI Result:**
  - Inventory for Diesel goes up to `2,000 L`.
  - **Cash Balance:** Remains UNCHANGED. (You haven't paid them yet).
  - **Parties Page:** "Test Oil Supplier" balance should show **"We owe Rs. 520,000"**.

### Test 5: Credit Sale to Customer (Accounts Receivable)

- **Problem Context:** A transport company fills up, but will pay at the end of the month.
- **Action:**
  1. Create a **Fuel Sale** of `500 Liters` of Diesel using the Party "Test Transport Co".
  2. Value: `Rs. 145,000` (`500L @ Rs. 290`).
- **Expected UI Result:**
  - Inventory for Diesel drops to `1,500L`.
  - Today's Sales go up by `145,000` (It is still legally a sale).
  - **Cash Balance:** Remains UNCHANGED.
  - **Parties Page:** "Test Transport Co" balance should say **"They owe Rs. 145,000"**.

### Test 6: Paying the Supplier (Settling Debt)

- **Action:** Create a **Cash Out (Other)** transaction for `Rs. 200,000` and select "Test Oil Supplier".
- **Expected UI Result:**
  - Cash Balance drops by `200,000`.
  - **Parties Page:** Supplier balance drops from "We owe 520,000" to "We owe 320,000".

---

## Phase 3: Margin & Math Edge Cases 🚨

### Test 7: The moving "Average Cost" test

- **Problem Context:** Fuel prices change. If you mix old cheap stock with new expensive stock, does the software calculate the correct cost basis to prevent margin loss?
- **Action:**
  1. You currently have `2,000L` Petrol @ `Rs. 250` = `Rs. 500,000` value.
  2. Buy another `1,000L` Petrol @ `Rs. 300` per liter = `Rs. 300,000`. Leave Party blank.
- **The Math:** Total value = `500,000 + 300,000 = 800,000`. Total Liters = `3,000L`. Avg cost = `800,000 / 3,000 = 266.67`.
- **Expected UI Result:** Petrol Avg Cost _must_ show exactly `Rs. 266.67`.

### Test 8: Timezone & "Midnight Roll-over" test

- **Action:** Create a back-dated transaction for **Yesterday** (Change date in UI).
- **Expected UI Result:**
  - "Today's Sales/Net/Expenses" remain UNCHANGED.
  - "Cash Balance" updates accordingly (since it's an all-time total).

### Test 9: Zero, Negative & Threshold Stress Testing

- **Action 1:** Attempt to sell `0` liters, `-100` liters, or `-20` price.
  - _Expectation:_ UI/Backend rejects it.
- **Action 2:** Make Diesel stock exactly `500L` (if alert threshold is 500).
  - _Expectation:_ "Low Stock Alerts" immediately triggers on the dashboard.

---

## Phase 4: Final Financial Reconciliation

Before going live, take a calculator and do the following math directly from the dashboard:

1. **Calculate Expected Physical Cash:**
   _(Total Cash Ins + Cash Sales + Received from Customers)_ MINUS _(Total Cash Outs + Cash Purchases + Paid to Suppliers)_ = **Dashboard Cash Balance**.
2. **Gross Margin Check:**
   Current stock L \* "Avg Cost" = Total monetary investment sitting in underground tanks.
3. **Daily Performance Net:**
   Is "Today's Net" accurately calculating: `Today's Sales - Today's Expenses - Cost of Goods Sold for today`?
