# PolyMentor ML pipeline

This folder holds exports and scripts for training your own assistant from the MongoDB `prompts` collection.

## Data fields used

| Field | Use |
|--------|-----|
| `userMessage` | User question / input |
| `assistantMessage` | PolyMentor reply |
| `liked` | `true` = good example, `false` = bad example, `null` = not rated |

## Quick start

```bash
cd backend

# 1) Export training files from MongoDB
npm run ml:export-training

# Preview only
npm run ml:export-training -- --dry-run

# Only rows with like/dislike feedback
npm run ml:export-training -- --rated-only

# Only liked rows (best quality SFT data)
npm run ml:export-training -- --liked-only
```

Output: `ml/exports/<timestamp>/`

- `raw.json` — all three fields
- `sft.jsonl` — supervised fine-tuning (chat format)
- `preference.jsonl` — liked/disliked rows for preference training
- `stats.json` — counts

## Pinecone (RAG — retrieval, not fine-tuning)

```bash
npm run ml:sync-pinecone -- --dry-run
npm run ml:sync-pinecone
```

Set in `.env`:

```
PINECONE_API_KEY=...
PINECONE_INDEX_HOST=your-index-xxxx.svc.us-east-1.pinecone.io
PINECONE_NAMESPACE=polymentor
OPENAI_API_KEY=...                    # embeddings
PINECONE_RAG_ENABLED=true             # inject similar chats at inference time
```

## Switch from Groq to your own model

After you train and deploy an OpenAI-compatible endpoint:

```
ASSISTANT_PROVIDER=custom
CUSTOM_MODEL_BASE_URL=https://your-server/v1
CUSTOM_MODEL_API_KEY=optional
CUSTOM_MODEL_NAME=polymentor-finetuned
```

## Roadmap

1. Collect prompts + likes (done — MongoDB `prompts`)
2. Export `sft.jsonl` / `preference.jsonl` (done — `npm run ml:export-training`)
3. Fine-tune on HuggingFace / Modal / GPU server (your ML team)
4. Optional: sync liked chats to Pinecone for RAG (done — `npm run ml:sync-pinecone`)
5. Deploy custom endpoint and set `ASSISTANT_PROVIDER=custom`

See `docs/POLYMENTOR_MLOPS.md` for the full architecture guide.
