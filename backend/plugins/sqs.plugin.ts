import fp from "fastify-plugin";
import { sqsClient } from "../config/sqs.config";
import { SQSConsumer } from "../external/sqs.consumer.external";
import { SqsHandlerService } from "../utils/sqs.hundler";
export default fp(async (fastify, opts) => {
  const client = sqsClient;
  const queueUrl = process.env.SQS_QUEUE_URL!;
  const consumer = new SQSConsumer(client, queueUrl);
  const handler = new SqsHandlerService();

  fastify.decorate("sqs", sqsClient);

  const pollContinuously = async () => {
    while (true) {
      await consumer.poll(async (body) => {
        await handler.handleMessage(body);
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  pollContinuously().catch((err) => {
    fastify.log.error('Erro ao iniciar consumidor SQS:', err);
  });
});

declare module "fastify" {
  interface FastifyInstance {
    sqs: typeof sqsClient;
  }
}
