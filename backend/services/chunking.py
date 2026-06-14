from langchain_text_splitters import RecursiveCharacterTextSplitter

# ~800 tok * ~4 char/tok = 3200 chars; 100 tok overlap = 400 chars
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=3200,
    chunk_overlap=400,
    separators=["\n\n", "\n", ". ", " ", ""],
)

def chunk_text(text: str) -> list[str]:
    return text_splitter.split_text(text)