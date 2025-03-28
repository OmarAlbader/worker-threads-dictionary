# Distributed Dictionary Lookup System

A distributed system for dictionary word lookups that demonstrates the use of Node.js worker threads to handle concurrent client requests. The project offers two client interfaces: a web-based version and a command-line version.

## Project Overview

This system uses a Node.js server with worker threads to distribute dictionary lookup tasks. The worker threads query an external dictionary API and return definitions to clients. The architecture demonstrates principles of distributed systems including concurrency, load balancing, and task queuing.

## Features

- Multi-threaded server using Node.js worker threads
- Task queue for managing requests when all workers are busy
- Web client interface with responsive design
- Command-line client interface
- External dictionary API integration

## Prerequisites

- Node.js (v14.0.0 or later)
- npm (Node Package Manager)
- Web browser (for web client)

## Project Structure

```
.
├── dictionary-electron/ # Desktop application
│ ├── assets/
│ │ └── icons/ # Application icons
│ ├── main.js # Electron main process
│ ├── preload.js # Preload script for security
│ ├── renderer.js # UI logic
│ ├── index.html # Application UI
│ ├── styles.css # Application styling
│ └── package.json # Electron app configuration
├── web/
│ ├── client/
│ │ ├── client.js # Web client JavaScript
│ │ ├── index.html # Web client HTML interface
│ │ └── styles.css # Web client styling
│ └── server/
│ ├── server.js # Web Multi-threaded server
│ └── worker.js # Web Worker thread implementation
├── nodeClient.js # Command-line client
├── nodeServer.js # Multi-threaded server
├── worker.js # Worker thread implementation
└── README.md # Project documentation
```

## Installation

1. Clone the repository:

```bash
   git clone https://github.com/OmarAlbader/worker-threads-dictionary.git
   cd worker-threads-dictionary
```

2. No additional installation is needed as the project uses Node.js built-in modules.

## Running the Application

### Desktop Version (electron.js)

1. start the server:

```bash
    node nodeServer.js
```

2. go to (dictionary-electron) folder

```bash
    cd dictionary-electron
```

3. download dependancies:

```bash
    npm install
```

4. start desktop app:

```bash
    npm start
```

### Web Version

1. go to web -> server folder

```bash
cd web/server
```

2. Start the server:

```bash
    node server.js
```

3. Serve the web client:

- Using VS Code Live Server extension
- Or any other local development server
- Open `client/index.html` in your browser

4. Enter a word in the input field and click "Translate" to see its definition.

### Command-line Version

1. Start the server (if not already running)

```bash
node nodeServer.js
```

2. In a separate terminal, start the command-line client:

```bash
node nodeClient.js
```

3. Follow the prompts to enter words for definition lookup.

## How It Works

1. The server initializes worker threads based on the number of CPU cores available.
2. When a request comes in, the server assigns it to an idle worker.
3. If all workers are busy, the request is added to a queue.
4. Workers fetch definitions from a dictionary API and return results to clients.
5. The server properly handles the message flow between clients and workers.

## Limitations

- The system currently only supports English language lookups
- External API dependency may affect reliability

## Future Enhancements

- Support for multiple languages
- Local caching of common lookups
- Rate limiting for API requests
- Authentication for user-specific history

## External API

This project uses the [Free Dictionary API](https://dictionaryapi.dev/) to fetch word definitions.

## Troubleshooting

- **Server won't start**: Ensure port 4000 is available and not in use by another application
- **Client can't connect**: Check that the server is running and accessible
- **No definitions returned**: Verify internet connectivity and API availability

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

[Omar Albader](https://github.com/OmarAlbader)
