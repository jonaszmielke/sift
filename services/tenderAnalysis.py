


import json
from config import client, MODEL
from schemas import TenderAnalysis

TENDER_SYSTEM_PROMPT = """You are a tender-analysis extractor. Read the procurement \
document text and extract structured fields.

Rules:
- Extract only what is present in the document. Do not invent or guess values.
- Use null for absent scalar fields; use an empty list for absent list fields.
- estimated_value: digits only (strip thousands separators and currency symbols); \
put the currency in the currency field.
- currency: ISO 4217 code (e.g. EUR, USD, PLN) when determinable.
- deadline: MUST be ISO 8601 (YYYY-MM-DD, or YYYY-MM-DDTHH:MM:SS if a time is \
given). If the document gives only a relative or non-convertible deadline (e.g. \
"14 days after signing") or none at all, use null. Never output free text here.
- evaluation_criteria: one entry per distinct criterion (e.g. "Price 60%", \
"Quality 40%").
- key_requirements: eligibility, mandatory technical, and documentation requirements, \
one per entry.

Respond with ONLY a single JSON object matching this schema. No markdown, no code \
fences, no commentary:
{schema}
""".replace("{schema}", json.dumps(TenderAnalysis.model_json_schema()))


def _strip_fences(s: str) -> str:
    s = s.strip()
    if s.startswith("```"):
        s = s.split("\n", 1)[1] if "\n" in s else s[3:]
        if s.endswith("```"):
            s = s[: -3]
    return s.strip()

async def runTenderAnalisis(text: str) -> TenderAnalysis | False:
    
    stream = await client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": TENDER_SYSTEM_PROMPT},
            {"role": "user", "content": text},
        ],
        stream=True,
    )
    
    parts: list[str] = []
    async for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            parts.append(delta)

    raw = _strip_fences("".join(parts))

    try:
        return TenderAnalysis.model_validate_json(raw)
    except ValueError:
        return False
