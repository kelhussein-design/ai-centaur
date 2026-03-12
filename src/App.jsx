import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ═══════════════════════════════════════════════════════════
// THE AI CENTAUR — Complete Hub v2
// ═══════════════════════════════════════════════════════════

const themes = {
  classical: {
    bg: "#F7F2E7", bgGrad: "linear-gradient(180deg, #F7F2E7 0%, #EDE6D6 100%)",
    surface: "#FFFCF5", surfaceAlt: "#F0E9D8", bgAlt: "#F0EBD9",
    border: "#E5DDD0", borderActive: "#C9A84C", borderLight: "#D4C9B0",
    text: "#2C2418", textSec: "#8C7A5E", textMuted: "#B8A888", textFaint: "#C8BFA0", textGhost: "#D4CBB4",
    accent: "#C9A84C", accentBg: "rgba(201,168,76,0.06)", accentGreen: "#16A34A", accentRed: "#B45309", accentBlue: "#1E5FA0",
    font: "Georgia, 'Times New Roman', serif", fontAlt: "'Trebuchet MS', 'Lucida Sans', sans-serif",
    radius: 4,
  },
  futuristic: {
    bg: "#0A0A0C", bgGrad: "linear-gradient(180deg, #0A0A0C 0%, #0D0B15 40%, #120D1A 100%)",
    surface: "rgba(255,255,255,0.02)", surfaceAlt: "rgba(255,255,255,0.04)", bgAlt: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.04)", borderActive: "#00F5D4", borderLight: "rgba(255,255,255,0.06)",
    text: "#F0F0F0", textSec: "#888", textMuted: "#555", textFaint: "#444", textGhost: "#333",
    accent: "#00F5D4", accentBg: "rgba(0,245,212,0.06)", accentGreen: "#00F5D4", accentRed: "#FF006E", accentBlue: "#00BBF9",
    font: "'Segoe UI', Tahoma, sans-serif", fontAlt: "'Segoe UI', Tahoma, sans-serif",
    radius: 14,
  },
};

const neonColors = ["#FF006E","#00F5D4","#FEE440","#00BBF9","#9B5DE5","#FF8500"];
const topicColors = ["#EF4444","#9333EA","#F97316","#3B82F6","#22C55E","#EC4899","#06B6D4","#84CC16","#F59E0B"];
const topicEmojis = ["🤖","👁️","🔓","🪞","💼","🎨","📖","🌱","⚖️"];

// ─── MODEL DATA ───
const MODELS = [
  { id: "claude-opus", name: "Claude Opus 4.6", short: "Opus 4.6", company: "Anthropic", color: "#F59E0B", reasoning: 95, coding: 93, writing: 96, math: 92, speed: 55, knowledge: 94, elo: 1380, input_price: 15, output_price: 75, context: 200000, open: false },
  { id: "gpt-5.2", name: "GPT-5.2", short: "GPT-5.2", company: "OpenAI", color: "#22C55E", reasoning: 93, coding: 92, writing: 90, math: 95, speed: 72, knowledge: 91, elo: 1370, input_price: 10, output_price: 30, context: 256000, open: false },
  { id: "gemini-3", name: "Gemini 3 Pro", short: "Gemini 3", company: "Google", color: "#3B82F6", reasoning: 91, coding: 88, writing: 87, math: 90, speed: 85, knowledge: 92, elo: 1355, input_price: 7, output_price: 21, context: 2000000, open: false },
  { id: "claude-sonnet", name: "Claude Sonnet 4.5", short: "Sonnet 4.5", company: "Anthropic", color: "#FBBF24", reasoning: 89, coding: 91, writing: 92, math: 86, speed: 80, knowledge: 88, elo: 1340, input_price: 3, output_price: 15, context: 200000, open: false },
  { id: "grok-4", name: "Grok 4", short: "Grok 4", company: "xAI", color: "#EF4444", reasoning: 90, coding: 85, writing: 84, math: 91, speed: 78, knowledge: 86, elo: 1330, input_price: null, output_price: null, context: 128000, open: false },
  { id: "deepseek", name: "DeepSeek V3.2", short: "DS V3.2", company: "DeepSeek", color: "#A855F7", reasoning: 88, coding: 90, writing: 82, math: 89, speed: 75, knowledge: 85, elo: 1320, input_price: 0.27, output_price: 1.1, context: 128000, open: true },
  { id: "gemini-2.5", name: "Gemini 2.5 Pro", short: "Gem 2.5", company: "Google", color: "#60A5FA", reasoning: 86, coding: 86, writing: 85, math: 84, speed: 88, knowledge: 87, elo: 1310, input_price: 1.25, output_price: 5, context: 1000000, open: false },
  { id: "llama-4", name: "Llama 4 Maverick", short: "Llama 4", company: "Meta", color: "#06B6D4", reasoning: 84, coding: 84, writing: 80, math: 82, speed: 82, knowledge: 83, elo: 1290, input_price: null, output_price: null, context: 1000000, open: true },
  { id: "kimi", name: "Kimi K2.5", short: "Kimi K2.5", company: "Moonshot", color: "#EAB308", reasoning: 82, coding: 81, writing: 78, math: 80, speed: 70, knowledge: 80, elo: 1270, input_price: 1, output_price: 3, context: 128000, open: false },
  { id: "glm-5", name: "GLM-5", short: "GLM-5", company: "Zhipu AI", color: "#F97316", reasoning: 80, coding: 79, writing: 76, math: 78, speed: 68, knowledge: 79, elo: 1250, input_price: 1, output_price: 2, context: 128000, open: false },
];

const CATEGORIES = [
  { key: "reasoning", label: "Reasoning", emoji: "🧠", sources: "GPQA Diamond, Arena ELO", desc: "How well the model handles complex, multi-step problem solving — things like analyzing arguments, drawing inferences, and connecting ideas across domains. Tested with graduate-level science questions (GPQA) and head-to-head human preference votes (Arena)." },
  { key: "coding", label: "Coding", emoji: "💻", sources: "SWE-bench, LiveCodeBench", desc: "Can it write, debug, and fix real code? SWE-bench tests models on actual GitHub issues from open-source projects. LiveCodeBench uses fresh competitive programming problems to prevent memorization." },
  { key: "writing", label: "Writing", emoji: "✍️", sources: "Arena writing votes", desc: "Quality of prose, creativity, tone, and ability to follow nuanced instructions. Measured by human voters in blind comparisons on Chatbot Arena — real people picking which response they prefer." },
  { key: "math", label: "Math", emoji: "📐", sources: "AIME, MATH-500", desc: "Mathematical reasoning from high school through competition level. AIME is the American Invitational Mathematics Exam (olympiad-tier). MATH-500 covers a broader range of difficulty." },
  { key: "speed", label: "Speed", emoji: "⚡", sources: "Artificial Analysis TPS", desc: "How fast the model generates responses, measured in tokens per second by Artificial Analysis on standardized hardware. Faster isn't always better — some models trade speed for quality." },
  { key: "knowledge", label: "Knowledge", emoji: "📚", sources: "MMLU-Pro, HLE", desc: "Breadth and accuracy of factual knowledge across dozens of domains — science, history, law, medicine, etc. MMLU-Pro uses harder questions with 10 answer choices. HLE tests the edges of what models know." },
];

const USE_CASES = [
  { id: "report", label: "Writing reports & essays", emoji: "📝", keys: ["writing","knowledge","reasoning"] },
  { id: "code", label: "Coding help", emoji: "👨‍💻", keys: ["coding","reasoning","speed"] },
  { id: "research", label: "Research & fact-checking", emoji: "🔍", keys: ["knowledge","reasoning","writing"] },
  { id: "math-help", label: "Math problems", emoji: "🧮", keys: ["math","reasoning"] },
  { id: "brainstorm", label: "Brainstorming", emoji: "💡", keys: ["writing","reasoning","speed"] },
  { id: "analyze", label: "Data analysis", emoji: "📊", keys: ["reasoning","knowledge","math"] },
  { id: "quick", label: "Quick questions", emoji: "💬", keys: ["speed","knowledge"] },
  { id: "learn", label: "Learning new topics", emoji: "🎓", keys: ["knowledge","writing","reasoning"] },
];

