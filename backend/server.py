from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Resume Content Models
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
    category: str  # "programming", "tools", "research"
    proficiency: int  # 1-100

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

# Create/Update Models
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


# Personal Info Endpoints
@api_router.get("/personal-info", response_model=PersonalInfo)
async def get_personal_info():
    info = await db.personal_info.find_one()
    if not info:
        # Return default info if none exists
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

# About Me Endpoints
@api_router.get("/about-me", response_model=AboutMe)
async def get_about_me():
    about = await db.about_me.find_one()
    if not about:
        default_about = AboutMe(
            content="I am a passionate Computer Science student with a deep interest in artificial intelligence and its applications in healthcare. My research focuses on anomaly detection, resource optimization, and IoMT (Internet of Medical Things) systems. I believe in leveraging technology to create meaningful solutions that improve human lives while maintaining empathy and ethical considerations.",
            interests=[
                "Anomaly Detection in Healthcare Systems",
                "AI-powered Resource Management",
                "Internet of Medical Things (IoMT)",
                "Variational Autoencoders (VAE)",
                "Graph Neural Networks (GNN)",
                "Machine Learning Research",
                "Healthcare Technology Innovation"
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

# Skills Endpoints
@api_router.get("/skills", response_model=Skills)
async def get_skills():
    skills = await db.skills.find_one()
    if not skills:
        default_skills = Skills(
            programming_languages=[
                Skill(name="Python", category="programming", proficiency=90),
                Skill(name="Java", category="programming", proficiency=80),
                Skill(name="C", category="programming", proficiency=75),
                Skill(name="JavaScript", category="programming", proficiency=70),
                Skill(name="SQL", category="programming", proficiency=80)
            ],
            tools=[
                Skill(name="Google Colab", category="tools", proficiency=95),
                Skill(name="Streamlit", category="tools", proficiency=85),
                Skill(name="Android Studio", category="tools", proficiency=75),
                Skill(name="TensorFlow", category="tools", proficiency=80),
                Skill(name="PyTorch", category="tools", proficiency=75),
                Skill(name="Git", category="tools", proficiency=85)
            ],
            research_domains=[
                Skill(name="Anomaly Detection", category="research", proficiency=85),
                Skill(name="Resource Optimization", category="research", proficiency=80),
                Skill(name="VAE-GNN", category="research", proficiency=75),
                Skill(name="IoMT Systems", category="research", proficiency=80),
                Skill(name="Machine Learning", category="research", proficiency=85)
            ]
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

# Projects Endpoints
@api_router.get("/projects", response_model=List[Project])
async def get_projects():
    projects = await db.projects.find().sort("created_at", -1).to_list(100)
    if not projects:
        # Create default projects
        default_projects = [
            Project(
                title="AI-Powered Resource Management in IoMT",
                description="Developed an intelligent resource management system for Internet of Medical Things (IoMT) networks using machine learning algorithms. The system optimizes resource allocation, predicts maintenance needs, and ensures efficient operation of medical devices in healthcare environments.",
                technologies=["Python", "TensorFlow", "IoT", "Machine Learning", "Healthcare APIs"]
            ),
            Project(
                title="Waste Classification Using Image Processing",
                description="Created an advanced image classification system that automatically categorizes different types of waste materials. Implemented using computer vision techniques and deep learning models to promote environmental sustainability and efficient waste management.",
                technologies=["Python", "OpenCV", "CNN", "Image Processing", "Environmental AI"]
            )
        ]
        for project in default_projects:
            await db.projects.insert_one(project.dict())
        return default_projects
    return [Project(**project) for project in projects]

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

# Experience Endpoints
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

# Contact Endpoints
@api_router.post("/contact", response_model=ContactMessage)
async def submit_contact_message(message: ContactMessageCreate):
    new_message = ContactMessage(**message.dict())
    await db.contact_messages.insert_one(new_message.dict())
    return new_message

@api_router.get("/contact-messages", response_model=List[ContactMessage])
async def get_contact_messages():
    messages = await db.contact_messages.find().sort("created_at", -1).to_list(100)
    return [ContactMessage(**msg) for msg in messages]

# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "Futuristic Resume API is running!", "version": "1.0.0"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()