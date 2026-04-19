import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { createSaasServer } from "./app.js";

const bootstrap = async () => {
  await connectDb();
  const { server } = createSaasServer();

  server.listen(env.port, () => {
    console.log(`CampusSync SaaS backend listening on ${env.port}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
