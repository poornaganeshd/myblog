import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Hero Section Component
const HeroSection = ({ personalInfo }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <motion.section 
      className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ y, opacity }}
    >
      {/* Background with neon overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0 bg-cyber-pattern opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-purple-500/10"></div>
      </div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-6"
        >
          <motion.h1 
            className="text-6xl md:text-8xl font-bold text-white mb-4 cyber-glow"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            {personalInfo?.name || "DASARIRAJU POORNA GANESH"}
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl text-cyan-400 font-light tracking-wider"
          >
            {personalInfo?.title || "COMPUTER SCIENCE STUDENT & AI ENTHUSIAST"}
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
          >
            {personalInfo?.tagline || "Blending human empathy with artificial intelligence"}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="flex justify-center space-x-6 mt-8"
          >
            <button className="cyber-button primary">
              View Projects
            </button>
            <button className="cyber-button secondary">
              Contact Me
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

// About Me Section
const AboutSection = ({ aboutData }) => {
  return (
    <motion.section 
      className="py-20 bg-gradient-to-b from-gray-900 to-gray-800"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-16 cyber-glow"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          ABOUT ME
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-300 leading-relaxed">
              {aboutData?.content || "Loading..."}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-semibold text-cyan-400 mb-6">Research Interests</h3>
            <div className="space-y-3">
              {aboutData?.interests?.map((interest, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="cyber-card p-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-gray-300">{interest}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

// Skills Section
const SkillsSection = ({ skillsData }) => {
  const SkillBar = ({ skill, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="cyber-card p-4 mb-4"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-300 font-medium">{skill.name}</span>
        <span className="text-cyan-400 text-sm">{skill.proficiency}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.proficiency}%` }}
          transition={{ duration: 1.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        />
      </div>
    </motion.div>
  );

  return (
    <motion.section 
      className="py-20 bg-gradient-to-b from-gray-800 to-gray-900"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-16 cyber-glow"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          SKILLS & EXPERTISE
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Programming Languages */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-cyan-400 mb-6 text-center">
              Programming Languages
            </h3>
            {skillsData?.programming_languages?.map((skill, index) => (
              <SkillBar key={index} skill={skill} index={index} />
            ))}
          </motion.div>
          
          {/* Tools */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-cyan-400 mb-6 text-center">
              Tools & Frameworks
            </h3>
            {skillsData?.tools?.map((skill, index) => (
              <SkillBar key={index} skill={skill} index={index} />
            ))}
          </motion.div>
          
          {/* Research Domains */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-cyan-400 mb-6 text-center">
              Research Domains
            </h3>
            {skillsData?.research_domains?.map((skill, index) => (
              <SkillBar key={index} skill={skill} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

// Projects Section
const ProjectsSection = ({ projects }) => {
  return (
    <motion.section 
      className="py-20 bg-gradient-to-b from-gray-900 to-black"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-16 cyber-glow"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          PROJECTS
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {projects?.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, rotateY: 5 }}
              className="cyber-card p-6 group cursor-pointer"
            >
              <h3 className="text-2xl font-semibold text-cyan-400 mb-4 group-hover:text-white transition-colors">
                {project.title}
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies?.map((tech, techIndex) => (
                  <span 
                    key={techIndex}
                    className="px-3 py-1 bg-gray-800 text-cyan-400 rounded-full text-sm border border-cyan-400/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex space-x-4">
                {project.github_url && (
                  <a href={project.github_url} className="cyber-button secondary text-sm">
                    GitHub
                  </a>
                )}
                {project.demo_url && (
                  <a href={project.demo_url} className="cyber-button primary text-sm">
                    Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

// Experience Section
const ExperienceSection = ({ experience }) => {
  return (
    <motion.section 
      className="py-20 bg-gradient-to-b from-black to-gray-900"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-16 cyber-glow"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          EXPERIENCE
        </motion.h2>
        
        {experience?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="cyber-card p-12 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-cyan-400 mb-4">
                Building Experience
              </h3>
              <p className="text-gray-300 text-lg">
                Currently focusing on academic projects and research. 
                Open to internships and collaboration opportunities!
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {experience?.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="cyber-card p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-cyan-400">{exp.title}</h3>
                    <p className="text-xl text-gray-300">{exp.company}</p>
                  </div>
                  <span className="text-gray-400 mt-2 md:mt-0">{exp.duration}</span>
                </div>
                <p className="text-gray-300 mb-4">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies?.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="px-3 py-1 bg-gray-800 text-cyan-400 rounded-full text-sm border border-cyan-400/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

// Contact Section
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post(`${API}/contact`, formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section 
      className="py-20 bg-gradient-to-b from-gray-900 to-black"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-center mb-16 cyber-glow"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          GET IN TOUCH
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="cyber-card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-cyan-400 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="cyber-input w-full"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-cyan-400 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="cyber-input w-full"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-cyan-400 mb-2">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="cyber-input w-full"
                placeholder="What's this about?"
              />
            </div>
            
            <div>
              <label className="block text-cyan-400 mb-2">Message</label>
              <textarea
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="cyber-input w-full resize-none"
                placeholder="Your message..."
              />
            </div>
            
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cyber-button primary w-full md:w-auto"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </motion.button>
            
            <AnimatePresence>
              {submitStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`text-center p-4 rounded ${
                    submitStatus === 'success' 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-red-900 text-red-300'
                  }`}
                >
                  {submitStatus === 'success' 
                    ? 'Message sent successfully!' 
                    : 'Error sending message. Please try again.'}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
};

// Main App Component
function App() {
  const [personalInfo, setPersonalInfo] = useState(null);
  const [aboutData, setAboutData] = useState(null);
  const [skillsData, setSkillsData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [personalRes, aboutRes, skillsRes, projectsRes, experienceRes] = await Promise.all([
          axios.get(`${API}/personal-info`),
          axios.get(`${API}/about-me`),
          axios.get(`${API}/skills`),
          axios.get(`${API}/projects`),
          axios.get(`${API}/experience`)
        ]);

        setPersonalInfo(personalRes.data);
        setAboutData(aboutRes.data);
        setSkillsData(skillsRes.data);
        setProjects(projectsRes.data);
        setExperience(experienceRes.data);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="App bg-black text-white">
      <HeroSection personalInfo={personalInfo} />
      <AboutSection aboutData={aboutData} />
      <SkillsSection skillsData={skillsData} />
      <ProjectsSection projects={projects} />
      <ExperienceSection experience={experience} />
      <ContactSection />
    </div>
  );
}

export default App;