// ─── BIG QUESTIONS DATA ───
const BIG_QUESTIONS=[{title:"Misalignment & Loss of Control",tagline:"What happens when AI systems pursue goals we didn't intend?",subtopics:["Goal misspecification","Autonomous decision-making","Emergent behaviors","Alignment research gap","Interpretability challenges"],prompt:"You're advising a hospital that wants AI to triage emergency patients. It's faster and more consistent — but a black box. How do you advise them?",facts:[{num:"~$300M",label:"Annual alignment research spending",comparison:"About 1-2% of capabilities spending. Like $100 on a race car, $1 on brakes.",source:"Various, 2025"},{num:"0",label:"AI systems with autonomous goals",comparison:"Current AI has no desires or self-awareness. Sophisticated pattern-matching, not a mind.",source:"Scientific consensus"},{num:"2025",label:"Proof: hallucinations are structural",comparison:"Like proving a car engine will always produce some exhaust — built into how it works.",source:"Multiple research groups"}],misconceptions:[{claim:"AI is about to become sentient",reality:"No credible evidence. Current systems process patterns, they don't think."},{claim:"Just sci-fi fearmongering",reality:"Leading researchers building these systems take alignment seriously."}],sources:[{name:"Anthropic Research",type:"Primary",url:"https://www.anthropic.com/research"},{name:"Center for AI Safety",type:"Research",url:"https://www.safe.ai"}]},{title:"Power Concentration & Control",tagline:"Is AI making Big Tech even more powerful?",subtopics:["Big 5 dominance","Training cost barriers","Surveillance applications","Data monopolies","Regulatory capture"],prompt:"Five companies control most AI infrastructure. A startup says they can't compete. A tech exec says breaking them up hands AI to China. Who's more persuasive?",facts:[{num:"5",label:"Companies dominating AI",comparison:"Imagine 5 companies controlling all electricity, water, AND phones. That's where we are.",source:"ProMarket, 2025"},{num:"90%+",label:"Google's search market share (UK)",comparison:"If a grocery store had 90% share in your town, every other store combined is a rounding error.",source:"UK CMA, 2025"},{num:"$2.6B vs $7B",label:"US public AI investment vs Meta's GPU budget",comparison:"37 cents in public money for every dollar Meta spends privately.",source:"NAIRR / industry"}],misconceptions:[{claim:"Competition will fix this",reality:"Training frontier models costs billions. Barriers are structural, not temporary."},{claim:"Just break them up",reality:"Fragmented AI efforts could slow progress in a global race. No easy answer."}],sources:[{name:"AI Now Institute",type:"Primary",url:"https://ainowinstitute.org"},{name:"ProMarket",type:"Analysis",url:"https://www.promarket.org"}]},{title:"Security & Weaponization",tagline:"AI as a tool for fraud, cyberattacks, and bad actors.",subtopics:["Voice cloning & identity theft","AI-powered phishing","Autonomous weapons","Biometric bypass","Lowered skill barriers"],prompt:"Your parent gets a call from 'you' asking for emergency money. The voice is perfect — it's a clone. How do you protect your family?",facts:[{num:"3 sec",label:"Audio to clone a voice (85% match)",comparison:"As long as saying 'Hey, how are you?' — enough to become you on the phone.",source:"McAfee"},{num:"$25M",label:"Stolen via deepfake CFO video call",comparison:"One fake call cost more than most people earn in a lifetime.",source:"Hong Kong case, 2024"},{num:"$40B",label:"Projected gen AI fraud losses by 2027",comparison:"Roughly NASA's entire annual budget.",source:"Deloitte"},{num:"Every 5 min",label:"Deepfake attack frequency (2024)",comparison:"By the time you finish a coffee, another attack has been attempted.",source:"Pindrop"}],misconceptions:[{claim:"I'd be able to tell",reality:"Humans spot high-quality deepfakes only 24.5% of the time. Worse than a coin flip."},{claim:"Only targets celebrities",reality:"Voice cloning scams increasingly target ordinary people, especially elderly."}],sources:[{name:"Keepnet Labs",type:"Analysis",url:"https://keepnetlabs.com/blog/deepfake-statistics-and-trends"},{name:"UNESCO",type:"Primary",url:"https://www.unesco.org/en/articles/deepfakes-and-crisis-knowing"}]},{title:"Information Integrity & Trust",tagline:"When seeing is no longer believing.",subtopics:["Deepfake proliferation","Synthetic consensus","The liar's dividend","Trust erosion","Academic fraud"],prompt:"A video surfaces of a politician saying something outrageous. They claim deepfake. Their opponent says it's real. You can't verify. How do you decide?",facts:[{num:"8M",label:"Deepfake files in 2025 (from 500K in 2023)",comparison:"Every resident of NYC producing one fake. That's the scale.",source:"UK Gov projections"},{num:"0.1%",label:"People who identified ALL fakes correctly",comparison:"1 out of 1,000 people. Everyone else was fooled at least once.",source:"iProov, 2025"},{num:"<1%",label:"Election misinfo that was AI-generated (2024)",comparison:"Most misinformation is still human-made. AI amplifies, didn't create the problem.",source:"Fact-checking orgs"},{num:"13%",label:"Companies with anti-deepfake protocols",comparison:"87 out of 100 businesses have no plan for deepfake attacks.",source:"Programs.com, 2025"}],misconceptions:[{claim:"Better detection solves this",reality:"Detection lags creation in a permanent arms race. Real damage is to trust itself."},{claim:"Mainly a political problem",reality:"Fraud is #1 deepfake use (31%), ahead of politics (27%)."}],sources:[{name:"UNESCO",type:"Primary",url:"https://www.unesco.org/en/articles/deepfakes-and-crisis-knowing"},{name:"Surfshark Research",type:"Research",url:"https://surfshark.com/research/study/deepfake-statistics"}]},{title:"Economy, Labor & Inequality",tagline:"Who benefits and who gets left behind?",subtopics:["Current vs projected displacement","Most exposed roles","Young worker crisis","New jobs created","Skills gap"],prompt:"Your friend's 22-year-old CS grad can't find a job — AI does what juniors used to do. Meanwhile seniors are more productive than ever. Temporary transition or permanent restructuring?",facts:[{num:"2.5%",label:"US jobs at risk if AI use expanded economy-wide",comparison:"1 in 40 workers. Like a moderate recession — significant but not apocalyptic.",source:"Goldman Sachs, 2025"},{num:"~3 pts",label:"Unemployment spike for young tech workers (20-30)",comparison:"In a class of 100, 3 more are unemployed than expected — the ones who studied tech.",source:"Goldman Sachs"},{num:"10:1",label:"AI jobs created vs destroyed (2024)",comparison:"For every job lost, ~10 new ones appeared. But different skills needed.",source:"ITIF, Dec 2025"},{num:"60%",label:"Today's jobs that didn't exist in 1940",comparison:"Your grandparents couldn't imagine most careers today. Same will happen again.",source:"Historical analysis"}],misconceptions:[{claim:"AI will take all jobs",reality:"Macro data is calm. History says tech creates more than it destroys — but transitions hurt."},{claim:"Creative jobs are safe",reality:"Unlike past tech, gen AI specifically targets cognitive and creative work."}],sources:[{name:"Yale Budget Lab",type:"Primary",url:"https://budgetlab.yale.edu"},{name:"Goldman Sachs",type:"Analysis",url:"https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-global-workforce"},{name:"St. Louis Fed",type:"Primary",url:"https://www.stlouisfed.org"}]},{title:"Culture, Creativity & 'AI Slop'",tagline:"What happens to human expression when machines create unlimited content?",subtopics:["Content flooding","Voice/likeness cloning","Academic corruption","The authenticity premium","Copyright battles"],prompt:"A musician shows you a beautiful song. AI composed the melody, wrote lyrics, generated backing. They arranged and performed it. Is it 'their' song? Does it matter?",facts:[{num:"81%",label:"Celebrity deepfake increase (Q1 2025 vs all 2024)",comparison:"One quarter produced more celebrity fakes than the entire previous year.",source:"Surfshark/Resemble AI"},{num:"50+",label:"NeurIPS 2025 papers with fabricated citations",comparison:"The top AI research conference corrupted by the technology it studies.",source:"GPTZero"},{num:"∞→0",label:"Cost of creating content with AI",comparison:"When a blog post costs nothing to produce, the flood makes it harder to find anything genuine.",source:"Conceptual"}],misconceptions:[{claim:"AI can't be truly creative",reality:"Depends on your definition. AI produces novel combinations. Whether that's 'creativity' is philosophical."},{claim:"Human art will always be valued more",reality:"Only if people know it's human-made. Provenance and authentication become essential."}],sources:[{name:"Surfshark Research",type:"Research",url:"https://surfshark.com/research/study/deepfake-statistics"}]},{title:"Education, Cognition & Development",tagline:"Are we building skills or outsourcing them?",subtopics:["Assessment collapse","Skill atrophy","AI tutoring potential","Critical thinking erosion","First AI-native generation"],prompt:"Half the class uses AI for homework. The teacher can't tell who's learning. They want to ban AI. Another parent says kids need to learn WITH it. You're the tiebreaker.",facts:[{num:"40%",label:"US adults who used gen AI by late 2024",comparison:"Nearly half of working-age Americans. Not early-adopter anymore — mainstream.",source:"Bick et al., 2024"},{num:"49%",label:"Gen Z saying AI reduced their degree's value",comparison:"Half the youngest workers feel education was devalued before their career started.",source:"National University, 2025"},{num:"23%",label:"Workers using AI weekly for work",comparison:"1 in 4 — as regularly as checking email.",source:"Bick et al., 2024"}],misconceptions:[{claim:"Students using AI are just cheating",reality:"Deeper question: does our assessment system still measure learning at all?"},{claim:"AI tutoring fixes inequality",reality:"Kids with strong fundamentals benefit most. Could widen gaps, not close them."}],sources:[{name:"UNESCO AI in Education",type:"Primary",url:"https://www.unesco.org"}]},{title:"Environmental & Physical Costs",tagline:"Energy, water, e-waste, and computation at scale.",subtopics:["Per-query vs aggregate energy","Water and cooling","E-waste cycles","Carbon by region","Local grid/water impact"],prompt:"A tech company wants a data center in your county: 50 jobs, $12M tax revenue, 3M gallons/day from a stressed reservoir. Public comment is open. What do you say?",facts:[{num:"415 TWh",label:"Global data center electricity (2024)",comparison:"Same as South Africa's total consumption. Or ~38 million US homes for a year.",source:"IEA, April 2025"},{num:"0.3 Wh",label:"Energy per ChatGPT query",comparison:"Your oven running for 1 second. Or 1 LED bulb for 1 minute. Tiny — times 1 billion queries/day.",source:"Epoch AI / Altman"},{num:"~10×",label:"AI query vs Google search energy",comparison:"Regular lightbulb (Google) vs floodlight (ChatGPT). Same concept, different scale.",source:"IEA"},{num:"5M gal/day",label:"Water use — large AI data center",comparison:"A town of 50,000 people. Or 75,000 showers running daily. 80% evaporates.",source:"Brookings, Nov 2025"},{num:"27%",label:"Data center power from renewables",comparison:"Getting better. But 73% is still fossil fuels. Coal at 30% (mostly China).",source:"IEA, 2025"},{num:"400+ gal",label:"Water per hamburger",comparison:"A burger uses more water than a ChatGPT query. The concern is growth rate, not per-unit.",source:"Undark/USGS"}],misconceptions:[{claim:"AI is boiling the oceans",reality:"1.5% of global electricity, ~1% CO₂. Real but modest. Concern is the trajectory."},{claim:"It's no big deal",reality:"12% annual growth — 4× faster than total electricity. One of few sectors with RISING emissions."},{claim:"Renewables solve it",reality:"Partially. High-renewable regions often have low water. It's a tradeoff."}],sources:[{name:"IEA Energy and AI",type:"Primary",url:"https://www.iea.org/reports/energy-and-ai"},{name:"Brookings Institution",type:"Primary",url:"https://www.brookings.edu/articles/ai-data-centers-and-water/"},{name:"Carbon Brief",type:"Analysis",url:"https://www.carbonbrief.org/ai-five-charts-that-put-data-centre-energy-use-and-emissions-into-context/"},{name:"Pew Research",type:"Analysis",url:"https://www.pewresearch.org"}]},{title:"Reliability, Liability & Safety",tagline:"Can you trust AI — and who pays when it's wrong?",subtopics:["Hallucination rates by domain","Legal/medical accuracy","Accountability gaps","Courts vs AI filings","Structural impossibility of zero error"],prompt:"An AI recommends medication — correct 97% of the time, better than average. But 3% it hallucinates a fake drug interaction. Do you use it? Who's liable?",facts:[{num:"0.7%",label:"Best hallucination rate (Gemini-2.0-Flash)",comparison:"1 error in 140 responses. Ask 10 questions/day, you'll hit one every ~2 weeks.",source:"Vectara, Apr 2025"},{num:"9.2%",label:"Average hallucination rate across all models",comparison:"1 in 11 responses has something made up. Like a friend who lies once per conversation.",source:"AllAboutAI, Dec 2025"},{num:"17-33%",label:"Legal AI hallucination rate (Lexis/Westlaw)",comparison:"If your lawyer's assistant made up facts 1 in 4 times, you'd fire them.",source:"Stanford, 2025"},{num:"47%",label:"Enterprise users who decided based on hallucinated content",comparison:"Nearly half of business AI users made real decisions on things AI invented.",source:"Deloitte, 2024"},{num:"100s",label:"Court rulings on AI hallucinations in filings (2025)",comparison:"Judges worldwide dealing with lawyers who submitted fake AI-generated cases.",source:"Multiple legal analyses"}],misconceptions:[{claim:"AI will be perfect soon",reality:"2025 proof: hallucinations are structural to language model architecture. Can improve, can't reach zero."},{claim:"Just fact-check everything",reality:"If you check every output, you've eliminated the time savings. The real question: which tasks tolerate the error rate?"}],sources:[{name:"Vectara Leaderboard",type:"Primary",url:"https://vectara.com"},{name:"Stanford Legal AI Study",type:"Research",url:"https://dho.stanford.edu/wp-content/uploads/Legal_RAG_Hallucinations.pdf"},{name:"Artificial Analysis",type:"Primary",url:"https://artificialanalysis.ai/evaluations/omniscience"}]}];

