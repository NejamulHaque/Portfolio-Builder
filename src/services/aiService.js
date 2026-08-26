// src/services/aiService.js

// IMPORTANT: Use the relative path if you set up the Vite Proxy.
// If you did NOT set up the proxy, change this back to 'https://irus-ai.onrender.com/api/v1/chat'
// but be aware of CORS errors.
const IRUS_API_URL = '/api/v1/chat'; 

const API_KEY = import.meta.env.VITE_IRUS_API_KEY;

/**
 * Helper function to handle fetch with timeout and error handling
 * This prevents the app from hanging forever if Render is sleeping
 */
const callIrusAI = async (prompt) => {
  if (!API_KEY) {
    console.error("❌ NO API KEY FOUND. Check your .env file and restart server.");
    throw new Error('Missing API Key. Please add VITE_IRUS_API_KEY to your .env file.');
  }

  try {
    // Set a timeout of 60 seconds to allow for Render "Cold Starts"
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const res = await fetch(IRUS_API_URL, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${API_KEY}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ message: prompt }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ API Error Response:", res.status, errorText);
      
      if (res.status === 401) throw new Error('Invalid API Key');
      if (res.status === 405) throw new Error('Method Not Allowed (Check URL)');
      if (res.status === 503 || res.status === 502) throw new Error('AI Server is waking up (Render free tier). Please wait 10s and try again.');
      throw new Error(`API Error: ${res.status}`);
    }

    const data = await res.json();
    
    // IRUS AI usually returns { reply: "..." }
    return data.reply || "AI generation failed.";

  } catch (error) {
    console.error("❌ Fetch Error:", error);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. The AI server might be sleeping. Try again in a moment.');
    }
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Network Error: Is the server awake?');
    }
    throw error;
  }
};

/**
 * 1. Generate Professional Bio
 */
export const generateBio = async (userData) => {
  const skillsList = userData.skills?.flatMap(s => s.skills || []).join(', ') || 'General Programming';
  const name = userData.name || 'a developer';
  
  const prompt = `Write a professional, concise portfolio bio for ${name}. Skills: ${skillsList}. Tone: Professional and engaging. Max 3 sentences.`;
  
  return await callIrusAI(prompt);
};

/**
 * 2. Generate Professional Headline
 */
export const generateHeadline = async (userData) => {
  const skills = userData.skills?.flatMap(s => s.skills || []).join(', ') || 'General Tech';
  const name = userData.name || 'Developer';
  
  const prompt = `Create a short, punchy professional headline (max 6 words) for a portfolio. Name: ${name}. Skills: ${skills}. Role focus: Developer/Engineer. Examples: "Full Stack Architect", "Creative Frontend Engineer". Return ONLY the headline text, no quotes.`;
  
  const result = await callIrusAI(prompt);
  // Clean up quotes if AI adds them
  return result.replace(/^"|"$/g, '').trim();
};

/**
 * 3. Enhance Project Description
 */
export const enhanceProjectDesc = async (project) => {
  const title = project.title || 'Untitled Project';
  const tech = project.tags?.join(', ') || 'Various technologies';
  const currentDesc = project.description || 'No description provided';

  const prompt = `Rewrite this project description to be impressive for a recruiter. Focus on impact and technology used. Keep it under 2 sentences. Title: ${title}. Tech Stack: ${tech}. Current Description: ${currentDesc}.`;
  
  return await callIrusAI(prompt);
};

/**
 * 4. Suggest Skills based on Role (Bonus)
 */
export const suggestSkills = async (role) => {
  const prompt = `List 5 essential technical skills for a ${role}. Return only the comma-separated list, nothing else. Example: React, Node.js, Docker, AWS, GraphQL`;
  
  const result = await callIrusAI(prompt);
  return result.split(',').map(s => s.trim()).filter(Boolean);
};