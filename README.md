# eDeaf Admin Frontend

## Requirements

* Node.js
* npm

## Install

Open a terminal in the project folder and run:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_CLIENT_ID=your_client_id
VITE_CLIENT_SECRET=your_client_secret
VITE_SCOPE=your_scope
```

Make sure the API URL in `src/api/api.js` points to the correct backend.

## Run

Start the app with:

```bash
npm run dev
```

Then open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```
