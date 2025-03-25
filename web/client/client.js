async function handleSubmit(e) {
  e.preventDefault();
  const word = document.getElementById("wordInput").value;
  const dictionary = document.getElementById("dictionary");
  const submitButton = document.querySelector("button[type='submit']");

  submitButton.disabled = true;
  submitButton.style.backgroundColor = "gray";
  submitButton.style.cursor = "not-allowed";
  submitButton.innerText = "Fetching data...";

  try {
    const response = await fetch(`http://localhost:3000?word=${word}`);
    const data = await response.text();
    dictionary.innerText = data.split("-")[1] || data;
  } catch (error) {
    console.error("Error fetching data:", error);
    dictionary.innerText = "Error fetching data.";
  } finally {
    submitButton.disabled = false;
    submitButton.style.backgroundColor = "#007bff";
    submitButton.style.cursor = "pointer";
    submitButton.innerText = "Translate";
  }
}

// const net = require("net");
// const readline = require("readline");

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// function createClient() {
//   const client = new net.Socket();
//   let connected = false;

//   client.on("connect", () => {
//     connected = true;
//     console.log("Connected to server");
//     promptUser();
//   });

//   client.on("data", (data) => {
//     console.log(`\nServer response:\n${data.toString().trim()}\n`);
//     promptUser();
//   });

//   client.on("error", (err) => {
//     console.error("Client connection error:", err.message);
//     process.exit(1);
//   });

//   client.on("close", () => {
//     if (connected) {
//       console.log("Connection closed");
//     }
//     process.exit(0);
//   });

//   console.log("Attempting to connect to localhost:4000...");
//   client.connect(4000, "localhost");

//   return client;
// }

// function promptUser() {
//   rl.question("Enter message: ", (input) => {
//     if (client && !client.destroyed) {
//       if (input.trim().length === 0) promptUser();
//       client.write(input);
//     } else {
//       console.error("Not connected to server");
//       rl.close();
//     }
//   });
// }

// const client = createClient();
