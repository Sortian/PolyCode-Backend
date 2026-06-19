/**
 * Calls your own fine-tuned model endpoint (OpenAI-compatible API).
 * Deploy after training on HuggingFace, Replicate, Modal, or your GPU server.
 */
function getCustomModelConfig() {
  const baseUrl = process.env.CUSTOM_MODEL_BASE_URL?.trim();
  const apiKey = process.env.CUSTOM_MODEL_API_KEY?.trim() || "";
  const model = process.env.CUSTOM_MODEL_NAME?.trim() || "polymentor-finetuned";

  if (!baseUrl) {
    const err = new Error(
      "CUSTOM_MODEL_BASE_URL is not configured. Train and deploy your model first.",
    );
    err.statusCode = 503;
    err.code = "CUSTOM_MODEL_NOT_CONFIGURED";
    throw err;
  }

  const url = baseUrl.endsWith("/chat/completions")
    ? baseUrl
    : `${baseUrl.replace(/\/$/, "")}/chat/completions`;

  return { url, apiKey, model };
}

/**
 * @param {Array<{role: string, content: string}>} messages
 */
async function generateAssistantReply(messages) {
  const { url, apiKey, model } = getCustomModelConfig();

  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.3,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail =
      data?.error?.message ||
      data?.message ||
      `Custom model request failed (${response.status})`;
    const err = new Error(detail);
    err.statusCode = response.status;
    throw err;
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content || !String(content).trim()) {
    throw new Error("Custom model returned an empty response.");
  }

  return String(content).trim();
}

module.exports = { generateAssistantReply, getCustomModelConfig };
