from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def read_items():
    return {"message": "Version 1. Sentence Checker"}

# from fastapi import APIRouter

# router = APIRouter()


# # @router.get("/")
# # def read_users():
# #     return {"message": "Version 1. List of users"}

# # @router.get("/single")
# # def showSingleUser():
# #     return {"message": "Version 1. Single User"}

# # @router.post("/")
# # def create_user():
# #     return {"message": "Version 1. User created"}

# from fastapi import HTTPException
# from pydantic import BaseModel
# import language_tool_python
# from typing import List
# tool = language_tool_python.LanguageTool('en-US')

# class SentenceRequest(BaseModel):
#     text: str

# class CorrectionDetail(BaseModel): 
#     incorrect: str
#     correction: str
#     start_index: int
#     end_index: int

# class CorrectionResponse(BaseModel):
#     corrected_text: str
#     corrections: List[CorrectionDetail]
#     originalText: str

# @router.post("/sentenceChecker", response_model=CorrectionResponse)
# async def correct_sentence(request: SentenceRequest):
#     try:
#         matches = tool.check(request.text)
#         corrected_text = language_tool_python.utils.correct(request.text, matches)
        
#         corrections = []
#         for match in matches:
#             corrections.append(CorrectionDetail(
#                 incorrect=request.text[match.offset:match.offset + match.errorLength],
#                 correction=match.replacements[0] if match.replacements else "",
#                 start_index=match.offset,
#                 end_index=match.offset + match.errorLength
#             ))
        
#         return CorrectionResponse(corrected_text=corrected_text, corrections=corrections, originalText=request.text)
    
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

