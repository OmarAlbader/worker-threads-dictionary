const { Worker, isMainThread } = require("worker_threads");
const net = require("net");
const os = require("os");

if (isMainThread) {
  const PORT = 4000;
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

  function assignTaskWorker(task, socket) {
    const idleWorker = getIdleWorker();

    if (!idleWorker) {
      console.log("All workers are busy, adding task to the queue.");
      taskQueue.push({ task, socket });
      return;
    }

    idleWorker.busy = true;
    idleWorker.worker.postMessage(task);

    idleWorker.worker.once("message", (message) => {
      console.log(`Worker finished task: ${task}`);
      idleWorker.busy = false;

      socket.write(message);

      if (taskQueue.length > 0) {
        const nextTask = taskQueue.shift();
        assignTaskWorker(nextTask.task, nextTask.socket);
      }
    });
  }

  const server = net.createServer((socket) => {
    console.log("Client connected:", socket.remoteAddress, socket.remotePort);

    socket.on("data", (data) => {
      const task = data.toString().trim();
      console.log(`Received task: ${task}`);
      assignTaskWorker(task, socket);
    });

    socket.on("end", () => {
      console.log(
        "Client disconnected:",
        socket.remoteAddress,
        socket.remotePort
      );
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err.message);
    });
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
