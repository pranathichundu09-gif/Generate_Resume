from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from docxtpl import DocxTemplate, RichText
from io import BytesIO
import base64
import os
import re

app = FastAPI()


# ============================================================
# MODELS
# ============================================================
class GenerateRequest(BaseModel):
    context: dict


class GenerateResponse(BaseModel):
    filename: str
    docx_b64: str


# ============================================================
# MARKDOWN PARSER (Bold: **text**)
# ============================================================
def attempt_to_parse_markdown(text_value: str) -> RichText:
    rt = RichText()
    last_index = 0

    matches = list(re.finditer(r'\*\*(.*?)\*\*', text_value))

    if not matches:
        rt.add(text_value, font="Calibri", size=24)
        return rt

    for match in matches:
        start_of_match = match.start()

        if start_of_match > last_index:
            rt.add(text_value[last_index:start_of_match], font="Calibri", size=24)

        bold_text = match.group(1)
        if bold_text:
            rt.add(bold_text, bold=True, font="Calibri", size=24)

        last_index = match.end()

    if last_index < len(text_value):
        rt.add(text_value[last_index:], font="Calibri", size=24)

    return rt


# ============================================================
# CONTEXT PROCESSOR (Recursive)
# ============================================================
def process_context_for_richtext(context_data):

    if isinstance(context_data, str):
        return attempt_to_parse_markdown(context_data)

    if isinstance(context_data, list):
        return [process_context_for_richtext(item) for item in context_data]

    if isinstance(context_data, dict):
        return {key: process_context_for_richtext(value) for key, value in context_data.items()}

    return context_data


# ============================================================
# DOCX GENERATION ENDPOINT
# ============================================================
@app.post("/generate-docx/{template_path}", response_model=GenerateResponse)
def generate_docx(payload: GenerateRequest, template_path: str):

    template_path = f"./{template_path}".strip() + ".docx"

    if not os.path.exists(template_path):
        raise HTTPException(status_code=404, detail=f"Template not found: {template_path}")

    try:
        doc = DocxTemplate(template_path)

        # Convert ALL context text into RichText
        final_context = process_context_for_richtext(payload.context)
        final_context["r"] = lambda x: x

        # Render template
        doc.render(final_context)

        # ================================================
        # SAVE DOCX FILE LOCALLY IN PROJECT FOLDER
        # ================================================
        output_filename = "Generated_Document.docx"
        output_path = f"./{output_filename}"   # Saves beside main.py

        doc.save(output_path)
        print(f"Document saved at: {output_path}")

        # ================================================
        # SAVE TO BYTES FOR BASE64 RETURN
        # ================================================
        buffer = BytesIO()
        doc.save(buffer)
        buffer.seek(0)

        docx_b64 = base64.b64encode(buffer.read()).decode("utf-8")

        return GenerateResponse(
            filename=output_filename,
            docx_b64=docx_b64
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating document: {str(e)}")


# ============================================================
# HEALTH CHECK
# ============================================================
@app.get("/health")
def health():
    return {"ok": True}