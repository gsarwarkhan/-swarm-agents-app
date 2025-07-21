import streamlit as st
import requests

st.set_page_config(
    page_title="Swarm Agents App",
    page_icon="🟢",
    layout="centered",
    initial_sidebar_state="auto"
)

# --- Theme ---
st.markdown("""
    <style>
    body { background: linear-gradient(135deg, #e0f7ef 0%, #f0fdf4 100%) !important; }
    .stTabs [data-baseweb="tab-list"] { justify-content: center; }
    .stTabs [data-baseweb="tab"] { font-weight: 600; font-size: 1.1rem; }
    .swarm-card { background: rgba(255,255,255,0.85); border-radius: 1.5rem; box-shadow: 0 4px 24px 0 #22c55e22; padding: 2rem 1.5rem; margin: 2rem 0; }
    .swarm-btn { background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%); color: white; border: none; border-radius: 0.5rem; padding: 0.5rem 1.5rem; font-weight: 600; font-size: 1rem; }
    </style>
""", unsafe_allow_html=True)

# --- Agent Prompt Builders ---
def mental_health_prompt(user_input):
    return f"""You are a swarm of compassionate mental health coaches. Collaborate to provide supportive, practical, and empathetic advice for the following user concern:\n\n"{user_input}"\n\nRespond as a team, offering actionable steps and emotional support."""

def business_policy_prompt(user_input):
    return f"""You are a swarm of business policy experts. Work together to analyze and provide clear, strategic advice for this business scenario or question:\n\n"{user_input}"\n\nRespond as a team, considering best practices and potential risks."""

def doctor_prompt(user_input):
    return f"""You are a swarm of experienced doctors. Collaborate to give safe, informative, and helpful medical advice for the following concern (remind the user to consult a real doctor for emergencies):\n\n"{user_input}"\n\nRespond as a team, considering different perspectives."""

def engineer_prompt(user_input):
    return f"""You are a swarm of engineers from various fields. Work together to solve or explain the following technical problem or question:\n\n"{user_input}"\n\nRespond as a team, offering practical and creative solutions."""

def numerology_prompt(user_input):
    return f"""You are a swarm of numerologists and spiritual guides. Collaborate to provide insights, interpretations, and guidance for the following question or situation:\n\n"{user_input}"\n\nRespond as a team, blending numerology and spiritual wisdom."""

AGENTS = [
    {
        "name": "Mental Health Coach Swarm",
        "emoji": "🧠",
        "prompt_builder": mental_health_prompt,
    },
    {
        "name": "Business Policy Swarm",
        "emoji": "📊",
        "prompt_builder": business_policy_prompt,
    },
    {
        "name": "Doctor Swarm",
        "emoji": "🩺",
        "prompt_builder": doctor_prompt,
    },
    {
        "name": "Engineer Swarm",
        "emoji": "🛠️",
        "prompt_builder": engineer_prompt,
    },
    {
        "name": "Numerology + Spiritual Swarm",
        "emoji": "🔮",
        "prompt_builder": numerology_prompt,
    },
]

# --- Gemini API Call ---
def call_gemini(prompt, api_key):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    try:
        response = requests.post(url, headers=headers, json=data, timeout=30)
        response.raise_for_status()
        data = response.json()
        return data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "No response from Gemini API.")
    except Exception as e:
        return f"Error: {e}"

# --- Main UI ---
st.title("🟢 Swarm Agents App")
st.markdown("Interact with 5 different AI-powered Swarm Agents. Enter your question and get collaborative, expert responses!")

tab_labels = [f"{agent['emoji']} {agent['name']}" for agent in AGENTS]
tabs = st.tabs(tab_labels)

api_key = st.secrets.get("GEMINI_API_KEY", "")

for i, agent in enumerate(AGENTS):
    with tabs[i]:
        st.markdown(f"<div class='swarm-card'>", unsafe_allow_html=True)
        st.subheader(f"{agent['emoji']} {agent['name']}")
        user_input = st.text_input("Your question:", key=f"input_{i}")
        if st.button("Ask", key=f"btn_{i}", help="Send your question to the Swarm Agent"):
            if not api_key:
                st.error("Gemini API key not set. Please add it in Streamlit secrets.")
            elif not user_input.strip():
                st.warning("Please enter a question.")
            else:
                with st.spinner("Thinking..."):
                    prompt = agent["prompt_builder"](user_input)
                    response = call_gemini(prompt, api_key)
                st.markdown(f"<div class='fade-in' style='margin-top:1.5rem;'><b>Response:</b><br>{response}</div>", unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True) 