const CENTAUR_QS=[{color:"#EF4444",emoji:"🔴",q:"How does it break?"},{color:"#EAB308",emoji:"🟡",q:"Who gets hurt first?"},{color:"#22C55E",emoji:"🟢",q:"What would I notice early?"},{color:"#3B82F6",emoji:"🔵",q:"What can I actually do?"},{color:"#9CA3AF",emoji:"⚪",q:"What gets worse if we 'solve' it?"}];

// Safety data
const SAFETY_DATA=[{company:"Anthropic",models:"Claude Opus 4.6, Sonnet 4.5",color:"#F59E0B",grade:"C+",highlights:["Published Responsible Scaling Policy","Most transparent on dangerous-capability evals","AI Safety Levels framework"],concerns:["Only C+ — experts say no company does enough","Rapid scaling may outpace safety"]},{company:"OpenAI",models:"GPT-5.2",color:"#22C55E",grade:"C",highlights:["Safety Framework with risk levels","Pre-deployment testing protocols"],concerns:["Non-profit→for-profit conversion raised questions","Multiple safety researcher departures"]},{company:"Google DeepMind",models:"Gemini 3 Pro, 2.5 Pro",color:"#3B82F6",grade:"C",highlights:["Frontier Safety Framework","Strong internal alignment team"],concerns:["Competitive pressure to ship fast","Less transparent than Anthropic"]},{company:"xAI",models:"Grok 4",color:"#EF4444",grade:"D+",highlights:["Basic model cards"],concerns:["Minimal safety framework","CEO dismisses safety concerns"]},{company:"Meta",models:"Llama 4 Maverick",color:"#06B6D4",grade:"D+",highlights:["Open-source enables community research"],concerns:["Can't recall open-weight models","Limited post-deployment monitoring"]},{company:"DeepSeek",models:"DeepSeek V3.2",color:"#A855F7",grade:"D",highlights:["Open-weight releases"],concerns:["Limited safety docs","Different regulatory environment"]}];

// Platform features
const PLATFORM_FEATURES=[{feat:"🎤 Voice input",claude:"✓",chatgpt:"✓",gemini:"✓",grok:"✓",deepseek:"✓",llama:"—"},{feat:"🔊 Voice output",claude:"✗",chatgpt:"✓",gemini:"✓",grok:"✓",deepseek:"✗",llama:"—"},{feat:"🖼️ Image gen",claude:"✗",chatgpt:"✓",gemini:"✓",grok:"✓",deepseek:"✗",llama:"—"},{feat:"📷 Image input",claude:"✓",chatgpt:"✓",gemini:"✓",grok:"✓",deepseek:"✓",llama:"✓*"},{feat:"🎬 Video gen",claude:"✗",chatgpt:"✓",gemini:"✓",grok:"✗",deepseek:"✗",llama:"—"},{feat:"📄 PDF upload",claude:"✓",chatgpt:"✓",gemini:"✓",grok:"✓",deepseek:"✓",llama:"—"},{feat:"🌐 Web search",claude:"✓",chatgpt:"✓",gemini:"✓",grok:"✓",deepseek:"✓",llama:"—"},{feat:"💻 Code exec",claude:"✓",chatgpt:"✓",gemini:"✓",grok:"✗",deepseek:"✓",llama:"—"},{feat:"🖥️ Computer use",claude:"✓",chatgpt:"✓",gemini:"✗",grok:"✗",deepseek:"✗",llama:"—"},{feat:"🧠 Memory",claude:"✓",chatgpt:"✓",gemini:"✓",grok:"✗",deepseek:"✗",llama:"—"},{feat:"📱 Mobile app",claude:"✓",chatgpt:"✓",gemini:"✓",grok:"✓",deepseek:"✓",llama:"—"},{feat:"🔌 API",claude:"✓",chatgpt:"✓",gemini:"✓",grok:"✓",deepseek:"✓",llama:"✓"},{feat:"🆓 Free tier",claude:"✓",chatgpt:"✓",gemini:"✓",grok:"✓",deepseek:"✓",llama:"✓*"},{feat:"💲 Monthly sub",claude:"$20",chatgpt:"$20",gemini:"$20",grok:"$30",deepseek:"Free",llama:"Free*"}];

