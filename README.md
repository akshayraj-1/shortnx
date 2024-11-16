# [WIP] URL Shortener

> [!WARNING] 
> This is a work in progress project. Some features may not be implemented yet.

This is a simple URL shortener that allows users to shorten their URLs. It is a simple Node.js project that uses EJS and MongoDB as the database.


## Quick Start
Follow these steps to run the project locally.

### Pre-requisites
- Node.js (v15 or higher)
- npm or yarn

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/akshayraj-1/url-shortener.git
cd url-shortener
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up the configuration file**

- Add your MongoDB connection string and other required values in the `src/.env.development` or `src/.env.production` file.
- Add your firebase project configuration json file in the `src/configs/` folder with name `firebase-config.json`. Learn more about firebase configuration json file [here](https://firebase.google.com/docs/web/learn-more#config-object).
- Add your firebase service account json file in the `src/configs/` folder with name `firebase-service-account.json`. Learn more about firebase service account json file [here](https://firebase.google.com/docs/admin/setup#initialize_the_sdk).

### Run the development server

```bash
npm run dev
```
_This will start the server by default locally at port 3939_
