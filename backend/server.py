from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# FastAPI App
app = FastAPI()

# Router with prefix
api_router = APIRouter(prefix="/api")

# Models
class PersonalInfo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    title: str
    tagline: str
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class AboutMe(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    interests: List[str]
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Skill(BaseModel):
    name: str
    category: str
    proficiency: int

class Skills(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    programming_languages: List[Skill]
    tools: List[Skill]
    research_domains: List[Skill]
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    technologies: List[str]
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Experience(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    company: str
    duration: str
    description: str
    technologies: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    subject: str
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Update/Create Models
class PersonalInfoUpdate(BaseModel):
    name: str
    title: str
    tagline: str
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None

class AboutMeUpdate(BaseModel):
    content: str
    interests: List[str]

class SkillsUpdate(BaseModel):
    programming_languages: List[Skill]
    tools: List[Skill]
    research_domains: List[Skill]

class ProjectCreate(BaseModel):
    title: str
    description: str
    technologies: List[str]
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    image_url: Optional[str] = None

class ExperienceCreate(BaseModel):
    title: str
    company: str
    duration: str
    description: str
    technologies: List[str]

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    subject: str
    message: str

# Personal Info
@api_router.get("/personal-info", response_model=PersonalInfo)
async def get_personal_info():
    info = await db.personal_info.find_one()
    if not info:
        default_info = PersonalInfo(
            name="Dasariraju Poorna Ganesh",
            title="Computer Science Student & AI Enthusiast",
            tagline="Blending human empathy with artificial intelligence",
            email="poorna.ganesh@example.com"
        )
        await db.personal_info.insert_one(default_info.dict())
        return default_info
    return PersonalInfo(**info)

@api_router.put("/personal-info", response_model=PersonalInfo)
async def update_personal_info(info: PersonalInfoUpdate):
    existing = await db.personal_info.find_one()
    if existing:
        await db.personal_info.delete_one({"_id": existing["_id"]})
    new_info = PersonalInfo(**info.dict())
    await db.personal_info.insert_one(new_info.dict())
    return new_info

# About Me
@api_router.get("/about-me", response_model=AboutMe)
async def get_about_me():
    about = await db.about_me.find_one()
    if not about:
        default_about = AboutMe(
            content="I am a passionate Computer Science student...",
            interests=[
                "Anomaly Detection in Healthcare Systems",
                "AI-powered Resource Management",
                "Internet of Medical Things (IoMT)"
            ]
        )
        await db.about_me.insert_one(default_about.dict())
        return default_about
    return AboutMe(**about)

@api_router.put("/about-me", response_model=AboutMe)
async def update_about_me(about: AboutMeUpdate):
    existing = await db.about_me.find_one()
    if existing:
        await db.about_me.delete_one({"_id": existing["_id"]})
    new_about = AboutMe(**about.dict())
    await db.about_me.insert_one(new_about.dict())
    return new_about

# Skills
@api_router.get("/skills", response_model=Skills)
async def get_skills():
    skills = await db.skills.find_one()
    if not skills:
        default_skills = Skills(
            programming_languages=[Skill(name="Python", category="programming", proficiency=90)],
            tools=[Skill(name="Git", category="tools", proficiency=85)],
            research_domains=[Skill(name="AI", category="research", proficiency=90)]
        )
        await db.skills.insert_one(default_skills.dict())
        return default_skills
    return Skills(**skills)

@api_router.put("/skills", response_model=Skills)
async def update_skills(skills: SkillsUpdate):
    existing = await db.skills.find_one()
    if existing:
        await db.skills.delete_one({"_id": existing["_id"]})
    new_skills = Skills(**skills.dict())
    await db.skills.insert_one(new_skills.dict())
    return new_skills

# Projects
@api_router.get("/projects", response_model=List[Project])
async def get_projects():
    projects = await db.projects.find().sort("created_at", -1).to_list(100)
    return [Project(**proj) for proj in projects]

@api_router.post("/projects", response_model=Project)
async def create_project(project: ProjectCreate):
    new_project = Project(**project.dict())
    await db.projects.insert_one(new_project.dict())
    return new_project

@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

# Experience
@api_router.get("/experience", response_model=List[Experience])
async def get_experience():
    experience = await db.experience.find().sort("created_at", -1).to_list(100)
    return [Experience(**exp) for exp in experience]

@api_router.post("/experience", response_model=Experience)
async def create_experience(experience: ExperienceCreate):
    new_experience = Experience(**experience.dict())
    await db.experience.insert_one(new_experience.dict())
    return new_experience

@api_router.delete("/experience/{experience_id}")
async def delete_experience(experience_id: str):
    result = await db.experience.delete_one({"id": experience_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"message": "Experience deleted successfully"}

# Contact
@api_router.post("/contact", response_model=ContactMessage)
async def submit_contact_message(message: ContactMessageCreate):
    new_message = ContactMessage(**message.dict())
    await db.contact_messages.insert_one(new_message.dict())
    return new_message

@api_router.get("/contact-messages", response_model=List[ContactMessage])
async def get_contact_messages():
    messages = await db.contact_messages.find().sort("created_at", -1).to_list(100)
    return [ContactMessage(**msg) for msg in messages]

# Root endpoint (not inside /api)
@app.get("/")
async def root():
    return {
        "message": "Futuristic Resume API is running!",
        "version": "1.0.0"
    }

# Attach API router
app.include_router(api_router)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Shutdown event
@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
