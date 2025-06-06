import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";

export class SQSConsumer {
  private client: SQSClient;
  private queueUrl: string;

  constructor(client: SQSClient, queueUrl: string) {
    this.client = client;
    this.queueUrl = queueUrl;
  }

  async poll(handler: (body: any) => Promise<void>) {
    const command = new ReceiveMessageCommand({
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,
    });

    const response = await this.client.send(command);

    if (response.Messages) {
      for (const message of response.Messages) {
        try {
          const body = JSON.parse(message.Body!);

          await handler(body);
          await this.client.send(
            new DeleteMessageCommand({
              QueueUrl: this.queueUrl,
              ReceiptHandle: message.ReceiptHandle!,
            })
          );

          console.log("✅ Mensagem removida da fila com sucesso.");
        } catch (err) {
          console.error("❌ Erro ao processar mensagem:", err);
        }
      }
    }
  }
}
