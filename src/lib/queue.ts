import { Queue, Worker, QueueEvents, Job } from "bullmq";
import { redis } from "./redis";

const QUEUE_NAME = "sarvottam-background-jobs";

// Create the Queue
export const backgroundQueue = new Queue(QUEUE_NAME, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

// Setup Queue Events for monitoring
export const queueEvents = new QueueEvents(QUEUE_NAME, {
  connection: redis,
});

queueEvents.on("completed", ({ jobId }) => {
  console.log(`Job ${jobId} completed successfully`);
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.error(`Job ${jobId} failed: ${failedReason}`);
});

// Define Job Payloads
export type JobPayload =
  | { type: "SEND_EMAIL"; to: string; subject: string; body: string }
  | { type: "GENERATE_AI_REPORT"; projectId: string }
  | { type: "PROCESS_DOCUMENT"; documentId: string };

// Push to queue helper
export const enqueueJob = async (name: string, payload: JobPayload) => {
  return backgroundQueue.add(name, payload);
};

// Initialize Worker (Only in a separate process or edge function ideally)
// In a Next.js environment, it's better to run workers in a separate custom server or cron.
// But for development simplicity, we can conditionally run it.
let worker: Worker | null = null;

if (process.env.RUN_WORKER === "true" && typeof window === "undefined") {
  worker = new Worker(
    QUEUE_NAME,
    async (job: Job<JobPayload>) => {
      const data = job.data;

      switch (data.type) {
        case "SEND_EMAIL":
          console.log(`Sending email to ${data.to}`);
          // Add SendGrid/Resend logic here
          break;
        case "GENERATE_AI_REPORT":
          console.log(`Generating AI report for project ${data.projectId}`);
          // Add long-running AI logic here
          break;
        case "PROCESS_DOCUMENT":
          console.log(`Processing document ${data.documentId}`);
          // Add OCR or chunking logic here
          break;
        default:
          throw new Error("Unknown job type");
      }
    },
    { connection: redis }
  );

  worker.on("failed", (job, err) => {
    console.error(`Worker failed on job ${job?.id}:`, err);
  });
}

export { worker };
