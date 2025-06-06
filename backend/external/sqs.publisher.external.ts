import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

export class SQSPublisher {
  private client: SQSClient;

  constructor(client: SQSClient) {
    this.client = client;
  }

  async send(queueUrl: string, payload: Record<string, any>) {
    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(payload),
    });

    return await this.client.send(command);
  }
}
