import asyncio
import io
import json

from fastapi import APIRouter, UploadFile, File, HTTPException
from pypdf import PdfReader

from config import client, MODEL
from schemas import TenderAnalysis

router = APIRouter()

TENDER_SYSTEM_PROMPT = """You are a tender-analysis extractor. Read the procurement \
document text and extract structured fields.

Rules:
- Extract only what is present in the document. Do not invent or guess values.
- Use null for absent scalar fields; use an empty list for absent list fields.
- estimated_value: digits only (strip thousands separators and currency symbols); \
put the currency in the currency field.
- currency: ISO 4217 code (e.g. EUR, USD, PLN) when determinable.
- deadline: prefer ISO YYYY-MM-DD (include time if given); else copy verbatim.
- evaluation_criteria: one entry per distinct criterion (e.g. "Price 60%", \
"Quality 40%").
- key_requirements: eligibility, mandatory technical, and documentation requirements, \
one per entry.

Respond with ONLY a single JSON object matching this schema. No markdown, no code \
fences, no commentary:
{schema}
""".replace("{schema}", json.dumps(TenderAnalysis.model_json_schema()))


def extractText(content: bytes):
    reader = PdfReader(io.BytesIO(content))
    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    return text


def _strip_fences(s: str) -> str:
    s = s.strip()
    if s.startswith("```"):
        s = s.split("\n", 1)[1] if "\n" in s else s[3:]
        if s.endswith("```"):
            s = s[: -3]
    return s.strip()


@router.post("/analyze")
async def analyze(file: UploadFile = File(...)) -> TenderAnalysis:
    content = await file.read()

    if not content.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail="File is not a PDF")

    text = await asyncio.to_thread(extractText, content)

    if not text.strip():
        raise HTTPException(status_code=422, detail="No text extracted from PDF")

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
        raise HTTPException(status_code=502, detail="Model returned invalid analysis")
