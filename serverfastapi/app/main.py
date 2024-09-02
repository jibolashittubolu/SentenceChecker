from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ValidationError
import language_tool_python
from typing import List
import logging
import os
from dotenv import load_dotenv
load_dotenv()

# dotenv_path = Path('path/to/.env')
# load_dotenv(dotenv_path=dotenv_path)

PORT = os.getenv("PORT", 6000)
# print("PORT IS: ,", PORT)

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS").split(",")
# print(ALLOWED_ORIGINS)
# Initialize FastAPI app
app = FastAPI()

# Initialize language tool
tool = language_tool_python.LanguageTool('en-US')

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins= ALLOWED_ORIGINS ,  # Update with your frontend origin
    # allow_origins=["http://localhost:3000", "http://localhost:8002"],  # Update with your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the version 1 application
# app.mount("/api/v1", v1)
 
# Mount the version 2 application
# app.mount("/api/v2", v2)

# Models for requests and responses
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

# Error handling for HTTPException
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return {
        "error": {
            "code": exc.status_code,
            "message": exc.detail
        }
    }

# Error handling for validation errors
@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return {
        "error": {
            "code": 422,
            "message": "Invalid input",
            "details": exc.errors()
        }
    }

# General error handling
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logging.error(f"Unhandled error: {exc}")
    return {
        "error": {
            "code": 500,
            "message": "An unexpected error occurred. Please try again later."
        }
    }

# Sentence correction endpoint
@app.post("/api/v1/sentenceChecker/checkSentence", response_model=CorrectionResponse)
async def correct_sentence(request: SentenceRequest):
    try:
        # Check for empty input
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Input text cannot be empty.")
        
        # Use language tool to check the sentence
        matches = tool.check(request.text)
        correctedText = language_tool_python.utils.correct(request.text, matches)
        
        # Prepare the corrections
        corrections = []
        for match in matches:
            corrections.append(CorrectionDetail(
                incorrect=request.text[match.offset:match.offset + match.errorLength],
                correction=match.replacements[0] if match.replacements else "",
                start_index=match.offset,
                end_index=match.offset + match.errorLength
            ))
        
        # Return the response
        return CorrectionResponse(correctedText=correctedText, corrections=corrections, originalText=request.text)
    
    except HTTPException as e:
        raise e  # Re-raise HTTP exceptions to be caught by the handler
    except ValidationError as e:
        raise HTTPException(status_code=422, detail="Validation error") from e
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")

if __name__ == "__main__":
    import uvicorn
    # uvicorn.run(app, port=PORT, reload=True, access_log=False)
    # port = os.getenv("PORT", 6000)
    uvicorn.run("app:app", port=PORT,  access_log=True)
    # uvicorn.run(app, port=os.getenv("UVICORN_PORT", 6000), reload=True, access_log=True)
# PORT = os.getenv("PORT", 6000)

    # uvicorn.run(app, host="0.0.0.0", port=8000)


# uvicorn main:app --host 0.0.0.0 --port 80