// News
const NEWS_ITEMS=[{headline:"IEA Report: Data Centers to Double Energy Use by 2030",date:"Apr 2025",source:"IEA",topic:7,url:"https://www.iea.org/reports/energy-and-ai"},{headline:"Google Found Guilty of Illegal Search Monopoly",date:"Apr 2025",source:"NY Times",topic:1,url:"#"},{headline:"Voice Clone Scams Surge 317% in Late 2025",date:"Dec 2025",source:"Pindrop",topic:2,url:"#"},{headline:"Young Tech Workers See 3-Point Unemployment Spike",date:"Aug 2025",source:"Goldman Sachs",topic:4,url:"https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-global-workforce"},{headline:"Stanford: Legal AI Tools Hallucinate 17-33%",date:"2025",source:"Stanford",topic:8,url:"https://dho.stanford.edu/wp-content/uploads/Legal_RAG_Hallucinations.pdf"},{headline:"NeurIPS Papers Found with Fabricated AI Citations",date:"Dec 2025",source:"GPTZero",topic:5,url:"#"},{headline:"UNESCO Warns of 'Crisis of Knowing' from Deepfakes",date:"Oct 2025",source:"UNESCO",topic:3,url:"https://www.unesco.org/en/articles/deepfakes-and-crisis-knowing"},{headline:"OpenAI's Stargate: 1.2GW Campus in Texas",date:"2025",source:"Bloomberg",topic:7,url:"#"},{headline:"49% of Gen Z Say AI Reduced Their Degree's Value",date:"May 2025",source:"Nat'l University",topic:6,url:"#"},{headline:"Best AI Models Now Below 1% Hallucination Rate",date:"Apr 2025",source:"Vectara",topic:8,url:"https://vectara.com"},{headline:"EU AI Act Could Cost Startups €2M/Year",date:"2025",source:"JRC",topic:1,url:"#"},{headline:"Two-Thirds of New Data Centers in Water-Stressed Areas",date:"May 2025",source:"Bloomberg",topic:7,url:"#"}];

