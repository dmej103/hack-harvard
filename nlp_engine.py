from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize the OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

if not client.api_key:
    raise ValueError("No OpenAI API key found. Please set the OPENAI_API_KEY in your .env file.")

def detect_language(file_path, content):
    extension = os.path.splitext(file_path)[1].lower()
    if extension in ['.js', '.jsx', '.ts', '.tsx']:
        return 'JavaScript/TypeScript'
    elif extension in ['.py']:
        return 'Python'
    elif extension in ['.java']:
        return 'Java'
    elif extension in ['.html', '.htm']:
        return 'HTML'
    elif extension in ['.css']:
        return 'CSS'
    else:
        # Try to guess based on content if extension is not recognized
        if 'function' in content or 'const' in content or 'let' in content:
            return 'JavaScript/TypeScript'
        elif 'def ' in content or 'import ' in content:
            return 'Python'
        elif 'public class' in content or 'private' in content:
            return 'Java'
        else:
            return 'Unknown'

def generate_explanation(file_path, content):
    language = detect_language(file_path, content)
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": f"You are a helpful assistant that explains {language} code."},
                {"role": "user", "content": f"Explain the following {language} code in simple terms, focusing on its purpose and main components:\n\n{content}"}
            ],
            max_tokens=150,
            n=1,
            stop=None,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error generating explanation: {str(e)}"

def generate_contextual_explanations(code_data):
    enhanced_docs = []

    for file in code_data:
        content = file['content']
        explanation = generate_explanation(file['file_path'], content)
        
        enhanced_docs.append({
            'file_path': file['file_path'],
            'content': content,
            'explanation': explanation
        })
    
    return enhanced_docs
