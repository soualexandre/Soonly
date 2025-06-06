import { sqsClient } from "../config/sqs.config";
import { SQSConsumer } from "../external/sqs.consumer.external";

const client = sqsClient;
const consumer = new SQSConsumer(client, process.env.SQS_QUEUE_URL!);

async function handleMessage(data: any) {
  try {
    const parsed = JSON.parse(data.Body);
    console.log("📨 Mensagem recebida:", parsed);

    switch (parsed.type) {
      case "REMINDER_CREATED":
        console.log("🎬 Enviando lembrete de filme:", parsed.payload.movieId);
        // Aqui você pode chamar um serviço de notificação, email, etc.
        break;

      default:
        console.warn("⚠️ Tipo de mensagem desconhecido:", parsed.type);
        break;
    }

  } catch (error) {
    console.error("❌ Erro ao processar mensagem:", error);
  }
}

async function start() {
  console.log("🚀 Worker Reminder iniciado...");
  while (true) {
    try {
      await consumer.poll(handleMessage);
    } catch (error) {
      console.error("🔥 Erro no polling do SQS:", error);
      await new Promise(res => setTimeout(res, 5000)); 
    }
  }
}

start();
