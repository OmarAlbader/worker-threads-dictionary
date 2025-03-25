const { parentPort } = require("worker_threads");
const https = require("https");

parentPort.on("message", (word) => {
  https.get(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const jsonResponse = JSON.parse(data);

          if (jsonResponse.title === "No Definitions Found") {
            parentPort.postMessage(`No definition found for "${word}".`);
          } else {
            const meaning =
              `${jsonResponse[0]?.meanings[0]?.definitions[0]?.definition}/\\${jsonResponse[0]?.meanings[0]?.definitions[1]?.definition}` ||
              "Meaning not available.";

            parentPort.postMessage(
              `Definition of "${word}":\n- ${meaning.split("/\\")[0] ?? ""}`
            );
          }
        } catch (err) {
          parentPort.postMessage("Error parsing API response.");
        }
      });
    }
  );
});
