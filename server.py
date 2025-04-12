
import google.generativeai as genai
import gradio as gr
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB Setup
mongo_client = MongoClient("mongodb+srv://UBER:UBER@cluster0.jagyi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = mongo_client["chatbot"]
image_collection = db["images"]
video_collection = db["videos"]
pdf_collection = db["pdfs"]

# Gemini API (now calling it Aura AI)
genai.configure(api_key="AIzaSyDwx8kkfjsvGH_J-98ho1L4u0id1LElJ58")
model = genai.GenerativeModel(model_name="models/gemini-1.5-pro-latest")

# Filter out unwanted phrases
FILTER_PHRASES = [
    "I can't directly create images",
    "as a language model",
    "within this text-based environment"
]

def clean_gemini_reply(reply):
    # Clean asterisks and markdown formatting
    cleaned_text = re.sub(r'\*\*(.*?)\*\*', r'\1', reply)  # Remove bold markdown
    cleaned_text = re.sub(r'\*(.*?)\*', r'\1', cleaned_text)  # Remove italic markdown
    
    # Filter unwanted phrases
    lines = cleaned_text.splitlines()
    filtered = [
        line for line in lines
        if not any(phrase.lower() in line.lower() for phrase in FILTER_PHRASES)
    ]
    return "\n".join(filtered).strip()

# Fetch image from MongoDB
def fetch_image_url(query):
    for doc in image_collection.find():
        if doc.get("keyword", "").lower() in query.lower():
            return doc.get("image_url")
    return None

# Fetch YouTube video from MongoDB
def fetch_youtube_video(query):
    for doc in video_collection.find():
        if doc.get("keyword", "").lower() in query.lower():
            return {
                "title": doc["title"],
                "video_url": doc["video_url"],
                "thumbnail": doc["thumbnail"]
            }
    return None

# Fetch PDF from MongoDB
def fetch_pdf(query):
    for doc in pdf_collection.find():
        if doc.get("keyword", "").lower() in query.lower():
            return {
                "title": doc["title"],
                "pdf_url": doc["pdf_url"]
            }
    return None

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message', '')
    
    try:
        # Check for image requests - provide image only, no text
        image_requested = ("image" in user_input.lower() or 
                          "picture" in user_input.lower() or 
                          "photo" in user_input.lower())
        
        if image_requested:
            image_url = fetch_image_url(user_input)
            if image_url:
                return jsonify({
                    "role": "assistant",
                    "content": "",  # Empty content for image-only responses
                    "mediaType": "image",
                    "mediaUrl": image_url
                })
            else:
                # If no image found but user requested one, get text response
                response = model.generate_content(user_input)
                gemini_reply = clean_gemini_reply(response.text.strip())
                return jsonify({
                    "role": "assistant",
                    "content": gemini_reply
                })
        
        # For other media types, get the text response first
        response = model.generate_content(user_input)
        gemini_reply = clean_gemini_reply(response.text.strip())
        
        # Initialize response object with the text response
        response_obj = {
            "role": "assistant",
            "content": gemini_reply
        }
        
        # Check for PDF
        if "pdf" in user_input.lower():
            pdf_data = fetch_pdf(user_input)
            if pdf_data:
                response_obj["mediaType"] = "pdf"
                response_obj["mediaUrl"] = pdf_data["pdf_url"]
                response_obj["mediaTitle"] = pdf_data["title"]
        
        # Check for YouTube video
        elif "video" in user_input.lower():
            yt_data = fetch_youtube_video(user_input)
            if yt_data:
                response_obj["mediaType"] = "video"
                response_obj["mediaUrl"] = yt_data["video_url"]
                response_obj["mediaTitle"] = yt_data["title"]
                response_obj["mediaThumbnail"] = yt_data["thumbnail"]
        
        return jsonify(response_obj)

    except Exception as e:
        return jsonify({
            "role": "assistant",
            "content": f"Error: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
