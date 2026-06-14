from pydantic import BaseModel, Field


class TenderAnalysis(BaseModel):
    title: str
    deadline: str | None = Field(None, description="Submission deadline as found, ISO or Null")
    estimated_value: float | None = Field(None, description="Numeric estimated contract value, no currency symbol")
    currency: str | None = Field(None, description="ISO 4217 code, e.g. EUR, USD")
    procuring_entity: str | None = None
    subject_description: str
    evaluation_criteria: list[str] = Field(default_factory=list)
    key_requirements: list[str] = Field(default_factory=list)
