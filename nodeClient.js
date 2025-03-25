const net = require("net");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function createClient() {
  const client = new net.Socket();
  let connected = false;

  client.on("connect", () => {
    connected = true;
    console.log("Connected to server");
    promptUser();
  });

  client.on("data", (data) => {
    console.log(`\nServer response:\n${data.toString().trim()}\n`);
    promptUser();
  });

  client.on("error", (err) => {
    console.error("Client connection error:", err.message);
    process.exit(1);
  });

  client.on("close", () => {
    if (connected) {
      console.log("Connection closed");
    }
    process.exit(0);
  });

  console.log("Attempting to connect to localhost:4000...");
  client.connect(4000, "localhost");

  return client;
}

function promptUser() {
  rl.question("Enter message: ", (input) => {
    if (client && !client.destroyed) {
      if (input.trim().length === 0) promptUser();
      client.write(input);
    } else {
      console.error("Not connected to server");
      rl.close();
    }
  });
}

const client = createClient();
