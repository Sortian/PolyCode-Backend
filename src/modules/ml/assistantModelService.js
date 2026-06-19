const { generateAssistantReply: generateGroqReply } = require("../chat/services/groqService");
const { generateAssistantReply: generateCustomReply } = require("./customModelService");
const {
  isPineconeConfigured,
  querySimilar,
  buildRagContext,
} = require("./pineconeService");

function getAssistantProvider() {
  return (process.env.ASSISTANT_PROVIDER || "groq").trim().toLowerCase();
}

async function maybeAugmentWithRag(messages) {
  if (process.env.PINECONE_RAG_ENABLED !== "true") {
    return messages;
  }
  if (!isPineconeConfigured()) {
    return messages;
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser?.content) return messages;

  try {
    const matches = await querySimilar(lastUser.content, { topK: 3 });
    const ragContext = buildRagContext(matches);
    if (!ragContext) return messages;

    const systemIndex = messages.findIndex((m) => m.role === "system");
    if (systemIndex === -1) {
      return [{ role: "system", content: ragContext }, ...messages];
    }

    const updated = [...messages];
    updated[systemIndex] = {
      role: "system",
      content: `${updated[systemIndex].content}\n\n${ragContext}`,
    };
    return updated;
  } catch (error) {
    console.warn("Pinecone RAG skipped:", error.message);
    return messages;
  }
}

/**
 * Single entry point for PolyMentor inference.
 * ASSISTANT_PROVIDER=groq | custom
 */
async function generateAssistantReply(messages) {
  const augmented = await maybeAugmentWithRag(messages);
  const provider = getAssistantProvider();

  if (provider === "custom") {
    return generateCustomReply(augmented);
  }

  return generateGroqReply(augmented);
}

module.exports = {
  getAssistantProvider,
  generateAssistantReply,
  maybeAugmentWithRag,
};
