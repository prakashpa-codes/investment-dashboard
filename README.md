# Investment Dashboard POC - Angular

This project is a responsive Investment Dashboard built using **Angular 19.1.3**. It features **data visualization**, **dynamic charts**, and **interactive tables** to manage investment data effectively. The application also includes **export functionality (CSV, Excel, PDF)**, **sorting, filtering, pagination**, and **responsive design for mobile and desktop views**.

---

## 🚀 Features

- **📊 Interactive Charts:** Uses `ng2-charts` (Chart.js) for:
  - **Net Worth Progression (Line Chart)** - Tracks cumulative net worth over time.
  - **Category Distribution (Pie Chart)** - Shows investment distribution by category.
  - **ROI Over Time (Line Chart)** - Displays return on investment trends.
  - **Investment vs Gain Comparison (Stacked Bar Chart)** - Compares investment amount vs. gains.
- **🏦 Investment Management:** Add, edit, and delete investment records with real-time updates.
- **📄 Data Table:** Displays all investments with sorting, filtering, and pagination.
- **📱 Fully Responsive UI:** 
  - **Desktop:** Side-by-side charts, fixed sidebar, investment table.
  - **Mobile:** Collapsible sidebar, stacked layout, dropdown for chart selection.
- **📤 Export Data:** Download investment data in **CSV, Excel, or PDF format**.
- **🏗 Mock Database:** Uses `json-server` to serve investment data.

---

## 🛠️ Technologies Used

- **Angular 19.1.3** (Frontend framework)
- **Angular Material** (UI components)
- **Chart.js + ng2-charts** (Charts and graphs)
- **JSON Server** (Mock API for data management)
- **RxJS** (Reactive programming)
- **TypeScript** (Strongly typed JavaScript)
- **SCSS/CSS** (Responsive styling)
- **Material Icons** (Icons for actions)

---

## Prerequisites
Ensure you have the following installed:
- **Node.js** (Download: https://nodejs.org/)
- **Angular CLI**  
  Install globally using:
  ```bash
  npm install -g @angular/cli
  ```
- **JSON Server** (For mock API)  
  Install globally using:
  ```bash
  npm install -g json-server
  ```
  ---

## 📌 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/prakashpa-codes/investment-dashboard.git
cd investment-dashboard
```

## **2️⃣ Install Dependencies**
Run the following inside your project folder:
```bash
npm install
```
This will install all necessary dependencies, including JSON Server.

### 3️⃣ Start the Application & Mock Database

```bash
npm start
```

This will:
- Start Angular app at `http://localhost:4200` (Port may vary)
- Run JSON Server at `http://localhost:3000/investments` (Port may vary)
- If your json server is running in different port, please update the port value (default 3000) in src/app/services/investment.service.ts file.

Alternatively, if running separately:

# Start Angular app only
```bash
ng serve
```
# Start JSON Server separately
```bash
json-server --watch src/assets/mock-data/db.json --port 3000
```

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## 📜 Additional Notes
- **GitHub Repository:** [https://github.com/prakashpa-codes]
- **Author:** Prakash Pa
- **License:** MIT
