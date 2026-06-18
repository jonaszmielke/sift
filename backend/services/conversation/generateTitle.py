from config import client, MODEL

async def generate_title(message: str) -> str:
    prompt = [
        {"role": "system", "content":
            "Create a short chat title (max 6 words) summarizing the user's message. "
            "Reply with ONLY the title — no quotes, no trailing punctuation."},
        {"role": "user", "content": message},
    ]
    stream = await client.chat.completions.create(model=MODEL, messages=prompt, stream=True)
    parts = []
    async for chunk in stream:
        d = chunk.choices[0].delta.content
        if d:
            parts.append(d)
    return "".join(parts).strip().strip('"')[:80]
