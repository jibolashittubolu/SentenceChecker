from app.api.v1.mainV1 import v1
from app.api.v2.mainV2 import v2

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import language_tool_python
from typing import List

app = FastAPI()
tool = language_tool_python.LanguageTool('en-US')
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the version 1 application
# app.mount("/api/v1", v1)
 
# Mount the version 2 application
# app.mount("/api/v2", v2)

class SentenceRequest(BaseModel):
    text: str

class CorrectionDetail(BaseModel): 
    incorrect: str
    correction: str
    start_index: int
    end_index: int

class CorrectionResponse(BaseModel):
    correctedText: str
    corrections: List[CorrectionDetail]
    originalText: str

@app.post("/api/v1/sentenceChecker/checkSentence", response_model=CorrectionResponse)
async def correct_sentence(request: SentenceRequest):
    try:
        matches = tool.check(request.text)
        correctedText = language_tool_python.utils.correct(request.text, matches)
        
        corrections = []
        for match in matches:
            corrections.append(CorrectionDetail(
                incorrect=request.text[match.offset:match.offset + match.errorLength],
                correction=match.replacements[0] if match.replacements else "",
                start_index=match.offset,
                end_index=match.offset + match.errorLength
            ))
        
        return CorrectionResponse(correctedText=correctedText, corrections=corrections, originalText=request.text)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # config = uvicorn.Config("main:app", port=5001, log_level="info")
    # server = uvicorn.Server(config)
    # server.run()
    uvicorn.run(app, host="0.0.0.0", port=8000)


