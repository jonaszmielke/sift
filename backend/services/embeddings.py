from config import embedding_client, EMBEDDING_MODEL
  
async def embed_text(text: str) -> list[float]:
    resp = await embedding_client.embeddings.create(model=EMBEDDING_MODEL, input=text)
    return resp.data[0].embedding
    
async def embed_batch(texts: list[str]) -> list[list[float]]:
    resp = await embedding_client.embeddings.create(model=EMBEDDING_MODEL, input=texts)
    return [d.embedding for d in resp.data]