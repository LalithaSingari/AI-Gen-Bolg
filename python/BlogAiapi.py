from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load GPT-Neo model
generator = pipeline("text-generation", model="EleutherAI/gpt-neo-125M")

@app.route("/generate", methods=["POST", "OPTIONS"])
def generate():
    # Handle preflight requests (OPTIONS)
    if request.method == "OPTIONS":
        response = jsonify()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST")
        return response

    # Handle POST requests
    data = request.json
    topic = data.get("topic", "")

    # Improved prompt to avoid repetition and get more structured content
    prompt = (
        f"Write a well-structured, informative blog post about {topic}. "
        "Include an engaging introduction, key points, and a conclusion. "
        "Avoid repetition and ensure the content is useful to the reader."
    )

    response = generator(
        prompt,
        max_length=250,  # Slightly longer to give better content
        temperature=0.7,  # Lower randomness for structured output
        repetition_penalty=1.2,  # Penalize repeated phrases
        do_sample=True  # Enable sampling for variation
    )

    # Clean the response text
    blog_content = response[0]["generated_text"].replace("\n", " ").strip()

    response = jsonify({"blog": blog_content})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == "__main__":
    app.run(debug=True)
