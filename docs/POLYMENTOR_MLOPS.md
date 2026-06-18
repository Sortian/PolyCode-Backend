# PolyMentor: MongoDB → fine-tuned model (MLOps guide)

## Goal

Use real PolyMentor chats from MongoDB (`prompts` collection) to improve the assistant and eventually **replace Groq** with **your own model**.

Training fields:

- `userMessage`
- `assistantMessage`
- `liked` (`true` = like, `false` = dislike, `null` = not rated)

---

## What is MLOps?

**MLOps** = DevOps for machine learning. It is the process and tooling to take a model from **data → training → deployment → monitoring** reliably.

| Stage | What you do | PolyMentor example |
|--------|-------------|-------------------|
| **Data** | Collect & version datasets | MongoDB `prompts`, export via `npm run ml:export-training` |
| **Train** | Fine-tune on your data | Upload `sft.jsonl` to HuggingFace / Modal / your GPU |
| **Evaluate** | Measure quality | Compare liked rate, human review, vs Groq baseline |
| **Deploy** | Serve the model | OpenAI-compatible API (`CUSTOM_MODEL_BASE_URL`) |
| **Monitor** | Track drift & errors | Log failures, re-export monthly, retrain |

MLOps helps your leader because training is **repeatable**: every week you can export new prompts, retrain, deploy v2, and roll back if quality drops.

---

## What is Pinecone?

**Pinecone** is a **vector database**. It does **not** fine-tune a model by itself.

It stores **embeddings** (numeric fingerprints of text). When a user asks a question, you:

1. Embed the question
2. Search Pinecone for **similar past chats** (especially `liked: true`)
3. Inject those examples into the prompt (**RAG** = Retrieval Augmented Generation)

```
User question → embed → Pinecone search → top 3 liked Q&A pairs → Groq/custom model
```

**Why your leader mentioned it:**

- **Fine-tuning** teaches the model your *style* and patterns
- **Pinecone RAG** gives the model *fresh, specific examples* from your database at answer time

Most production assistants use **both**: fine-tuned model + Pinecone retrieval.

---

## Important: Groq vs Grok vs fine-tuning

| Name | What it is |
|------|------------|
| **Groq** | Fast **inference** API (Llama, etc.). You use it now in `groqService.js`. |
| **Grok** | xAI’s model brand. Fine-tuning access may be limited. |
| **Fine-tuning** | Training a copy of a base model on your `sft.jsonl`. Usually done on **HuggingFace**, **OpenAI**, **Modal**, or your own GPU — not inside Groq. |

Typical path for PolyMentor:

1. Export data from MongoDB (implemented)
2. Fine-tune **Llama 3** or similar on `sft.jsonl` (liked rows)
3. Use `preference.jsonl` for a second **preference / DPO** stage (optional)
4. Deploy model behind `CUSTOM_MODEL_BASE_URL`
5. Set `ASSISTANT_PROVIDER=custom` in `.env`

---

## What we implemented in the backend

### 1. Training export

```bash
npm run ml:export-training
npm run ml:export-training -- --liked-only
npm run ml:export-training -- --dry-run
```

Files in `ml/exports/<timestamp>/`:

- `raw.json` — `{ userMessage, assistantMessage, liked }`
- `sft.jsonl` — chat fine-tuning format (default: `liked === true` only)
- `preference.jsonl` — liked/disliked rows for preference training
- `stats.json` — counts

### 2. Pinecone sync (RAG)

```bash
npm run ml:sync-pinecone -- --dry-run
npm run ml:sync-pinecone
```

Requires `PINECONE_API_KEY`, `PINECONE_INDEX_HOST`, `OPENAI_API_KEY` (embeddings).

Enable at inference:

```
PINECONE_RAG_ENABLED=true
```

### 3. Model router

`assistantModelService.js` is now used by PolyMentor chat:

- `ASSISTANT_PROVIDER=groq` (default) — current behavior
- `ASSISTANT_PROVIDER=custom` — your fine-tuned endpoint
- Optional Pinecone RAG before either provider

---

## Recommended training strategy

### Step A — Build a quality dataset

```bash
npm run ml:export-training -- --liked-only
```

Use **liked** rows first. They are your gold standard.

Disliked rows go to `preference.jsonl` for “don’t answer like this” training.

### Step B — Fine-tune (example: HuggingFace)

1. Upload `sft.jsonl` to HuggingFace datasets
2. Fine-tune `meta-llama/Llama-3.1-8B-Instruct` (or 70B if you have GPU budget)
3. Evaluate on a held-out set of prompts
4. Deploy with vLLM / TGI / Modal

### Step C — Pinecone for RAG

1. Create Pinecone index (dimension **1536** for `text-embedding-3-small`)
2. `npm run ml:sync-pinecone`
3. `PINECONE_RAG_ENABLED=true`

### Step D — Cut over from Groq

```env
ASSISTANT_PROVIDER=custom
CUSTOM_MODEL_BASE_URL=https://your-deploy/v1
CUSTOM_MODEL_NAME=polymentor-finetuned
```

Keep Groq as fallback until quality is proven.

---

## Environment variables

```env
# Training export — uses existing MongoDB
MONGODB_URI=...

# Pinecone RAG
PINECONE_API_KEY=...
PINECONE_INDEX_HOST=your-index.svc.region.pinecone.io
PINECONE_NAMESPACE=polymentor
OPENAI_API_KEY=...                       # embeddings only
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
PINECONE_RAG_ENABLED=false

# Inference provider
ASSISTANT_PROVIDER=groq                  # groq | custom
GROQ_API_KEY=...

# After fine-tune deploy
CUSTOM_MODEL_BASE_URL=https://your-host/v1
CUSTOM_MODEL_API_KEY=optional
CUSTOM_MODEL_NAME=polymentor-finetuned
```

---

## Next steps for your team

1. Run `npm run ml:export-training -- --dry-run` and confirm row counts
2. Aim for **500+ liked** rows before serious fine-tuning
3. Create Pinecone index + run `ml:sync-pinecone`
4. Fine-tune on HuggingFace/Modal (ML engineer task)
5. A/B test: Groq vs custom model on same prompts
6. Switch `ASSISTANT_PROVIDER=custom` when liked-rate is equal or better

---

## File map

```
backend/
  src/modules/ml/
    mlTrainingDataService.js   # MongoDB → training formats
    embeddingService.js        # OpenAI embeddings
    pineconeService.js         # upsert + query + RAG context
    customModelService.js      # your fine-tuned endpoint
    assistantModelService.js   # groq | custom + optional RAG
  scripts/
    export-training-data.js
    sync-prompts-pinecone.js
  ml/exports/                  # generated datasets (gitignored)
```
