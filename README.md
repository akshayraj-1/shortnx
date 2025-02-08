# [WIP] Shortnx - URL Shortener

> [!WARNING] 
> This is a work in progress project. Some features may not be implemented yet.

This is a simple URL shortener that allows users to shorten their URLs. It is a simple Node.js project that uses EJS and MongoDB as the database.

**Check out the preview at:** [shortnx.in](https://shortnx.in)

## Quick Start
Follow these steps to run the project locally.

### Pre-requisites
- Node.js (v15 or higher)
- npm or yarn

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/akshayraj-1/shortnx.git
cd shortnx
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up the configuration file**
- Add your MongoDB URI and other required values in the `.env.development` and `.env.production` file.
- Add your `Google Client ID`, `Google Client Secret` for the [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2) authentication in the `.env.development` and `.env.production` file.

### Run the development server

```bash
npm run dev
```
_This will start the server by default locally at port 3939_


## Notes

- You may find the codebase a little bit overkill for a simple URL shortener. It was totally built for learning and experimentation purposes.
- Some of the features are still work in progress and may not work as expected.
- You may find some issues or bugs in the project. Please report them in the [Issues](https://github.com/akshayraj-1/shortnx/issues) section.