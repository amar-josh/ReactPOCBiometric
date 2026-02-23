# STP Portal

## 🚀 Getting Started

This guide will help you set up and run the **STP Portal** project locally.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: It's recommended to use the latest LTS (v22.15.00) version. You can download it from the official [Node.js website](https://nodejs.org/).
- **npm**: The Node Package Manager is installed with Node.js.

### Installation

1.  **Clone the Repository**
    To get a local copy of the project, use the following command:

    ```bash
    git clone https://cloud-devops.bandhanbank.co.in/insta-services/app/artemis/stp-portal.git
    ```

2.  **Navigate to the Project Directory**
    Change to the project's directory:

    ```bash
    cd stp-portal
    ```

3.  **Install Dependencies**
    Install all the required packages:

    ```bash
    npm install
    ```

---

### ✅ Todo Before Raising PR

Before submitting a pull request, please ensure the following steps are completed:

1. **Format the Code - Ensures consistent code style across the project.**

   ```bash
   npm run format
   ```

2. **Make sure all test cases pass successfully.**

   ```bash
   npm run test

   ```

3. **Verify that a production-ready build can be created without errors.**
   ```bash
   npm run build
   ```

---

## 💻 Available Scripts

In the project directory, you can run the following commands:

- **`npm run dev`**
  Starts the development server and opens the application in your browser. It includes hot-reloading for a seamless development experience.

- **`npm run build`**
  Creates a production-ready build of the application in the `dist` directory. This command first compiles the TypeScript files (`tsc -b`) and then builds the project with Vite.

- **`npm run preview`**
  Serves the production build locally. This is useful for checking the build before deployment.

- **`npm run test`**
  Runs the unit tests using Vitest.

- **`npm run test:watch`**
  Starts the test runner in watch mode. It reruns tests whenever a file changes.

- **`npm run coverage`**
  Generates a test coverage report, showing how much of your code is covered by tests. The report is displayed in the terminal.

---

## 📝 Additional Commands

- **`npm run lint`**
  Runs ESLint to check for code quality and potential errors.

- **`npm run lint:fix`**
  Automatically fixes all fixable issues reported by ESLint.

- **`npm run format`**
  Formats the code using Prettier to ensure consistent code style across the project.