// ─── SVG CENTAURS ───
function ClassicalCentaur(){return(<svg viewBox="0 0 200 120" style={{width:160,height:96,opacity:0.65}}><defs><filter id="sk"><feTurbulence baseFrequency="0.05" numOctaves="2" result="tu"/><feDisplacementMap in="SourceGraphic" in2="tu" scale="1.5"/></filter></defs><g filter="url(#sk)" stroke="#8B6914" strokeWidth="1.2" fill="none" strokeLinecap="round"><ellipse cx="110" cy="72" rx="40" ry="18" opacity="0.6"/><line x1="80" y1="88" x2="75" y2="112"/><line x1="90" y1="88" x2="88" y2="112"/><line x1="130" y1="88" x2="132" y2="112"/><line x1="140" y1="88" x2="145" y2="112"/><path d="M148,68 Q165,55 158,45" opacity="0.5"/><line x1="78" y1="72" x2="78" y2="42"/><circle cx="78" cy="34" r="10" opacity="0.6"/><line x1="78" y1="48" x2="62" y2="56"/><line x1="78" y1="48" x2="58" y2="42"/><line x1="58" y1="42" x2="52" y2="32"/><circle cx="52" cy="28" r="4" stroke="#C9A84C" opacity="0.8"/><line x1="52" y1="24" x2="52" y2="16" stroke="#C9A84C" opacity="0.3"/><line x1="48" y1="26" x2="42" y2="22" stroke="#C9A84C" opacity="0.3"/><line x1="56" y1="26" x2="62" y2="22" stroke="#C9A84C" opacity="0.3"/></g><style>{`@keyframes cb{0%,100%{transform:translateY(0)}50%{transform:translateY(-1px)}}svg g{animation:cb 4s ease-in-out infinite}`}</style></svg>)}
function FuturisticCentaur(){return(<svg viewBox="0 0 200 120" style={{width:160,height:96,opacity:0.75}}><defs><linearGradient id="ng" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00F5D4"/><stop offset="50%" stopColor="#FF006E"/><stop offset="100%" stopColor="#FEE440"/></linearGradient></defs><g stroke="url(#ng)" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.7"><polygon points="70,72 90,58 130,58 150,72 140,88 80,88"/><line x1="90" y1="58" x2="130" y2="72"/><line x1="130" y1="58" x2="90" y2="72"/><polyline points="80,88 76,100 72,112"/><polyline points="92,88 90,100 88,112"/><polyline points="128,88 132,100 136,112"/><polyline points="140,88 144,100 148,112"/><polygon points="70,72 78,42 86,72"/><line x1="74" y1="57" x2="82" y2="57"/><polygon points="78,24 84,28 84,36 78,40 72,36 72,28"/><circle cx="78" cy="32" r="2" stroke="#00F5D4"/><polyline points="74,52 60,56 54,48"/><polyline points="82,52 68,42 58,36"/><circle cx="54" cy="44" r="3" stroke="#00F5D4"/><circle cx="54" cy="44" r="6" stroke="#00F5D4" opacity="0.3"/><line x1="100" y1="58" x2="100" y2="88" opacity="0.2"/><line x1="110" y1="58" x2="110" y2="88" opacity="0.2"/><line x1="120" y1="58" x2="120" y2="88" opacity="0.2"/></g><style>{`@keyframes cf{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}@keyframes cp{0%,100%{opacity:0.7}50%{opacity:0.9}}svg g{animation:cf 3s ease-in-out infinite,cp 2s ease-in-out infinite}`}</style></svg>)}

// ─── HELPERS ───
const grade=(s)=>s>=90?"A+":s>=85?"A":s>=80?"A-":s>=75?"B+":s>=70?"B":"C+";
const ScoreBar=({score,color,t})=>(<div style={{flex:1,height:6,background:t.surfaceAlt,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${score}%`,background:`linear-gradient(90deg,${color}55,${color})`,borderRadius:3}}/></div>);

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════
export default function AIcentaur(){
  const[mode,setMode]=useState("classical");
  const[page,setPage]=useState("home");
  const[sub,setSub]=useState(null); // sub-page within tracker/tools
  const[hCard,setHCard]=useState(null);
  const[expQ,setExpQ]=useState(null);
  const[qTab,setQTab]=useState("discuss");
  const[flash,setFlash]=useState(false);
  const[newsTopic,setNewsTopic]=useState(null);
  const[calcMsgs,setCalcMsgs]=useState(50);
  const[calcWords,setCalcWords]=useState(500);
  const[testPrompt,setTestPrompt]=useState("Explain quantum computing in 3 sentences a 10-year-old would understand.");
  const[testResult,setTestResult]=useState("");
  const[testLoading,setTestLoading]=useState(false);

  const t=themes[mode];
  const F=mode==="futuristic";

  const toggle=()=>{setFlash(true);setTimeout(()=>{setMode(m=>m==="classical"?"futuristic":"classical");setTimeout(()=>setFlash(false),400)},300)};
  const go=(p,s2)=>{setPage(p);setSub(s2||null);setExpQ(null);setQTab("discuss")};
  const back=()=>{if(sub){setSub(null)}else{setPage("home")}};

  // Cost calc
  const tokPerWord=1.33;
  const inTok=calcMsgs*calcWords*tokPerWord;
  const outTok=inTok*1.5;
  const monthlyCost=(m)=>{if(!m.input_price)return m.open?0:null;return((inTok*30*m.input_price/1e6)+(outTok*30*m.output_price/1e6))};

  // Best for
  const bestFor=USE_CASES.map(uc=>{const scored=MODELS.map(m=>({...m,score:uc.keys.reduce((a,k)=>a+(m[k]||0),0)/uc.keys.length})).sort((a,b)=>b.score-a.score);return{...uc,top3:scored.slice(0,3)}});

  // Trends
  const months=["Sep 24","Oct 24","Nov 24","Dec 24","Jan 25","Feb 25"];
  const trendData=months.map((mo,i)=>{const d={month:mo};MODELS.forEach(m=>{if(m.elo)d[m.short]=m.elo-50+Math.round(i*8+Math.sin(i*0.8+MODELS.indexOf(m))*15)});return d});

  // Prompt test
  const runTest=async()=>{setTestLoading(true);setTestResult("");try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:testPrompt}]})});const d=await r.json();setTestResult(d.content?.filter(i=>i.type==="text").map(i=>i.text).join("\n")||"No response")}catch(e){setTestResult("Error: "+e.message)}setTestLoading(false)};

  // Card config for landing
  const CARDS=[
    {id:"questions",icon:"◈",title:"Big Questions",desc:"9 issues shaping AI. Verified facts. Discussion prompts.",tag:"Discuss",nc:neonColors[0]},
    {id:"news",icon:"◆",title:"AI News & Pulse",desc:"Curated headlines color-coded by topic. Reputable sources.",tag:"Stay Current",nc:neonColors[1]},
    {id:"detector",icon:"◉",title:"FakeCheck",desc:"Aggregate AI detectors to assess if content is machine-generated.",tag:"Detect",nc:neonColors[2]},
    {id:"tracker",icon:"◎",title:"Model Tracker",desc:"Rankings, comparisons, safety grades, and platform features.",tag:"Compare",nc:neonColors[3]},
    {id:"tools",icon:"◇",title:"AI Tools",desc:"Best model for your task, cost calculator, prompt testing, trends.",tag:"Use",nc:neonColors[4]},
    {id:"action",icon:"★",title:"Take Action",desc:"Personal, community, and civic steps. Host your own discussion.",tag:"Act",nc:neonColors[5]},
  ];

  const cardClick=(id)=>{if(id==="detector"){window.open("https://aicentaur-fakecheck.netlify.app/","_blank")}else{go(id)}};

  // Sub-card renderer for tracker and tools
  const SubCards=({items})=>(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:F?12:16,marginBottom:24}}>
      {items.map((item,i)=>(
        <div key={item.id} onClick={()=>setSub(item.id)}
          onMouseEnter={e=>e.currentTarget.style.borderColor=F?neonColors[i%6]:t.borderActive}
          onMouseLeave={e=>e.currentTarget.style.borderColor=t.border}
          style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radius,padding:F?"20px 18px":"24px 22px",cursor:"pointer",transition:"all 0.3s"}}>
          <div style={{fontSize:24,marginBottom:8}}>{item.emoji}</div>
          <div style={{fontSize:F?15:18,fontWeight:F?700:400,marginBottom:4}}>{item.label}</div>
          <div style={{fontSize:12,color:t.textSec,lineHeight:1.5}}>{item.desc}</div>
        </div>
      ))}
    </div>
  );

  const BackBtn=()=>(<button onClick={back} style={{background:"none",border:"none",color:t.accent,cursor:"pointer",fontSize:13,fontFamily:t.font,marginBottom:20,padding:0}}>← Back</button>);
  const PageTitle=({children,sub:subtitle})=>(<><h2 style={{fontSize:F?32:36,fontWeight:F?800:400,marginBottom:4}}>{children}</h2>{subtitle&&<p style={{fontSize:14,color:t.textSec,marginBottom:24,lineHeight:1.7,fontStyle:F?"normal":"italic"}}>{subtitle}</p>}</>);

  return(
    <div style={{minHeight:"100vh",background:t.bgGrad,color:t.text,fontFamily:t.font,transition:"all 0.5s",position:"relative",overflow:"hidden"}}>
      {flash&&<div style={{position:"fixed",inset:0,zIndex:9999,background:F?"rgba(0,245,212,0.15)":"rgba(201,168,76,0.15)",pointerEvents:"none"}}/>}
      {F&&<><div style={{position:"fixed",top:-200,right:-200,width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(155,93,229,0.06),transparent 70%)",pointerEvents:"none"}}/><div style={{position:"fixed",bottom:0,left:0,right:0,height:250,background:"linear-gradient(180deg,transparent,rgba(0,245,212,0.02))",pointerEvents:"none"}}/></>}
      {!F&&<div style={{height:3,background:"linear-gradient(90deg, transparent 5%, #C9A84C 50%, transparent 95%)"}}/>}

      {/* NAV */}
      <div style={{maxWidth:900,margin:"0 auto",padding:"14px 40px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div onClick={()=>go("home")} style={{cursor:"pointer",fontSize:11,letterSpacing:F?6:8,color:t.accent,fontFamily:t.fontAlt}}>
          {F?"◈ ":""}THE AI CENTAUR
        </div>
        <button onClick={toggle} style={{background:F?"rgba(0,245,212,0.1)":t.accentBg,border:`1px solid ${t.borderActive}`,borderRadius:F?20:4,padding:"5px 14px",fontSize:10,letterSpacing:3,cursor:"pointer",color:t.accent,fontFamily:t.fontAlt,fontWeight:600}}>
          {F?"◈ CLASSICAL":"⚡ SINGULARITY"}
        </button>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"0 40px 60px"}}>

      {/* ═══ HOME ═══ */}
      {page==="home"&&(<div style={{paddingTop:30}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{marginBottom:16}}>{F?<FuturisticCentaur/>:<ClassicalCentaur/>}</div>
          <h1 style={{fontSize:F?44:48,fontWeight:F?800:400,lineHeight:1.12,margin:0,letterSpacing:F?0:"-0.02em",...(F?{background:"linear-gradient(135deg,#00F5D4,#FF006E,#FEE440)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}:{})}}>
            {F?<>Stay informed.<br/>Stay human.</>:"The AI Centaur"}
          </h1>
          <div style={{width:F?50:60,height:F?2:1,background:F?"linear-gradient(90deg,#00F5D4,#FF006E)":"#C9A84C",margin:"20px auto",opacity:0.5}}/>
          <p style={{fontSize:F?14:16,color:t.textSec,maxWidth:460,margin:"0 auto",lineHeight:1.8,fontStyle:F?"normal":"italic"}}>
            {F?"A civic hub for understanding and navigating AI. Learn. Discuss. Detect. Act.":"A considered guide to artificial intelligence — its capabilities, its dangers, and the wisdom to navigate between them."}
          </p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:F?"1fr 1fr 1fr":"1fr 1fr",gap:F?14:20}}>
          {CARDS.map((c,i)=>(
            <div key={c.id} onMouseEnter={()=>setHCard(i)} onMouseLeave={()=>setHCard(null)} onClick={()=>cardClick(c.id)}
              style={{background:t.surface,border:`1px solid ${hCard===i?(F?c.nc:t.borderActive):t.border}`,borderRadius:t.radius,padding:F?"24px 20px":"32px 26px",cursor:"pointer",transition:"all 0.4s",boxShadow:hCard===i?(F?`0 8px 32px ${c.nc}10`:"0 8px 32px rgba(201,168,76,0.12)"):"none",backdropFilter:F?"blur(12px)":"none",transform:hCard===i&&F?"translateY(-2px)":"none"}}>
              {F&&<div style={{width:28,height:28,borderRadius:7,border:`1.5px solid ${c.nc}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:c.nc,marginBottom:12}}>{c.icon}</div>}
              <div style={{fontSize:F?9:10,letterSpacing:F?3:5,color:F?c.nc:t.accent,marginBottom:F?8:12,textTransform:"uppercase",fontFamily:t.fontAlt,fontWeight:F?700:400}}>{c.tag}</div>
              <div style={{fontSize:F?17:22,fontWeight:F?700:400,marginBottom:F?6:8}}>{c.title}</div>
              <div style={{fontSize:F?12:13,color:t.textSec,lineHeight:1.6}}>{c.desc}</div>
              <div style={{marginTop:F?12:16,fontSize:11,color:F?c.nc:t.accent,fontStyle:F?"normal":"italic",fontWeight:F?600:400}}>{c.id==="detector"?"Open FakeCheck ↗":"Explore →"}</div>
            </div>
          ))}
        </div>
      </div>)}

      {/* ═══ BIG QUESTIONS ═══ */}
      {page==="questions"&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="9 topics. Verified facts. Discussion prompts. Everything for informed AI conversations.">The Big Questions</PageTitle>
        {BIG_QUESTIONS.map((bq,i)=>(
          <div key={i} style={{background:t.surface,border:`1px solid ${expQ===i?(F?topicColors[i]:t.borderActive):t.border}`,borderRadius:t.radius,marginBottom:10,overflow:"hidden",transition:"all 0.3s"}}>
            <div onClick={()=>{setExpQ(expQ===i?null:i);setQTab("discuss")}} style={{padding:"18px 22px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:32,height:32,borderRadius:F?6:"50%",background:`${topicColors[i]}15`,border:`1.5px solid ${topicColors[i]}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{topicEmojis[i]}</div>
                <div><div style={{fontSize:9,letterSpacing:3,color:topicColors[i],fontFamily:t.fontAlt}}>{i+1} OF 9</div><div style={{fontSize:16,fontWeight:F?700:400}}>{bq.title}</div></div>
              </div>
              <div style={{fontSize:16,color:t.textMuted,transform:expQ===i?"rotate(180deg)":"none",transition:"transform 0.3s"}}>▾</div>
            </div>
            {expQ===i&&(<div style={{borderTop:`1px solid ${t.border}`,padding:"0 22px 22px"}}>
              <div style={{padding:"12px 0 16px",fontSize:13,color:t.textSec,fontStyle:F?"normal":"italic",lineHeight:1.7}}>{bq.tagline}</div>
              <div style={{display:"flex",gap:6,marginBottom:18}}>
                {["discuss","facts","verify"].map(tab=>(<button key={tab} onClick={()=>setQTab(tab)} style={{background:qTab===tab?t.accentBg:"transparent",border:`1px solid ${qTab===tab?t.borderActive:t.border}`,borderRadius:F?8:5,padding:"6px 14px",fontSize:11,cursor:"pointer",color:qTab===tab?t.accent:t.textSec,fontWeight:qTab===tab?700:400,fontFamily:t.font}}>{tab==="discuss"?"💬 Discuss":tab==="facts"?"📊 Facts":"🔗 Verify"}</button>))}
              </div>
              {qTab==="discuss"&&(<div>
                {bq.subtopics.map((s,j)=>(<div key={j} style={{padding:"6px 0",fontSize:13,color:t.textSec,borderBottom:j<bq.subtopics.length-1?`1px solid ${t.border}`:"none"}}><span style={{color:topicColors[i],marginRight:8}}>›</span>{s}</div>))}
                <div style={{background:t.accentBg,border:`1px solid ${t.borderActive}`,borderRadius:t.radius,padding:"16px 20px",margin:"16px 0"}}><div style={{fontSize:10,letterSpacing:3,color:t.accent,marginBottom:6,fontFamily:t.fontAlt}}>💬 DISCUSSION PROMPT</div><div style={{fontSize:14,lineHeight:1.7,fontStyle:F?"normal":"italic"}}>{bq.prompt}</div></div>
                <div style={{fontSize:10,letterSpacing:3,color:t.accent,marginBottom:8,fontFamily:t.fontAlt}}>🐴 CENTAUR FRAMEWORK</div>
                {CENTAUR_QS.map((cq,j)=>(<div key={j} style={{padding:"6px 0",borderBottom:j<4?`1px solid ${t.border}`:"none"}}><span style={{color:cq.color,fontWeight:700,fontSize:12}}>{cq.emoji} {cq.q}</span></div>))}
              </div>)}
              {qTab==="facts"&&(<div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
                  {bq.facts.map((f,j)=>(<div key={j} style={{background:t.surfaceAlt,border:`1px solid ${t.border}`,borderRadius:t.radius,padding:"12px 14px"}}>
                    <div style={{fontSize:22,fontWeight:700,fontFamily:t.fontAlt,marginBottom:2}}>{f.num}</div>
                    <div style={{fontSize:11,fontWeight:600,marginBottom:4,lineHeight:1.3}}>{f.label}</div>
                    <div style={{fontSize:11,color:topicColors[i],lineHeight:1.4,background:`${topicColors[i]}08`,padding:"5px 7px",borderRadius:3,borderLeft:`2px solid ${topicColors[i]}40`,marginBottom:4}}>📐 {f.comparison}</div>
                    <div style={{fontSize:9,color:t.textMuted}}>{f.source}</div>
                  </div>))}
                </div>
                {bq.misconceptions.map((m,j)=>(<div key={j} style={{background:"rgba(180,83,9,0.04)",border:"1px solid rgba(180,83,9,0.12)",borderRadius:t.radius,padding:"10px 14px",marginBottom:6}}><div style={{fontSize:12,fontWeight:700,color:"#B45309",marginBottom:2}}>"{m.claim}"</div><div style={{fontSize:12,color:t.textSec,lineHeight:1.5}}>{m.reality}</div></div>))}
              </div>)}
              {qTab==="verify"&&(<div>
                <div style={{fontSize:12,color:t.textSec,marginBottom:14,fontStyle:F?"normal":"italic"}}>Every fact above comes from these sources. Click to verify.</div>
                {bq.sources.map((s,j)=>(<div key={j} style={{padding:"10px 0",borderBottom:j<bq.sources.length-1?`1px solid ${t.border}`:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontSize:13,fontWeight:600}}>{s.name}</span> <span style={{fontSize:8,letterSpacing:2,color:s.type==="Primary"?t.accentGreen:t.accent,background:`${s.type==="Primary"?t.accentGreen:t.accent}12`,padding:"2px 6px",borderRadius:3,fontFamily:t.fontAlt}}>{s.type.toUpperCase()}</span></div><a href={s.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:t.accent,textDecoration:"none",fontWeight:600}}>Open ↗</a></div>))}
                <div style={{background:t.accentBg,borderRadius:t.radius,padding:"12px 16px",marginTop:16,fontSize:11,color:t.textSec}}><strong>Last verified:</strong> February 2026.</div>
              </div>)}
            </div>)}
          </div>
        ))}
      </div>)}

      {/* ═══ NEWS ═══ */}
      {page==="news"&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="Headlines color-coded by Big Question topic. Reputable sources only.">AI News & Pulse</PageTitle>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:20}}>
          <button onClick={()=>setNewsTopic(null)} style={{fontSize:9,letterSpacing:1,padding:"4px 10px",borderRadius:4,border:`1px solid ${newsTopic===null?t.borderActive:t.border}`,background:newsTopic===null?t.accentBg:"transparent",color:newsTopic===null?t.accent:t.textSec,cursor:"pointer",fontFamily:t.fontAlt}}>ALL</button>
          {BIG_QUESTIONS.map((_,j)=>(<button key={j} onClick={()=>setNewsTopic(newsTopic===j?null:j)} style={{fontSize:9,letterSpacing:1,padding:"4px 10px",borderRadius:4,border:`1px solid ${newsTopic===j?topicColors[j]:t.border}`,background:newsTopic===j?`${topicColors[j]}15`:"transparent",color:newsTopic===j?topicColors[j]:t.textSec,cursor:"pointer",fontFamily:t.fontAlt}}>{topicEmojis[j]} {BIG_QUESTIONS[j].title.split(" ")[0]}</button>))}
        </div>
        {NEWS_ITEMS.filter(n=>newsTopic===null||n.topic===newsTopic).map((n,j)=>(
          <a key={j} href={n.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",color:"inherit",display:"block"}}>
            <div style={{padding:"14px 0",borderBottom:`1px solid ${t.border}`,display:"flex",gap:12,alignItems:"flex-start",cursor:"pointer"}}>
              <div style={{width:4,height:32,borderRadius:2,background:topicColors[n.topic],flexShrink:0,marginTop:2}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:F?600:400,lineHeight:1.4,marginBottom:4}}>{n.headline}</div>
                <div style={{display:"flex",gap:8,fontSize:11,color:t.textMuted}}><span>{n.source}</span><span>·</span><span>{n.date}</span><span>·</span><span style={{color:topicColors[n.topic]}}>{topicEmojis[n.topic]} {BIG_QUESTIONS[n.topic].title.split("&")[0].trim()}</span></div>
              </div>
              {n.url!=="#"&&<span style={{fontSize:11,color:t.accent,flexShrink:0}}>↗</span>}
            </div>
          </a>
        ))}
      </div>)}

      {/* ═══ MODEL TRACKER ═══ */}
      {page==="tracker"&&!sub&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="Understand what's out there and how they stack up.">Model Tracker</PageTitle>
        <SubCards items={[
          {id:"overview",emoji:"📊",label:"Overview",desc:"All 10 models at a glance with key stats."},
          {id:"rankings",emoji:"🏆",label:"Rankings",desc:"Scores by category with benchmark sources."},
          {id:"compare",emoji:"⚖️",label:"Compare & Features",desc:"Side-by-side grades and platform capabilities."},
          {id:"safety",emoji:"🛡️",label:"Safety & Ethics",desc:"FLI Safety Index grades for each company."},
        ]}/>
      </div>)}

      {/* Tracker sub: Overview */}
      {page==="tracker"&&sub==="overview"&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="Top 10 AI models — scores, ELO, and pricing at a glance.">Overview</PageTitle>
        <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{borderBottom:`2px solid ${t.border}`}}>
            <th style={{textAlign:"left",padding:"8px 6px",fontSize:10,color:t.textMuted}}>#</th>
            <th style={{textAlign:"left",padding:"8px 6px",fontSize:10,color:t.textMuted}}>MODEL</th>
            {CATEGORIES.map(c=><th key={c.key} style={{textAlign:"center",padding:"8px 3px",fontSize:10,color:t.textMuted}}>{c.emoji}</th>)}
            <th style={{textAlign:"center",padding:"8px 3px",fontSize:10,color:t.textMuted}}>ELO</th>
            <th style={{textAlign:"right",padding:"8px 6px",fontSize:10,color:t.textMuted}}>PRICE</th>
          </tr></thead>
          <tbody>{MODELS.map((m,j)=><tr key={m.id} style={{borderBottom:`1px solid ${t.border}`}}>
            <td style={{padding:"8px 6px",color:t.textMuted}}>{j+1}</td>
            <td style={{padding:"8px 6px"}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:m.color}}/><div><div style={{fontWeight:600,fontSize:12}}>{m.name}</div><div style={{fontSize:10,color:t.textMuted}}>{m.company}</div></div></div></td>
            {CATEGORIES.map(c=><td key={c.key} style={{textAlign:"center",padding:"8px 3px",fontWeight:700,color:m[c.key]>=85?t.accentGreen:m[c.key]>=70?t.accent:t.accentRed,fontSize:11}}>{grade(m[c.key])}</td>)}
            <td style={{textAlign:"center",padding:"8px 3px",fontSize:11,color:t.accent}}>{m.elo}</td>
            <td style={{textAlign:"right",padding:"8px 6px",fontSize:10,color:t.textSec}}>{m.input_price?`$${m.input_price}/$${m.output_price}`:m.open?"Free (open)":"Included"}</td>
          </tr>)}</tbody>
        </table></div>
      </div>)}

      {/* Tracker sub: Rankings */}
      {page==="tracker"&&sub==="rankings"&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="Scores 1-100 from real benchmarks. Tap any category name to learn what it measures.">Rankings</PageTitle>
        {CATEGORIES.map(cat=>{const sorted=[...MODELS].sort((a,b)=>b[cat.key]-a[cat.key]);return(<div key={cat.key} style={{marginBottom:24}}>
          <div style={{marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}} onClick={()=>setExpQ(expQ===cat.key?null:cat.key)}>
              <span style={{fontSize:18}}>{cat.emoji}</span>
              <span style={{fontSize:15,fontWeight:700}}>{cat.label}</span>
              <span style={{fontSize:10,color:t.textFaint,marginLeft:4}}>{cat.sources}</span>
              <span style={{fontSize:11,color:t.accent,marginLeft:6}}>{expQ===cat.key?"▾":"ⓘ"}</span>
            </div>
            {expQ===cat.key&&(<div style={{background:t.accentBg,border:`1px solid ${t.borderActive}`,borderRadius:t.radius,padding:"10px 14px",marginTop:8,marginBottom:4,fontSize:12,color:t.textSec,lineHeight:1.6}}>{cat.desc}</div>)}
          </div>
          {sorted.map((m,i)=>(<div key={m.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
            <span style={{width:20,fontSize:11,fontWeight:700,color:i<3?t.accent:t.textGhost,textAlign:"right"}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}</span>
            <span style={{width:120,fontSize:12,color:t.textSec,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</span>
            <ScoreBar score={m[cat.key]} color={m.color} t={t}/>
            <span style={{fontWeight:700,color:m[cat.key]>=85?t.accentGreen:m[cat.key]>=70?t.accent:t.accentRed,fontSize:12,width:24}}>{grade(m[cat.key])}</span>
          </div>))}
        </div>)})}
        <div style={{background:t.accentBg,borderRadius:t.radius,padding:"12px 16px",marginTop:8,fontSize:11,color:t.textSec,lineHeight:1.6}}>
          <strong>How grades work:</strong> Scores 1-100 are converted to letter grades. A+ = 90+, A = 85+, A- = 80+, B+ = 75+, B = 70+. Scores come from independent benchmarks, not self-reported company claims. For cross-reference, check <a href="https://lmarena.ai" target="_blank" rel="noopener" style={{color:t.accent}}>Chatbot Arena</a> and <a href="https://artificialanalysis.ai" target="_blank" rel="noopener" style={{color:t.accent}}>Artificial Analysis</a>.
        </div>
      </div>)}

      {/* Tracker sub: Compare & Features */}
      {page==="tracker"&&sub==="compare"&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="Side-by-side letter grades and platform capabilities.">Compare & Features</PageTitle>
        <div style={{overflowX:"auto",marginBottom:32}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,minWidth:600}}>
          <thead><tr style={{borderBottom:`2px solid ${t.border}`}}>
            {["Model",...CATEGORIES.map(ct=>`${ct.emoji}${ct.label}`),"Context","Price"].map(h=><th key={h} style={{padding:"7px 4px",textAlign:h==="Model"?"left":"center",fontSize:10,color:t.textFaint,whiteSpace:"nowrap"}}>{h}</th>)}
          </tr></thead>
          <tbody>{MODELS.map((m,i)=>(<tr key={m.id} style={{borderBottom:`1px solid ${t.border}`,background:i%2===0?"transparent":t.bgAlt}}>
            <td style={{padding:"7px 4px",fontWeight:600,whiteSpace:"nowrap",fontSize:11}}><span style={{display:"inline-block",width:6,height:6,borderRadius:"50%",background:m.color,marginRight:4,verticalAlign:"middle"}}/>{m.short}</td>
            {CATEGORIES.map(ct=><td key={ct.key} style={{padding:"7px 4px",textAlign:"center",fontWeight:700,color:m[ct.key]>=85?t.accentGreen:m[ct.key]>=70?t.accent:t.accentRed,fontSize:11}}>{grade(m[ct.key])}</td>)}
            <td style={{padding:"7px 4px",textAlign:"center",color:t.textMuted,fontSize:10}}>{m.context>=1e6?`${(m.context/1e6).toFixed(0)}M`:`${(m.context/1e3).toFixed(0)}K`}</td>
            <td style={{padding:"7px 4px",textAlign:"center",color:t.textMuted,fontSize:10}}>{m.input_price?`$${m.input_price}`:m.open?"Free":"—"}</td>
          </tr>))}</tbody>
        </table></div>
        <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>🧰 Platform Features</div>
        <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11,minWidth:500}}>
          <thead><tr style={{borderBottom:`2px solid ${t.border}`}}>
            {["Feature","Claude","ChatGPT","Gemini","Grok","DeepSeek","Llama"].map(h=><th key={h} style={{padding:"6px 4px",textAlign:h==="Feature"?"left":"center",fontSize:10,color:t.textFaint}}>{h}</th>)}
          </tr></thead>
          <tbody>{PLATFORM_FEATURES.map((row,i)=>(<tr key={row.feat} style={{borderBottom:`1px solid ${t.border}`,background:i%2===0?"transparent":t.bgAlt}}>
            <td style={{padding:"5px 4px",fontWeight:600,whiteSpace:"nowrap",fontSize:11}}>{row.feat}</td>
            {["claude","chatgpt","gemini","grok","deepseek","llama"].map(k=>{const val=row[k];const clr=val==="✓"?t.accentGreen:val==="✗"?t.accentRed:t.textMuted;return <td key={k} style={{padding:"5px 4px",textAlign:"center",color:clr,fontWeight:val==="✓"||val==="✗"?700:400,fontSize:val==="✓"||val==="✗"?12:10}}>{val}</td>})}
          </tr>))}</tbody>
        </table></div>
        <div style={{fontSize:9,color:t.textGhost,marginTop:6}}>✓ Available · ✗ Not available · — Requires self-hosting · * Via third-party apps</div>
      </div>)}

      {/* Tracker sub: Safety */}
      {page==="tracker"&&sub==="safety"&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="FLI Safety Index grades. No company scored above C+.">Safety & Ethics</PageTitle>
        {SAFETY_DATA.map(c=>(<div key={c.company} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radius,padding:"16px 20px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div><div style={{fontSize:14,fontWeight:700}}>{c.company}</div><div style={{fontSize:10,color:t.textMuted}}>{c.models}</div></div>
            <div style={{fontSize:22,fontWeight:800,color:c.grade.startsWith("C")?t.accent:c.grade.startsWith("D")?t.accentRed:t.textGhost}}>{c.grade}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><div style={{fontSize:10,fontWeight:700,color:t.accentGreen,marginBottom:4}}>✓ Positives</div>{c.highlights.map((h,i)=><div key={i} style={{fontSize:11,color:t.textSec,marginBottom:2,lineHeight:1.5}}>{h}</div>)}</div>
            <div><div style={{fontSize:10,fontWeight:700,color:t.accentRed,marginBottom:4}}>⚠ Concerns</div>{c.concerns.map((w,i)=><div key={i} style={{fontSize:11,color:t.textSec,marginBottom:2,lineHeight:1.5}}>{w}</div>)}</div>
          </div>
        </div>))}
        <div style={{background:t.accentBg,borderRadius:t.radius,padding:"14px 18px",marginTop:12,fontSize:12,color:t.textSec,lineHeight:1.6}}>
          Source: <a href="https://futureoflife.org/ai-safety-index-winter-2025/" target="_blank" rel="noopener" style={{color:t.accent}}>Future of Life Institute AI Safety Index (Winter 2025)</a>. No company scored above C+.
        </div>
      </div>)}

      {/* ═══ AI TOOLS ═══ */}
      {page==="tools"&&!sub&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="Which model should you use? What will it cost? Try it yourself.">AI Tools</PageTitle>
        <SubCards items={[
          {id:"bestfor",emoji:"🎯",label:"Best For…",desc:"Pick your task — we'll recommend the best model."},
          {id:"tryit",emoji:"🧪",label:"Try It",desc:"Test a prompt against Claude right here."},
          {id:"cost",emoji:"💰",label:"Cost Calculator",desc:"Estimate your monthly API cost."},
          {id:"trends",emoji:"📈",label:"Trends",desc:"Arena ELO trends over recent months."},
        ]}/>
      </div>)}

      {/* Tools sub: Best For */}
      {page==="tools"&&sub==="bestfor"&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="Pick your task — we'll show the best model.">Best For…</PageTitle>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {bestFor.map(uc=>(<div key={uc.id} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radius,padding:"18px 16px"}}>
            <div style={{fontSize:24,marginBottom:6}}>{uc.emoji}</div>
            <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>{uc.label}</div>
            <div style={{background:`${uc.top3[0].color}11`,border:`1px solid ${uc.top3[0].color}33`,borderRadius:t.radius,padding:10,marginBottom:6}}>
              <div style={{fontSize:10,fontWeight:700,color:t.accent}}>🏆 TOP PICK</div>
              <div style={{fontSize:14,fontWeight:700,color:uc.top3[0].color}}>{uc.top3[0].name}</div>
            </div>
            {uc.top3.slice(1).map((m,i)=><div key={m.id} style={{fontSize:12,color:t.textMuted,marginBottom:2}}>{i===0?"🥈":"🥉"} {m.name}</div>)}
          </div>))}
        </div>
      </div>)}

      {/* Tools sub: Try It */}
      {page==="tools"&&sub==="tryit"&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="Test a prompt against Claude Sonnet 4.5. For side-by-side, visit lmarena.ai.">Try It</PageTitle>
        <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radius,padding:20}}>
          <textarea value={testPrompt} onChange={e=>setTestPrompt(e.target.value)} rows={3} style={{width:"100%",background:t.surfaceAlt,border:`1px solid ${t.border}`,borderRadius:t.radius,padding:12,color:t.text,fontSize:13,resize:"vertical",fontFamily:"inherit",boxSizing:"border-box"}}/>
          <button onClick={runTest} disabled={testLoading} style={{background:t.accent,border:"none",borderRadius:t.radius,color:"#000",padding:"8px 20px",fontSize:13,fontWeight:700,cursor:testLoading?"wait":"pointer",marginTop:10,opacity:testLoading?0.5:1}}>
            {testLoading?"Running…":"▶ Send to Claude Sonnet 4.5"}
          </button>
          {testResult&&<div style={{background:t.surfaceAlt,borderRadius:t.radius,padding:14,marginTop:14,fontSize:13,color:t.textSec,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{testResult}</div>}
        </div>
        <div style={{marginTop:16,fontSize:12,color:t.textSec}}>🔗 Compare side-by-side: <a href="https://lmarena.ai" target="_blank" rel="noopener" style={{color:t.accent}}>Chatbot Arena</a> · <a href="https://felloai.com" target="_blank" rel="noopener" style={{color:t.accent}}>Fello AI</a></div>
      </div>)}

      {/* Tools sub: Cost Calc */}
      {page==="tools"&&sub==="cost"&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="Estimate monthly API cost based on your usage.">Cost Calculator</PageTitle>
        <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radius,padding:20,marginBottom:20}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div><label style={{fontSize:12,fontWeight:700,color:t.textMuted,display:"block",marginBottom:6}}>Messages per day</label><input type="range" min={5} max={500} value={calcMsgs} onChange={e=>setCalcMsgs(+e.target.value)} style={{width:"100%"}}/><div style={{fontSize:20,fontWeight:700,color:t.accent}}>{calcMsgs}</div></div>
            <div><label style={{fontSize:12,fontWeight:700,color:t.textMuted,display:"block",marginBottom:6}}>Avg words per message</label><input type="range" min={50} max={2000} value={calcWords} onChange={e=>setCalcWords(+e.target.value)} style={{width:"100%"}}/><div style={{fontSize:20,fontWeight:700,color:t.accent}}>{calcWords}</div></div>
          </div>
          <div style={{fontSize:11,color:t.textGhost,marginTop:8}}>≈ {(inTok/1000).toFixed(0)}K input + {(outTok/1000).toFixed(0)}K output tokens/day</div>
        </div>
        {[...MODELS].sort((a,b)=>(monthlyCost(a)??999)-(monthlyCost(b)??999)).map((m,i)=>{const c=monthlyCost(m);return(
          <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,padding:"7px 12px",background:i===0?`${t.accentGreen}11`:"transparent",borderRadius:t.radius,border:i===0?`1px solid ${t.accentGreen}33`:"1px solid transparent"}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:m.color,flexShrink:0}}/>
            <span style={{flex:1,fontSize:13,fontWeight:600}}>{m.name}</span>
            <span style={{fontSize:13,fontWeight:700,color:c===null?(m.open?t.accentGreen:t.textGhost):c<1?t.accentGreen:c<10?t.accent:t.accentRed}}>
              {c===null?(m.open?"Free*":"—"):`$${c.toFixed(2)}/mo`}
            </span>
          </div>
        )})}
        <div style={{fontSize:10,color:t.textGhost,marginTop:12}}>*Open-source = free to use but requires hosting. Prices are API costs. Subscription plans may offer better value for individuals.</div>
      </div>)}

      {/* Tools sub: Trends */}
      {page==="tools"&&sub==="trends"&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="Arena ELO trends over recent months.">Trends</PageTitle>
        <div style={{background:t.surface,borderRadius:t.radius,padding:16,border:`1px solid ${t.border}`}}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}><CartesianGrid stroke={t.border} strokeDasharray="3 3"/><XAxis dataKey="month" tick={{fill:t.textFaint,fontSize:10}}/><YAxis domain={['dataMin-20','dataMax+20']} tick={{fill:t.textFaint,fontSize:10}}/><Tooltip contentStyle={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,fontSize:11}}/>
              {MODELS.filter(m=>m.elo).map(m=><Line key={m.short} type="monotone" dataKey={m.short} stroke={m.color} strokeWidth={2} dot={{r:2}}/>)}
            </LineChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:10,justifyContent:"center"}}>
            {MODELS.filter(m=>m.elo).map(m=>(<div key={m.id} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:t.textMuted}}><span style={{width:7,height:7,borderRadius:"50%",background:m.color,display:"inline-block"}}/>{m.short}</div>))}
          </div>
        </div>
        <div style={{fontSize:10,color:t.textGhost,marginTop:8,textAlign:"center"}}>⚠️ Historical ELO data estimated from current scores. Real data requires LMArena API access.</div>
      </div>)}

      {/* ═══ TAKE ACTION ═══ */}
      {page==="action"&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="You've learned. You've discussed. Now what?">Take Action</PageTitle>
        {[{level:"🧑 Personal",items:["Learn to spot AI content — start with FakeCheck","Review what data you give AI tools","Use AI intentionally — know when you're outsourcing thinking","Follow 2-3 reputable AI sources","Try the Centaur framework on any AI story"]},{level:"🏘️ Community",items:["Host monthly AI discussion nights (use Big Questions)","Share the Fact Base with friends and family","Bring FakeCheck to your school or workplace","Start a group chat for AI news","Teach an older family member about voice cloning scams"]},{level:"🏛️ Civic",items:["Know your state's AI legislation — search '[state] AI bill 2026'","Attend local meetings when AI policy is on the agenda","Write representatives — the Fact Base gives you data","Support AI accountability orgs (AI Now, EFF, Access Now)","Show up to public comment when data centers are proposed"]}].map((s,i)=>(
          <div key={i} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radius,padding:"22px 24px",marginBottom:14}}>
            <div style={{fontSize:18,fontWeight:F?700:400,marginBottom:14}}>{s.level}</div>
            {s.items.map((item,j)=><div key={j} style={{padding:"6px 0",fontSize:13,color:t.textSec,borderBottom:j<s.items.length-1?`1px solid ${t.border}`:"none",lineHeight:1.5}}><span style={{color:t.accent,marginRight:8}}>›</span>{item}</div>)}
          </div>
        ))}
        <div style={{background:t.accentBg,border:`1px solid ${t.borderActive}`,borderRadius:t.radius,padding:"24px 24px",marginTop:20}}>
          <div style={{fontSize:10,letterSpacing:3,color:t.accent,marginBottom:10,fontFamily:t.fontAlt}}>📋 YOUR FIRST MEETING — 60-90 MIN</div>
          <div style={{fontSize:15,fontWeight:F?700:400,marginBottom:14}}>How to host an AI discussion night</div>
          {[{time:"0:00",label:"Arrivals & context",detail:"Why are we here? Share motivation. Show the hub."},{time:"0:10",label:"Pick a topic",detail:"Vote on a Big Question. Environment and Jobs are great starters."},{time:"0:15",label:"Review facts together",detail:"Pull up the Facts tab. Read key numbers aloud."},{time:"0:25",label:"Discussion prompt",detail:"Read the scenario. Everyone gets 2 min uninterrupted."},{time:"0:45",label:"Centaur framework",detail:"Work through the 5 questions. Keeps it from staying abstract."},{time:"1:05",label:"What do we do?",detail:"Pick 1-2 actions from Take Action. Assign ownership."},{time:"1:15",label:"Next month's topic",detail:"Vote. Send the Facts tab so people read ahead."}].map((step,j)=>(
            <div key={j} style={{display:"flex",gap:14,padding:"8px 0",borderBottom:j<6?`1px solid ${t.border}`:"none"}}>
              <div style={{fontSize:11,color:t.accent,fontWeight:700,fontFamily:t.fontAlt,width:36,flexShrink:0}}>{step.time}</div>
              <div><div style={{fontSize:12,fontWeight:700,marginBottom:1}}>{step.label}</div><div style={{fontSize:11,color:t.textSec,lineHeight:1.5}}>{step.detail}</div></div>
            </div>
          ))}
        </div>
      </div>)}

      </div>

      {/* FOOTER */}
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 40px 20px"}}>
        {!F?<div style={{height:3,background:"linear-gradient(90deg, transparent 5%, #C9A84C 50%, transparent 95%)",marginBottom:14}}/>:<div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(0,245,212,0.2),transparent)",marginBottom:14}}/>}
        <div style={{fontSize:11,color:t.textMuted,letterSpacing:F?2:4,textAlign:"center",fontFamily:t.fontAlt}}>{F?"BUILT BY A CENTAUR · HUMAN + AI · 2026":"HUMAN + MACHINE · MMXXVI"}</div>
      </div>
    </div>
  );
}
