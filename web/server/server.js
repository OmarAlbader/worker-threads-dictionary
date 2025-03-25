const http = require("http");
const { Worker, isMainThread } = require("worker_threads");
const os = require("os");

if (isMainThread) {
  const PORT = 3000;
  const WORKER_COUNT = os.cpus().length || 4;
  const workers = [];
  const taskQueue = [];

  for (let i = 0; i < WORKER_COUNT; i++) {
    const worker = new Worker("./worker.js");
    workers.push({ worker, busy: false });
  }

  function getIdleWorker() {
    return workers.find((worker) => !worker.busy);
  }

  function assignTaskWorker(task, res) {
    const idleWorker = getIdleWorker();

    if (!idleWorker) {
      console.log("All workers are busy, adding task to the queue.");
      taskQueue.push({ task, res });
      return;
    }

    idleWorker.busy = true;
    idleWorker.worker.postMessage(task);

    idleWorker.worker.once("message", (message) => {
      console.log(`Worker finished task: ${task}`);
      idleWorker.busy = false;

      res.writeHead(200, {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      });
      res.end(message);

      if (taskQueue.length > 0) {
        const nextTask = taskQueue.shift();
        assignTaskWorker(nextTask.task, nextTask.res);
      }
    });
  }

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const word = url.searchParams.get("word");

    if (word) {
      console.log(`Received task: ${word}`);
      assignTaskWorker(word, res);
    } else {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Bad Request");
    }
  });

  server.on("error", (err) => {
    console.error("Server error:", err.message);
    process.exit(1);
  });

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
} else {
  console.error("This script should be only run in the main thread.");
}
