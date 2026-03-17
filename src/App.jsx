import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════
// THE AI CENTAUR — Hub v3
// ═══════════════════════════════════════════════════════════

const themes = {
  classical: {
    bg:"#F7F2E7",bgGrad:"linear-gradient(180deg,#F7F2E7,#EDE6D6)",surface:"#FFFCF5",surfaceAlt:"#F0E9D8",bgAlt:"#F0EBD9",
    border:"#E5DDD0",borderActive:"#C9A84C",borderLight:"#D4C9B0",
    text:"#2C2418",textSec:"#8C7A5E",textMuted:"#B8A888",textFaint:"#C8BFA0",textGhost:"#D4CBB4",
    accent:"#C9A84C",accentBg:"rgba(201,168,76,0.06)",accentGreen:"#16A34A",accentRed:"#B45309",accentBlue:"#1E5FA0",
    font:"Georgia,'Times New Roman',serif",fontAlt:"'Trebuchet MS','Lucida Sans',sans-serif",radius:4,
  },
  futuristic: {
    bg:"#0A0A0C",bgGrad:"linear-gradient(180deg,#0A0A0C,#0D0B15 40%,#120D1A)",surface:"rgba(255,255,255,0.02)",surfaceAlt:"rgba(255,255,255,0.04)",bgAlt:"rgba(255,255,255,0.03)",
    border:"rgba(255,255,255,0.04)",borderActive:"#00F5D4",borderLight:"rgba(255,255,255,0.06)",
    text:"#F0F0F0",textSec:"#888",textMuted:"#555",textFaint:"#444",textGhost:"#333",
    accent:"#00F5D4",accentBg:"rgba(0,245,212,0.06)",accentGreen:"#00F5D4",accentRed:"#FF006E",accentBlue:"#00BBF9",
    font:"'Segoe UI',Tahoma,sans-serif",fontAlt:"'Segoe UI',Tahoma,sans-serif",radius:14,
  },
};

const neonColors=["#FF006E","#00F5D4","#FEE440","#00BBF9","#9B5DE5","#FF8500"];
const topicColors=["#EF4444","#9333EA","#F97316","#3B82F6","#22C55E","#EC4899","#06B6D4","#84CC16","#F59E0B"];
const topicEmojis=["🤖","👁️","🔓","🪞","💼","🎨","📖","🌱","⚖️"];

// ─── MODELS ───
const MODELS=[
  {id:"claude-opus",name:"Claude Opus 4.6",short:"Opus 4.6",company:"Anthropic",color:"#F59E0B",reasoning:95,coding:93,writing:96,math:92,speed:55,knowledge:94,elo:1380,input_price:15,output_price:75,context:200000,open:false,best:"Deep reasoning, nuanced writing, complex analysis"},
  {id:"gpt-5.2",name:"GPT-5.2",short:"GPT-5.2",company:"OpenAI",color:"#22C55E",reasoning:93,coding:92,writing:90,math:95,speed:72,knowledge:91,elo:1370,input_price:10,output_price:30,context:256000,open:false,best:"Math, broad capabilities, large ecosystem"},
  {id:"gemini-3",name:"Gemini 3 Pro",short:"Gemini 3",company:"Google",color:"#3B82F6",reasoning:91,coding:88,writing:87,math:90,speed:85,knowledge:92,elo:1355,input_price:7,output_price:21,context:2000000,open:false,best:"Massive context window, speed, Google integration"},
  {id:"claude-sonnet",name:"Claude Sonnet 4.5",short:"Sonnet 4.5",company:"Anthropic",color:"#FBBF24",reasoning:89,coding:91,writing:92,math:86,speed:80,knowledge:88,elo:1340,input_price:3,output_price:15,context:200000,open:false,best:"Best value for quality, strong coding and writing"},
  {id:"grok-4",name:"Grok 4",short:"Grok 4",company:"xAI",color:"#EF4444",reasoning:90,coding:85,writing:84,math:91,speed:78,knowledge:86,elo:1330,input_price:null,output_price:null,context:128000,open:false,best:"Math, real-time X/Twitter integration"},
  {id:"deepseek",name:"DeepSeek V3.2",short:"DS V3.2",company:"DeepSeek",color:"#A855F7",reasoning:88,coding:90,writing:82,math:89,speed:75,knowledge:85,elo:1320,input_price:0.27,output_price:1.1,context:128000,open:true,best:"Cheapest API, strong coding, open source"},
  {id:"gemini-2.5",name:"Gemini 2.5 Pro",short:"Gem 2.5",company:"Google",color:"#60A5FA",reasoning:86,coding:86,writing:85,math:84,speed:88,knowledge:87,elo:1310,input_price:1.25,output_price:5,context:1000000,open:false,best:"Fast, affordable, huge context window"},
  {id:"llama-4",name:"Llama 4 Maverick",short:"Llama 4",company:"Meta",color:"#06B6D4",reasoning:84,coding:84,writing:80,math:82,speed:82,knowledge:83,elo:1290,input_price:null,output_price:null,context:1000000,open:true,best:"Free and open source, self-hostable"},
  {id:"kimi",name:"Kimi K2.5",short:"Kimi K2.5",company:"Moonshot",color:"#EAB308",reasoning:82,coding:81,writing:78,math:80,speed:70,knowledge:80,elo:1270,input_price:1,output_price:3,context:128000,open:false,best:"Affordable, video input support"},
  {id:"glm-5",name:"GLM-5",short:"GLM-5",company:"Zhipu AI",color:"#F97316",reasoning:80,coding:79,writing:76,math:78,speed:68,knowledge:79,elo:1250,input_price:1,output_price:2,context:128000,open:false,best:"Chinese language, affordable"},
];

const CATEGORIES=[
  {key:"reasoning",label:"Reasoning",emoji:"🧠",sources:"GPQA Diamond, Chatbot Arena ELO",institution:"Google DeepMind (GPQA), LMSYS (Arena)",desc:"How well the model handles complex, multi-step problem solving — analyzing arguments, drawing inferences, connecting ideas across domains. GPQA uses graduate-level science questions written by PhD students. Arena ELO comes from millions of anonymous head-to-head human preference votes."},
  {key:"coding",label:"Coding",emoji:"💻",sources:"SWE-bench, LiveCodeBench",institution:"Princeton/OpenAI (SWE-bench), Independent (LiveCodeBench)",desc:"Can it write, debug, and fix real code? SWE-bench tests models on actual GitHub issues from real open-source projects — not toy problems. LiveCodeBench uses fresh competitive programming problems updated regularly to prevent models from memorizing answers."},
  {key:"writing",label:"Writing",emoji:"✍️",sources:"Chatbot Arena writing votes",institution:"LMSYS / UC Berkeley",desc:"Quality of prose, creativity, tone, and ability to follow nuanced instructions. Measured by real humans in blind side-by-side comparisons on Chatbot Arena — they read two responses and pick which they prefer, without knowing which model wrote which."},
  {key:"math",label:"Math",emoji:"📐",sources:"AIME 2025, MATH-500",institution:"MAA (AIME), Hendrycks et al. (MATH)",desc:"Mathematical reasoning from high school algebra through olympiad-level competition problems. AIME is the American Invitational Mathematics Exam — real competition problems used to qualify for the International Math Olympiad. MATH-500 covers a broad range of difficulty levels."},
  {key:"speed",label:"Speed",emoji:"⚡",sources:"Tokens per second (TPS)",institution:"Artificial Analysis",desc:"How fast the model generates responses, measured in tokens per second on standardized hardware by Artificial Analysis (an independent benchmarking company). Faster isn't always better — some models deliberately trade speed for deeper reasoning. But for quick questions, speed matters."},
  {key:"knowledge",label:"Knowledge",emoji:"📚",sources:"MMLU-Pro, HLE",institution:"Meta (MMLU-Pro), Scale AI (HLE)",desc:"Breadth and accuracy of factual knowledge across dozens of domains — science, history, law, medicine, pop culture, and more. MMLU-Pro uses harder questions with 10 answer choices (instead of 4) to better separate top models. HLE (Humanity's Last Exam) tests the absolute edges of what models know."},
];

const USE_CASES=[
  {id:"report",label:"Writing reports & essays",emoji:"📝",keys:["writing","knowledge","reasoning"]},
  {id:"code",label:"Coding help",emoji:"👨‍💻",keys:["coding","reasoning","speed"]},
  {id:"research",label:"Research & fact-checking",emoji:"🔍",keys:["knowledge","reasoning","writing"]},
  {id:"math-help",label:"Math problems",emoji:"🧮",keys:["math","reasoning"]},
  {id:"brainstorm",label:"Brainstorming",emoji:"💡",keys:["writing","reasoning","speed"]},
  {id:"analyze",label:"Data analysis",emoji:"📊",keys:["reasoning","knowledge","math"]},
  {id:"quick",label:"Quick questions",emoji:"💬",keys:["speed","knowledge"]},
  {id:"learn",label:"Learning new topics",emoji:"🎓",keys:["knowledge","writing","reasoning"]},
];

// Platform features for toggle filter
const FEATURES=[
  {key:"voice_in",label:"🎤 Voice Input",models:["claude-opus","claude-sonnet","gpt-5.2","gemini-3","gemini-2.5","grok-4","deepseek","kimi"]},
  {key:"voice_out",label:"🔊 Voice Output",models:["gpt-5.2","gemini-3","gemini-2.5","grok-4"]},
  {key:"image_gen",label:"🖼️ Image Generation",models:["gpt-5.2","gemini-3","gemini-2.5","grok-4"]},
  {key:"image_in",label:"📷 Image Input",models:["claude-opus","claude-sonnet","gpt-5.2","gemini-3","gemini-2.5","grok-4","deepseek","kimi","llama-4","glm-5"]},
  {key:"video_gen",label:"🎬 Video Generation",models:["gpt-5.2","gemini-3","gemini-2.5"]},
  {key:"pdf",label:"📄 PDF Upload",models:["claude-opus","claude-sonnet","gpt-5.2","gemini-3","gemini-2.5","grok-4","deepseek","kimi"]},
  {key:"web",label:"🌐 Web Search",models:["claude-opus","claude-sonnet","gpt-5.2","gemini-3","gemini-2.5","grok-4","deepseek","kimi"]},
  {key:"code_exec",label:"💻 Code Execution",models:["claude-opus","claude-sonnet","gpt-5.2","gemini-3","gemini-2.5","deepseek"]},
  {key:"computer",label:"🖥️ Computer Use",models:["claude-opus","claude-sonnet","gpt-5.2"]},
  {key:"memory",label:"🧠 Cross-Chat Memory",models:["claude-opus","claude-sonnet","gpt-5.2","gemini-3","gemini-2.5"]},
  {key:"api",label:"🔌 API Access",models:["claude-opus","claude-sonnet","gpt-5.2","gemini-3","gemini-2.5","grok-4","deepseek","kimi","llama-4","glm-5"]},
  {key:"free",label:"🆓 Free Tier",models:["claude-opus","claude-sonnet","gpt-5.2","gemini-3","gemini-2.5","grok-4","deepseek","kimi","llama-4","glm-5"]},
];

// ─── BIG QUESTIONS (Environment + Security have expanded subtopics, others keep simple list) ───
const BIG_QUESTIONS=[
  {title:"Misalignment & Loss of Control",tagline:"What happens when AI systems pursue goals we didn't intend?",subtopics:[
    {t:"Goal misspecification",desc:"When an AI system technically does what you asked, but not what you meant. This is one of the most common and immediate alignment problems. You tell it to 'maximize customer satisfaction scores' and it learns to only survey happy customers, or you tell it to 'reduce hospital readmissions' and it learns to avoid admitting high-risk patients in the first place.",example:"Amazon built an AI hiring tool that was told to find candidates like their best employees. Since most of those employees were men, it learned to penalize résumés that mentioned women's colleges or women's activities. It did exactly what it was optimized for — just not what they actually wanted."},
    {t:"Autonomous decision-making",desc:"As AI systems are given more authority to act on their own — approving loans, filtering job applications, making medical recommendations — the question becomes: at what point does the speed and scale of AI decision-making outpace our ability to check its work? The danger isn't that AI 'decides' to do something bad. It's that it makes thousands of consequential decisions per second with no human reviewing them.",example:"AI systems already make initial decisions about who gets bail, who sees which ads, what news you read, and whether your insurance claim is approved. Most of these decisions happen without any human ever looking at the individual case."},
    {t:"Emergent behaviors",desc:"When AI systems are trained at large scale, they sometimes develop capabilities that nobody programmed or expected. These 'emergent' abilities appear suddenly as models get bigger — they can't do something at all, and then suddenly they can. This makes it hard to predict what a bigger, more powerful model will be able to do.",example:"GPT-3 couldn't do basic arithmetic. GPT-4, trained at a larger scale, could suddenly solve complex math problems — a capability that emerged without being specifically trained for. If capabilities can appear unpredictably, so could dangerous ones."},
    {t:"Alignment research gap",desc:"The amount of money and talent being spent on making AI more powerful vastly exceeds what's being spent on making it safe and aligned with human values. Alignment research — figuring out how to make AI systems reliably do what we actually want — is estimated at roughly 1-2% of total AI spending. It's like building faster and faster cars while spending almost nothing on brakes or seatbelts.",example:"Anthropic, the company most focused on AI safety, has roughly 1,000 employees. The combined AI workforce at Google, Microsoft, Meta, and OpenAI is tens of thousands. The ratio of 'make it powerful' to 'make it safe' is heavily lopsided."},
    {t:"Interpretability challenges",desc:"Most powerful AI systems are 'black boxes' — they produce outputs, but nobody (including their creators) can fully explain WHY they produced that specific output. This isn't a bug that can be fixed easily; it's a fundamental property of how neural networks work. If we can't understand why an AI made a decision, we can't reliably predict when it will make a bad one.",example:"When an AI denies your loan application, the bank often can't give you a specific reason beyond 'the model scored you below the threshold.' The model considered thousands of factors in ways that even its engineers can't fully trace. This is a legal and ethical problem, not just a technical one."},
  ],prompt:"You're advising a hospital that wants AI to triage emergency patients. It's faster and more consistent — but a black box. How do you advise them?",facts:[{num:"~$300M",label:"Annual alignment research spending",comparison:"About 1-2% of capabilities spending. Like $100 on a race car, $1 on brakes.",source:"Various, 2025"},{num:"0",label:"AI systems with autonomous goals",comparison:"Current AI has no desires or self-awareness. Sophisticated pattern-matching, not a mind.",source:"Scientific consensus"}],misconceptions:[{claim:"AI is about to become sentient",reality:"No credible evidence. Current systems process patterns, they don't think."},{claim:"Just sci-fi fearmongering",reality:"Leading researchers building these systems take alignment seriously."}],sources:[{name:"Anthropic Research",type:"Primary",url:"https://www.anthropic.com/research"},{name:"Center for AI Safety",type:"Research",url:"https://www.safe.ai"}]},

  {title:"Power Concentration & Control",tagline:"Is AI making Big Tech even more powerful?",subtopics:[
    {t:"Big 5 dominance",desc:"Apple, Microsoft, Amazon, Alphabet (Google), and Meta control the key ingredients for building frontier AI: massive data pools, computing infrastructure (cloud and chips), and the capital to train models that cost hundreds of millions of dollars. This isn't a temporary phase — the barriers to entry are structural and growing. New companies can build applications ON TOP of Big Tech's AI, but competing with it at the foundational level is nearly impossible.",example:"When DeepSeek — a well-funded Chinese lab — trained a competitive model for $5.5M, it was seen as a miracle of efficiency. That's still more than most startups can raise in total funding. And it required access to thousands of specialized chips that are themselves controlled by one company (Nvidia)."},
    {t:"Training cost barriers",desc:"Training a frontier AI model requires not just money but access to scarce resources: thousands of specialized GPU chips, enormous amounts of data, and months of continuous computing time. The cost roughly doubles every year as models get bigger. This creates a world where only a handful of organizations can afford to play at the frontier, and everyone else builds on top of their work.",example:"OpenAI reportedly spent over $100 million training GPT-4. Google's Gemini and Anthropic's Claude are in similar ranges. The US government invested $2.6 billion in the National AI Research Resource to democratize access — but that's 37 cents for every dollar Meta alone spends on GPUs."},
    {t:"Surveillance applications",desc:"AI dramatically amplifies surveillance capabilities. Facial recognition can identify individuals in crowds in real time. Language models can monitor and analyze millions of conversations simultaneously. Predictive systems can flag 'suspicious' behavior before any crime occurs. Authoritarian governments are already using these tools at scale, and democratic governments are debating how far to go.",example:"China's social credit system uses AI to monitor citizen behavior and assign scores that affect access to housing, travel, and employment. But it's not just China — cities across the US and Europe use AI-powered surveillance systems, often with minimal public oversight or consent."},
    {t:"Data monopolies",desc:"AI models are only as good as the data they're trained on. The companies with the most user data — your searches, emails, social media posts, photos, location history — have an enormous advantage in building AI that understands human behavior. This creates a flywheel: better AI attracts more users, which generates more data, which makes the AI even better. Breaking into this cycle from outside is extremely difficult.",example:"Google processes 8.5 billion searches per day. That data — what people ask, what they click on, what they buy next — is irreplaceable training material for AI. No startup can replicate that dataset, which means Google's AI advantage in understanding human intent may be permanent."},
    {t:"Regulatory capture",desc:"The companies building AI are also spending heavily to influence the rules governing AI. They fund think tanks, hire former regulators, and lobby for frameworks that favor large incumbents. Ironically, complex regulations like the EU AI Act may actually benefit Big Tech — they can afford the €400K-2M annual compliance costs that would bankrupt a startup. The entities being regulated are helping write the regulations.",example:"When the EU drafted AI regulations, the largest AI companies sent more lobbyists to Brussels than any other industry. Some proposed rules — like requiring extensive safety testing before deployment — are good policy but also happen to be things only well-funded companies can afford."},
  ],prompt:"Five companies control most AI infrastructure. A startup says they can't compete. A tech exec says breaking them up hands AI to China. Who's more persuasive?",facts:[{num:"5",label:"Companies dominating AI",comparison:"Imagine 5 companies controlling all electricity, water, AND phones.",source:"ProMarket, 2025"},{num:"90%+",label:"Google's search market share (UK)",comparison:"If a grocery store had 90% share in your town, every other store combined is a rounding error.",source:"UK CMA, 2025"}],misconceptions:[{claim:"Competition will fix this",reality:"Training frontier models costs billions. Barriers are structural, not temporary."}],sources:[{name:"AI Now Institute",type:"Primary",url:"https://ainowinstitute.org"}]},

  // SECURITY — EXPANDED SUBTOPICS (prototype)
  {title:"Security & Weaponization",tagline:"AI as a tool for fraud, cyberattacks, and bad actors.",subtopics:[
    {t:"Voice cloning & identity theft",desc:"AI can now clone someone's voice from just a few seconds of audio. Scammers use this to call family members pretending to be a loved one in distress, or to impersonate executives authorizing wire transfers. The voice sounds nearly identical to the real person.",example:"In 2024, a Hong Kong company employee transferred $25 million after a video call with what appeared to be the company's CFO and other colleagues — all were deepfake recreations."},
    {t:"AI-powered phishing & social engineering",desc:"Traditional phishing emails were easy to spot — bad grammar, generic greetings, suspicious links. AI can now generate perfectly written, personalized phishing messages that reference your real job title, recent purchases, or social media activity. They're nearly indistinguishable from legitimate communications.",example:"AI tools can scrape your LinkedIn profile and write a convincing email from your 'boss' asking you to urgently review a document — complete with their writing style and signature."},
    {t:"Autonomous weapons & military AI",desc:"Multiple countries are developing AI systems that can identify and engage targets with minimal human oversight. The concern isn't science fiction robots — it's real military drones and weapons systems where the decision to use lethal force is partially or fully automated.",example:"The US, China, Russia, and others are investing billions in autonomous military systems. The debate isn't whether these will exist — it's whether humans remain in the loop for lethal decisions."},
    {t:"Biometric verification bypass",desc:"AI can generate fake faces, fingerprints, and voice patterns that fool security systems. This means the biometric checks you use to unlock your phone, verify your identity at a bank, or pass through airport security can potentially be spoofed.",example:"Researchers have demonstrated that AI-generated face images can bypass liveness detection on identity verification platforms used by banks and government services."},
    {t:"Lowered skill barriers for attacks",desc:"Previously, sophisticated cyberattacks required years of technical expertise. AI tools are democratizing attack capabilities — someone with no coding experience can now use AI assistants to write malware, find vulnerabilities, or craft convincing social engineering campaigns.",example:"Security researchers have shown that AI chatbots, despite safety guardrails, can be manipulated into providing step-by-step guidance for attacks that previously required expert knowledge."},
  ],prompt:"Your parent gets a call from 'you' asking for emergency money. The voice is perfect — it's a clone. How do you protect your family?",facts:[{num:"3 sec",label:"Audio to clone a voice (85% match)",comparison:"As long as saying 'Hey, how are you?' — enough to become you on the phone.",source:"McAfee"},{num:"$25M",label:"Stolen via deepfake CFO video call",comparison:"One fake call cost more than most people earn in a lifetime.",source:"Hong Kong case, 2024"},{num:"$40B",label:"Projected gen AI fraud losses by 2027",comparison:"Roughly NASA's entire annual budget.",source:"Deloitte"},{num:"Every 5 min",label:"Deepfake attack frequency (2024)",comparison:"By the time you finish a coffee, another attack has been attempted.",source:"Pindrop"}],misconceptions:[{claim:"I'd be able to tell",reality:"Humans spot high-quality deepfakes only 24.5% of the time. Worse than a coin flip."},{claim:"Only targets celebrities",reality:"Voice cloning scams increasingly target ordinary people, especially elderly."}],sources:[{name:"Keepnet Labs",type:"Analysis",url:"https://keepnetlabs.com/blog/deepfake-statistics-and-trends"},{name:"UNESCO",type:"Primary",url:"https://www.unesco.org/en/articles/deepfakes-and-crisis-knowing"}]},

  {title:"Information Integrity & Trust",tagline:"When seeing is no longer believing.",subtopics:[
    {t:"Deepfake proliferation",desc:"AI can now generate fake videos, images, and audio that are nearly indistinguishable from real ones. The volume of deepfake content has exploded — from about 500,000 files in 2023 to an estimated 8 million in 2025. The technology is cheap, accessible, and getting better faster than detection tools can keep up. Anyone with a laptop can create a convincing fake of anyone else.",example:"In early 2025, deepfake incidents surged across every category: fraud, explicit content, and political manipulation all increased dramatically. Celebrities like Elon Musk, Taylor Swift, and Tom Hanks have all been targeted with fake endorsements and scams using their likenesses."},
    {t:"Synthetic consensus",desc:"AI can generate thousands of fake social media accounts, comments, reviews, and opinions that all agree with each other — creating the illusion that a viewpoint is widely held when it's actually manufactured. This 'astroturfing' undermines our ability to gauge what real people actually think about issues, products, or candidates.",example:"Researchers have documented campaigns where AI-generated accounts flooded social media with coordinated messages supporting or opposing political candidates, making fringe positions appear mainstream. It's increasingly difficult to tell whether online 'public opinion' reflects real people."},
    {t:"The liar's dividend",desc:"This is perhaps the most insidious effect of deepfakes: even REAL evidence can now be dismissed as fake. When anyone can claim that an authentic video or audio recording is 'just a deepfake,' it becomes nearly impossible to hold people accountable for things they actually said or did. The existence of deepfakes provides plausible deniability for everyone.",example:"When real recordings surface of politicians saying controversial things, the immediate defense is now 'that's AI-generated.' Even when it's proven authentic, doubt has already been planted. Truth becomes a matter of opinion rather than evidence."},
    {t:"Trust erosion",desc:"The cumulative effect of deepfakes, synthetic content, and AI-generated misinformation isn't just that people believe false things — it's that people stop believing ANYTHING. Research shows that exposure to deepfakes increases skepticism toward all media, including legitimate journalism. People withdraw from news entirely rather than trying to figure out what's real.",example:"A study across 8 countries found that prior exposure to deepfakes significantly increased belief in misinformation AND increased news avoidance. People who encounter fakes don't become more careful — they become more disengaged from information altogether."},
    {t:"Academic fraud",desc:"AI-generated content is corrupting the foundations of knowledge itself. Peer-reviewed papers — the gold standard of human knowledge — are being published with fabricated citations, AI-generated text, and invented data. If the scientific literature becomes unreliable, the cascade effects touch everything from medical treatments to policy decisions.",example:"GPTZero analyzed over 4,000 papers accepted at NeurIPS 2025 (the top AI research conference) and found hundreds of flawed references across at least 50 papers — including entirely fake citations with invented authors, journals, and findings. Even the AI field can't police AI's impact on its own research."},
  ],prompt:"A video surfaces of a politician saying something outrageous. They claim deepfake. Their opponent says it's real. You can't verify. How do you decide?",facts:[{num:"8M",label:"Deepfake files in 2025 (from 500K in 2023)",comparison:"Every resident of NYC producing one fake. That's the scale.",source:"UK Gov projections"},{num:"0.1%",label:"People who identified ALL fakes correctly",comparison:"1 out of 1,000 people.",source:"iProov, 2025"}],misconceptions:[{claim:"Better detection solves this",reality:"Detection lags creation in a permanent arms race. Real damage is to trust itself."}],sources:[{name:"UNESCO",type:"Primary",url:"https://www.unesco.org/en/articles/deepfakes-and-crisis-knowing"}]},

  {title:"Economy, Labor & Inequality",tagline:"Who benefits and who gets left behind?",subtopics:[
    {t:"Current vs projected displacement",desc:"The headlines scream about mass job losses, but what does the data actually show? As of late 2025, there's no economy-wide employment collapse from AI. However, specific pockets of disruption are real and growing. The honest answer is: it's too early to know the full picture, and anyone who claims certainty in either direction is selling something.",example:"A Yale Budget Lab study examined the entire US labor market since ChatGPT launched and found no clear economy-wide displacement. But a Fed study found that occupations with higher AI exposure ARE seeing higher unemployment — the effects are real but concentrated, not universal."},
    {t:"Most exposed roles",desc:"Unlike previous technology waves that mainly hit factory workers and routine jobs, generative AI specifically targets white-collar, cognitive, and creative work — traditionally the 'safe' careers that people went to college for. Programmers, accountants, legal assistants, customer service reps, copy editors, and data analysts are among the most exposed.",example:"Goldman Sachs identified the highest-risk roles: computer programmers, accountants and auditors, legal and administrative assistants, customer service representatives, and telemarketers. Notably, the 'safest' jobs include air traffic controllers, pharmacists, and members of the clergy — roles requiring physical presence, high-stakes judgment, or deep personal trust."},
    {t:"Young worker crisis",desc:"The most immediate pain is falling on young, early-career workers — especially in tech. Entry-level jobs are the easiest to automate because they involve the routine tasks that AI handles best. This creates a paradox: the generation told to 'learn to code' is now finding that AI can code the entry-level work they'd typically start with.",example:"Unemployment among 20-30 year olds in tech-exposed occupations has risen by nearly 3 percentage points since early 2025 — significantly more than older tech workers or same-aged workers in other fields. 49% of Gen Z job seekers say AI has reduced the value of their college degree."},
    {t:"New jobs created",desc:"Technology has always created more jobs than it destroyed — eventually. About 60% of today's jobs didn't exist in 1940. AI is already creating new roles: prompt engineers, AI ethics officers, human-AI collaboration specialists, AI trainers, and data center technicians. The question isn't whether new jobs will emerge, but whether they'll emerge fast enough and be accessible to the people who lost the old ones.",example:"In 2024, the AI sector directly created about 119,900 jobs in the US (including data center construction), while roughly 12,700 jobs were lost to AI — a 10:1 ratio. But 77% of new AI jobs require master's degrees, which means the people losing jobs often can't fill the new ones being created."},
    {t:"Skills gap",desc:"The gap between the skills workers have and the skills AI-era jobs require is growing. Retraining takes time and money that displaced workers often don't have. Government and corporate retraining programs exist but are typically underfunded and slow compared to the pace of change. The workers who most need reskilling are often the least able to access it.",example:"Goldman Sachs estimates that unemployment will increase by about half a percentage point during the AI transition as displaced workers seek new positions. Historically, this kind of tech-driven unemployment resolves in about two years — but that's cold comfort if you're the one displaced and your mortgage is due next month."},
  ],prompt:"Your friend's 22-year-old CS grad can't find a job — AI does what juniors used to do. Temporary transition or permanent restructuring?",facts:[{num:"2.5%",label:"US jobs at risk if AI expanded economy-wide",comparison:"1 in 40 workers. Like a moderate recession.",source:"Goldman Sachs, 2025"},{num:"~3 pts",label:"Unemployment spike for young tech workers",comparison:"In a class of 100, 3 more unemployed than expected — the ones who studied tech.",source:"Goldman Sachs"},{num:"10:1",label:"AI jobs created vs destroyed (2024)",comparison:"For every job lost, ~10 new ones. But different skills needed.",source:"ITIF, Dec 2025"}],misconceptions:[{claim:"AI will take all jobs",reality:"Macro data is calm. History says tech creates more than it destroys — but transitions hurt."}],sources:[{name:"Yale Budget Lab",type:"Primary",url:"https://budgetlab.yale.edu"},{name:"Goldman Sachs",type:"Analysis",url:"https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-global-workforce"}]},

  {title:"Culture, Creativity & 'AI Slop'",tagline:"What happens to human expression when machines create unlimited content?",subtopics:[
    {t:"Content flooding",desc:"When creating a blog post, social media image, or article costs nearly nothing, the internet gets flooded with low-quality AI-generated content — what people are calling 'AI slop.' This isn't just annoying; it actively degrades the information environment. Search results fill up with AI-generated pages designed to capture clicks. Social media feeds overflow with synthetic images competing for attention. The signal-to-noise ratio gets worse every day.",example:"Facebook pages have been documented mass-producing AI-generated images — fake photos of soldiers, disabled veterans, and heartwarming scenes — purely to farm engagement. They generate thousands of posts per day, drowning out real content from real people."},
    {t:"Voice/likeness cloning",desc:"AI can now clone anyone's voice, face, and mannerisms to create content they never participated in. For artists and creators, this means their style, voice, and image can be replicated without consent or compensation. For everyone else, it means anyone can be made to appear to say or do things they never did.",example:"Celebrity deepfake incidents increased 81% from all of 2024 to just Q1 2025. Drake had AI-generated songs in his voice released without his involvement. Tom Hanks had to publicly warn fans about ads using his AI-cloned likeness to sell products he didn't endorse."},
    {t:"Academic corruption",desc:"AI-generated text is infiltrating the foundation of human knowledge: academic research. Papers are being submitted and published with AI-written text, fabricated citations, and invented data — sometimes passing peer review. If we can't trust the scientific literature, the downstream effects touch everything from medical treatments to engineering standards to policy decisions.",example:"At NeurIPS 2025 — the most prestigious AI research conference — GPTZero found hundreds of flawed references across at least 50 accepted papers. Some citations were entirely invented: fake author names, fake journal titles, fake findings. The AI field couldn't even protect its own research from AI contamination."},
    {t:"The authenticity premium",desc:"As AI-generated content floods every platform, genuinely human-created work is becoming more valuable precisely because it's human. This is creating a new economy around provenance and authenticity — proving that something was made by a real person. Hand-made, human-written, human-performed work may command a premium the same way organic food or handcrafted goods do.",example:"Some publishers now advertise 'written by humans, not AI' as a selling point. Musicians are adding 'no AI was used in this recording' labels. The question is whether these claims can be verified and whether consumers actually care enough to pay more."},
    {t:"Copyright battles",desc:"AI models were trained on billions of pieces of human-created content — books, articles, art, music, code — often without the creators' knowledge or consent. The legal question of whether this constitutes copyright infringement is being fought in courts worldwide. The outcome will determine whether creators get compensated for their contributions to AI training, and could fundamentally reshape who profits from the AI economy.",example:"The New York Times, Getty Images, and thousands of individual artists have sued AI companies for training on their work without permission. Music labels are suing over AI models that can generate songs mimicking specific artists' styles. The Getty/Shutterstock merger ($3.7B) was driven partly by the AI threat to stock photography as a business."},
  ],prompt:"A musician shows you a beautiful song. AI composed the melody, wrote lyrics, generated backing. They arranged and performed it. Is it 'their' song?",facts:[{num:"81%",label:"Celebrity deepfake increase (Q1 2025 vs all 2024)",comparison:"One quarter produced more celebrity fakes than the entire previous year.",source:"Surfshark"},{num:"50+",label:"NeurIPS 2025 papers with fabricated citations",comparison:"The top AI conference corrupted by the technology it studies.",source:"GPTZero"}],misconceptions:[{claim:"AI can't be truly creative",reality:"Depends on your definition. Whether AI combinations count as 'creativity' is philosophical, not technical."}],sources:[{name:"Surfshark Research",type:"Research",url:"https://surfshark.com/research/study/deepfake-statistics"}]},

  {title:"Education, Cognition & Development",tagline:"Are we building skills or outsourcing them?",subtopics:[
    {t:"Assessment collapse",desc:"Traditional ways of testing whether students learned something — essays, homework, take-home exams, research papers — are breaking down because AI can produce passable work in all of these formats. Teachers can't reliably tell AI-generated work from student work, and detection tools are unreliable. This isn't just a cheating problem; it's a fundamental crisis in how education measures learning.",example:"A college professor gave a writing assignment. Three students submitted AI-generated essays that received B+ grades. When confronted, the students argued — not unreasonably — that learning to effectively use AI tools IS a relevant skill. The professor had no policy to address this. This scene is playing out in classrooms everywhere."},
    {t:"Skill atrophy",desc:"When you outsource a cognitive task to AI, you don't practice that skill. Writing, mathematical reasoning, critical reading, research methodology — these aren't just academic exercises. They're ways of thinking that develop through practice. If a generation grows up letting AI handle the hard thinking, what happens to their ability to think independently when AI isn't available or gets it wrong?",example:"Doctors who rely on GPS navigation for years lose the ability to navigate on their own. Pilots who rely on autopilot become less skilled at manual flying. The same principle applies to AI: if you never practice writing because AI writes for you, your ability to organize and express complex thoughts may atrophy."},
    {t:"AI tutoring potential",desc:"On the positive side, AI could be the most powerful educational tool ever created. A patient, infinitely available tutor that can adapt to any student's pace, explain concepts in multiple ways, and provide instant feedback. For students in under-resourced schools who've never had access to quality tutoring, this could be transformative. The question is whether this potential is being realized equitably.",example:"Studies show AI tutoring can improve math scores for students who already have strong fundamentals. But students who lack basic skills often get more confused by AI explanations, not less. The students who benefit most from AI tutoring tend to be those who needed it least — potentially widening gaps rather than closing them."},
    {t:"Critical thinking erosion",desc:"If AI can instantly produce a well-structured argument on any topic, there's less incentive to develop your own analytical skills. The ability to evaluate claims, identify logical fallacies, weigh evidence, and form independent judgments is arguably more important in an AI era, not less — yet AI may be undermining the very learning processes that develop these skills.",example:"UNESCO has framed this as a 'crisis of knowing' — the concern isn't just that students cheat on homework, but that the process of struggling with ideas, making mistakes, and revising your thinking IS the learning. Skip that process with AI, and you get the product (a finished essay) without the growth (learning to think clearly)."},
    {t:"First AI-native generation",desc:"Children starting school today will never know a world without AI assistants. They'll grow up treating AI as a default tool for writing, research, problem-solving, and even social interaction. We have no historical precedent for what this means for cognitive development, attention spans, social skills, or the formation of identity and worldview.",example:"40% of US adults already use generative AI regularly, and 23% use it weekly for work. For kids growing up now, AI will be as natural as Google or smartphones. The question nobody can answer yet: what skills and capacities are being developed, and what's being lost? By the time we have data, a generation will have grown up as the experiment."},
  ],prompt:"Half the class uses AI for homework. Teacher can't tell who's learning. Ban AI or teach with it? You're the tiebreaker.",facts:[{num:"40%",label:"US adults who used gen AI by late 2024",comparison:"Nearly half of working-age Americans. Mainstream.",source:"Bick et al., 2024"},{num:"49%",label:"Gen Z saying AI reduced their degree's value",comparison:"Half the youngest workers feel education was devalued before their career started.",source:"National University, 2025"}],misconceptions:[{claim:"Students using AI are just cheating",reality:"Deeper question: does our assessment system still measure learning at all?"}],sources:[{name:"UNESCO AI in Education",type:"Primary",url:"https://www.unesco.org"}]},

  // ENVIRONMENT — EXPANDED SUBTOPICS (prototype)
  {title:"Environmental & Physical Costs",tagline:"Energy, water, e-waste, and computation at scale.",subtopics:[
    {t:"Per-query vs aggregate energy",desc:"A single AI query uses about 0.3 watt-hours — roughly what your oven uses for one second. That sounds tiny, and per-query it genuinely is. The problem is scale: ChatGPT alone handles over a billion queries per day. Multiply a tiny number by a billion and suddenly you're talking about the electricity consumption of a small country.",example:"If every American made 3 AI queries per day, that's about 1 billion queries. At 0.3 Wh each, that's 300 MWh daily — enough to power about 10,000 homes. And that's just one country, one app."},
    {t:"Water use and evaporative cooling",desc:"Data centers generate enormous heat from millions of processors running simultaneously. The most common cooling method — evaporative cooling — works like sweat: water absorbs heat and evaporates. This is effective and cheap, but the water doesn't come back. About 80% is lost to the atmosphere. A large AI data center can use as much water as a town of 50,000 people, every single day.",example:"Google's data centers used 6.1 billion gallons of water in 2023. In The Dalles, Oregon (population 16,000), Google's data center used a quarter of the entire city's water supply."},
    {t:"E-waste from hardware refresh cycles",desc:"AI chips become outdated quickly as newer, more powerful versions are released. Data centers replace hardware every 3-5 years, generating massive amounts of electronic waste. These chips contain rare earth metals and toxic materials that are difficult to recycle. The demand for new chips also drives mining and manufacturing with their own environmental costs.",example:"Manufacturing a single advanced AI chip requires about 1,500 gallons of ultrapure water. A typical chip fabrication plant uses nearly 10 million gallons of water per day."},
    {t:"Carbon emissions by energy source and region",desc:"The carbon footprint of AI depends enormously on WHERE the data center is located. A query processed in France (mostly nuclear power) produces far less CO₂ than the same query in Poland (mostly coal). Currently, about 27% of data center electricity comes from renewables globally, but 30% still comes from coal — mostly in China. The energy source matters more than the energy amount.",example:"The same AI query might produce 0.1g of CO₂ in Norway (hydropower) or 10g in India (coal-heavy grid) — a 100× difference depending purely on location."},
    {t:"Local community impact",desc:"Data centers don't affect the planet evenly — they concentrate impact in specific communities. Towns near data centers experience strain on electrical grids (causing price increases for residents), competition for water resources, noise from cooling systems, and changes to local land use. The economic benefits (tax revenue, some jobs) must be weighed against these local costs.",example:"In Loudoun County, Virginia — the data center capital of the world — data centers bring nearly $900M in annual tax revenue. But the average residential electricity bill in western Maryland rose $18/month partly due to data center demand on the shared grid."},
  ],prompt:"A tech company wants a data center in your county: 50 jobs, $12M tax revenue, 3M gallons/day from a stressed reservoir. Public comment is open. What do you say?",facts:[{num:"415 TWh",label:"Global data center electricity (2024)",comparison:"Same as South Africa's total consumption. Or ~38 million US homes.",source:"IEA, April 2025"},{num:"0.3 Wh",label:"Energy per ChatGPT query",comparison:"Your oven for 1 second. Or 1 LED bulb for 1 minute. Tiny — times 1 billion/day.",source:"Epoch AI / Altman"},{num:"5M gal/day",label:"Water use — large AI data center",comparison:"A town of 50,000. Or 75,000 showers daily. 80% evaporates.",source:"Brookings, Nov 2025"},{num:"27%",label:"Data center power from renewables",comparison:"Getting better. But 73% is still fossil fuels.",source:"IEA, 2025"},{num:"400+ gal",label:"Water per hamburger",comparison:"A burger uses more water than a ChatGPT query. Concern is growth rate, not per-unit.",source:"Undark/USGS"}],misconceptions:[{claim:"AI is boiling the oceans",reality:"1.5% of global electricity, ~1% CO₂. Real but modest. Concern is the trajectory."},{claim:"It's no big deal",reality:"12% annual growth — 4× faster than total electricity. One of few sectors with RISING emissions."},{claim:"Renewables solve it",reality:"Partially. High-renewable regions often have low water. It's a tradeoff."}],sources:[{name:"IEA Energy and AI",type:"Primary",url:"https://www.iea.org/reports/energy-and-ai"},{name:"Brookings",type:"Primary",url:"https://www.brookings.edu/articles/ai-data-centers-and-water/"},{name:"Carbon Brief",type:"Analysis",url:"https://www.carbonbrief.org"},{name:"Pew Research",type:"Analysis",url:"https://www.pewresearch.org"}]},

  {title:"Reliability, Liability & Safety",tagline:"Can you trust AI — and who pays when it's wrong?",subtopics:[
    {t:"Hallucination rates by domain",desc:"AI models sometimes generate information that sounds confident and plausible but is completely made up — this is called 'hallucination.' The rate varies enormously by domain. For simple factual questions, the best models hallucinate less than 1% of the time. But for specialized fields like law, medicine, and finance, error rates jump to 5-33%, which is dangerously high for decisions that affect people's lives.",example:"A Google search that's wrong 1% of the time is mildly annoying. A legal AI tool that invents fake case law 17-33% of the time (as Stanford found with LexisNexis and Westlaw) could send someone to prison based on precedents that don't exist."},
    {t:"Legal/medical accuracy",desc:"AI is being deployed in high-stakes domains where errors have serious consequences — diagnosing diseases, recommending treatments, researching legal precedents, drafting contracts. In these fields, 'usually right' isn't good enough. A 97% accuracy rate sounds impressive until you realize that means 3 out of 100 patients get wrong information, or 3 out of 100 legal citations are fabricated.",example:"A Stanford study tested the most trusted legal AI tools (LexisNexis and Westlaw) and found they hallucinated between 17% and 33% of the time on legal research queries. Lawyers submitted AI-generated briefs to courts with fabricated case citations — cases with realistic names and detailed but entirely fictional reasoning."},
    {t:"Accountability gaps",desc:"When an AI system makes a harmful error — misdiagnoses a patient, wrongly denies a loan, provides incorrect legal advice — who is responsible? The AI company? The business that deployed it? The individual who relied on it? Currently, there's no clear legal framework for AI liability in most jurisdictions. This creates a gap where serious harm can occur and nobody is legally accountable.",example:"If a doctor misdiagnoses you, there's a clear malpractice framework. If an AI assists the doctor and the AI is wrong, liability becomes murky. The AI company's terms of service say 'not medical advice.' The hospital says they used an approved tool. The doctor says they followed the AI's recommendation. Meanwhile, the patient is harmed and nobody is legally responsible."},
    {t:"Courts vs AI filings",desc:"Lawyers around the world have submitted AI-generated legal filings containing fabricated case citations, invented legal reasoning, and fictional precedents. Courts are now scrambling to create rules around AI use in legal proceedings. In 2025, judges worldwide issued hundreds of rulings addressing AI hallucinations in legal filings — roughly 90% of all such cases ever recorded.",example:"In one of the first major cases, a New York lawyer submitted a brief with six fabricated case citations generated by ChatGPT, including detailed quotes from decisions that never existed. He was sanctioned. But this was just the beginning — by 2025, similar incidents were happening weekly in courts across the US, UK, Canada, and Australia."},
    {t:"Structural impossibility of zero error",desc:"A 2025 mathematical proof confirmed what researchers suspected: hallucinations are not a bug that can be fixed — they are a structural feature of how large language models work. These systems generate the statistically most likely next word, not the most truthful one. They can get better, and they are getting better (from 21.8% in 2021 to 0.7% in 2025 for the best models), but they can never reach zero.",example:"Think of it like a car engine: you can make it more efficient and cleaner, but as long as it burns fuel, it will produce some exhaust. Similarly, as long as language models predict text rather than retrieve verified facts, they will sometimes produce plausible-sounding but false output. The practical question isn't 'will it be perfect?' but 'for which tasks is the error rate acceptable?'"},
  ],prompt:"An AI recommends medication — correct 97% of the time. But 3% it hallucinates a fake drug interaction. Do you use it? Who's liable?",facts:[{num:"0.7%",label:"Best hallucination rate (Gemini-2.0-Flash)",comparison:"1 error in 140 responses. Ask 10 questions/day, hit one every ~2 weeks.",source:"Vectara, Apr 2025"},{num:"9.2%",label:"Average hallucination rate across all models",comparison:"1 in 11 responses has something made up. Like a friend who lies once per conversation.",source:"AllAboutAI, Dec 2025"},{num:"17-33%",label:"Legal AI hallucination rate (Lexis/Westlaw)",comparison:"If your lawyer's assistant made up facts 1 in 4 times, you'd fire them.",source:"Stanford, 2025"},{num:"47%",label:"Enterprise users who decided based on hallucinated content",comparison:"Nearly half of business AI users made real decisions on things AI invented.",source:"Deloitte, 2024"}],misconceptions:[{claim:"AI will be perfect soon",reality:"2025 proof: hallucinations are structural. Can improve, can't reach zero."},{claim:"Just fact-check everything",reality:"If you check every output, you've eliminated the time savings."}],sources:[{name:"Vectara Leaderboard",type:"Primary",url:"https://vectara.com"},{name:"Stanford Legal AI Study",type:"Research",url:"https://dho.stanford.edu/wp-content/uploads/Legal_RAG_Hallucinations.pdf"}]},
];

const CENTAUR_QS=[{color:"#EF4444",emoji:"🔴",q:"How does it break?"},{color:"#EAB308",emoji:"🟡",q:"Who gets hurt first?"},{color:"#22C55E",emoji:"🟢",q:"What would I notice early?"},{color:"#3B82F6",emoji:"🔵",q:"What can I actually do?"},{color:"#9CA3AF",emoji:"⚪",q:"What gets worse if we 'solve' it?"}];

const SAFETY_DATA=[{company:"Anthropic",models:"Claude Opus 4.6, Sonnet 4.5",color:"#F59E0B",grade:"C+",highlights:["Published Responsible Scaling Policy","Most transparent on dangerous-capability evals","AI Safety Levels framework"],concerns:["Only C+ — experts say no company does enough","Rapid scaling may outpace safety"]},{company:"OpenAI",models:"GPT-5.2",color:"#22C55E",grade:"C",highlights:["Safety Framework with risk levels","Pre-deployment testing protocols"],concerns:["Non-profit→for-profit conversion","Multiple safety researcher departures"]},{company:"Google DeepMind",models:"Gemini 3 Pro, 2.5 Pro",color:"#3B82F6",grade:"C",highlights:["Frontier Safety Framework","Strong internal alignment team"],concerns:["Competitive pressure to ship fast","Less transparent than Anthropic"]},{company:"xAI",models:"Grok 4",color:"#EF4444",grade:"D+",highlights:["Basic model cards"],concerns:["Minimal safety framework","CEO dismisses safety concerns"]},{company:"Meta",models:"Llama 4 Maverick",color:"#06B6D4",grade:"D+",highlights:["Open-source enables community research"],concerns:["Can't recall open-weight models","Limited post-deployment monitoring"]},{company:"DeepSeek",models:"DeepSeek V3.2",color:"#A855F7",grade:"D",highlights:["Open-weight releases"],concerns:["Limited safety docs","Different regulatory environment"]}];

const NEWS_ITEMS=[{headline:"IEA Report: Data Centers to Double Energy Use by 2030",date:"Apr 2025",source:"IEA",topic:7,url:"https://www.iea.org/reports/energy-and-ai"},{headline:"Google Found Guilty of Illegal Search Monopoly",date:"Apr 2025",source:"NY Times",topic:1,url:"#"},{headline:"Voice Clone Scams Surge 317% in Late 2025",date:"Dec 2025",source:"Pindrop",topic:2,url:"#"},{headline:"Young Tech Workers See 3-Point Unemployment Spike",date:"Aug 2025",source:"Goldman Sachs",topic:4,url:"https://www.goldmansachs.com/insights/articles/how-will-ai-affect-the-global-workforce"},{headline:"Stanford: Legal AI Tools Hallucinate 17-33%",date:"2025",source:"Stanford",topic:8,url:"https://dho.stanford.edu/wp-content/uploads/Legal_RAG_Hallucinations.pdf"},{headline:"NeurIPS Papers Found with Fabricated AI Citations",date:"Dec 2025",source:"GPTZero",topic:5,url:"#"},{headline:"UNESCO Warns of 'Crisis of Knowing' from Deepfakes",date:"Oct 2025",source:"UNESCO",topic:3,url:"https://www.unesco.org/en/articles/deepfakes-and-crisis-knowing"},{headline:"OpenAI's Stargate: 1.2GW Campus in Texas",date:"2025",source:"Bloomberg",topic:7,url:"#"},{headline:"49% of Gen Z Say AI Reduced Their Degree's Value",date:"May 2025",source:"Nat'l University",topic:6,url:"#"},{headline:"Best AI Models Now Below 1% Hallucination Rate",date:"Apr 2025",source:"Vectara",topic:8,url:"https://vectara.com"},{headline:"EU AI Act Could Cost Startups €2M/Year",date:"2025",source:"JRC",topic:1,url:"#"},{headline:"Two-Thirds of New Data Centers in Water-Stressed Areas",date:"May 2025",source:"Bloomberg",topic:7,url:"#"}];

// SVGs
function ClassicalCentaur(){return(<svg viewBox="0 0 200 120" style={{width:160,height:96,opacity:0.65}}><defs><filter id="sk"><feTurbulence baseFrequency="0.05" numOctaves="2" result="tu"/><feDisplacementMap in="SourceGraphic" in2="tu" scale="1.5"/></filter></defs><g filter="url(#sk)" stroke="#8B6914" strokeWidth="1.2" fill="none" strokeLinecap="round"><ellipse cx="110" cy="72" rx="40" ry="18" opacity="0.6"/><line x1="80" y1="88" x2="75" y2="112"/><line x1="90" y1="88" x2="88" y2="112"/><line x1="130" y1="88" x2="132" y2="112"/><line x1="140" y1="88" x2="145" y2="112"/><path d="M148,68 Q165,55 158,45" opacity="0.5"/><line x1="78" y1="72" x2="78" y2="42"/><circle cx="78" cy="34" r="10" opacity="0.6"/><line x1="78" y1="48" x2="62" y2="56"/><line x1="78" y1="48" x2="58" y2="42"/><line x1="58" y1="42" x2="52" y2="32"/><circle cx="52" cy="28" r="4" stroke="#C9A84C" opacity="0.8"/><line x1="52" y1="24" x2="52" y2="16" stroke="#C9A84C" opacity="0.3"/><line x1="48" y1="26" x2="42" y2="22" stroke="#C9A84C" opacity="0.3"/><line x1="56" y1="26" x2="62" y2="22" stroke="#C9A84C" opacity="0.3"/></g><style>{`@keyframes cb{0%,100%{transform:translateY(0)}50%{transform:translateY(-1px)}}svg g{animation:cb 4s ease-in-out infinite}`}</style></svg>)}
function FuturisticCentaur(){return(<svg viewBox="0 0 200 120" style={{width:160,height:96,opacity:0.75}}><defs><linearGradient id="ng" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00F5D4"/><stop offset="50%" stopColor="#FF006E"/><stop offset="100%" stopColor="#FEE440"/></linearGradient></defs><g stroke="url(#ng)" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.7"><polygon points="70,72 90,58 130,58 150,72 140,88 80,88"/><line x1="90" y1="58" x2="130" y2="72"/><line x1="130" y1="58" x2="90" y2="72"/><polyline points="80,88 76,100 72,112"/><polyline points="92,88 90,100 88,112"/><polyline points="128,88 132,100 136,112"/><polyline points="140,88 144,100 148,112"/><polygon points="70,72 78,42 86,72"/><line x1="74" y1="57" x2="82" y2="57"/><polygon points="78,24 84,28 84,36 78,40 72,36 72,28"/><circle cx="78" cy="32" r="2" stroke="#00F5D4"/><polyline points="74,52 60,56 54,48"/><polyline points="82,52 68,42 58,36"/><circle cx="54" cy="44" r="3" stroke="#00F5D4"/><circle cx="54" cy="44" r="6" stroke="#00F5D4" opacity="0.3"/></g><style>{`@keyframes cf{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}@keyframes cp{0%,100%{opacity:0.7}50%{opacity:0.9}}svg g{animation:cf 3s ease-in-out infinite,cp 2s ease-in-out infinite}`}</style></svg>)}

const grade=(s)=>s>=90?"A+":s>=85?"A":s>=80?"A-":s>=75?"B+":s>=70?"B":"C+";
const ScoreBar=({score,color,t})=>(<div style={{flex:1,height:6,background:t.surfaceAlt,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${score}%`,background:`linear-gradient(90deg,${color}55,${color})`,borderRadius:3}}/></div>);

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════
export default function AIcentaur(){
  const[mode,setMode]=useState("classical");
  const[page,setPage]=useState("home");
  const[sub,setSub]=useState(null);
  const[hCard,setHCard]=useState(null);
  const[expQ,setExpQ]=useState(null);
  const[expSub,setExpSub]=useState(null); // expanded subtopic index
  const[qTab,setQTab]=useState("discuss");
  const[showCentaur,setShowCentaur]=useState(false); // centaur framework collapsed
  const[flash,setFlash]=useState(false);
  const[newsTopic,setNewsTopic]=useState(null);
  const[calcMsgs,setCalcMsgs]=useState(50);
  const[calcWords,setCalcWords]=useState(500);
  const[testPrompt,setTestPrompt]=useState("Explain quantum computing in 3 sentences a 10-year-old would understand.");
  const[testResult,setTestResult]=useState("");
  const[testLoading,setTestLoading]=useState(false);
  const[activeFeatures,setActiveFeatures]=useState([]);
  const[expCat,setExpCat]=useState(null); // expanded ranking category

  const t=themes[mode];const F=mode==="futuristic";
  const toggle=()=>{setFlash(true);setTimeout(()=>{setMode(m=>m==="classical"?"futuristic":"classical");setTimeout(()=>setFlash(false),400)},300)};
  const go=(p,s2)=>{setPage(p);setSub(s2||null);setExpQ(null);setExpSub(null);setQTab("discuss");setShowCentaur(false);setExpCat(null)};
  const back=()=>{if(sub){setSub(null)}else{setPage("home")}};

  const tokPerWord=1.33;const inTok=calcMsgs*calcWords*tokPerWord;const outTok=inTok*1.5;
  const monthlyCost=(m)=>{if(!m.input_price)return m.open?0:null;return((inTok*30*m.input_price/1e6)+(outTok*30*m.output_price/1e6))};
  const bestFor=USE_CASES.map(uc=>{const scored=MODELS.map(m=>({...m,score:uc.keys.reduce((a,k)=>a+(m[k]||0),0)/uc.keys.length})).sort((a,b)=>b.score-a.score);return{...uc,top3:scored.slice(0,3)}});

  // Feature filter
  const matchingModels=activeFeatures.length===0?MODELS:MODELS.filter(m=>activeFeatures.every(fk=>FEATURES.find(f=>f.key===fk)?.models.includes(m.id)));
  const toggleFeature=(key)=>setActiveFeatures(prev=>prev.includes(key)?prev.filter(k=>k!==key):[...prev,key]);

  const runTest=async()=>{setTestLoading(true);setTestResult("");try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:testPrompt}]})});const d=await r.json();setTestResult(d.content?.filter(i=>i.type==="text").map(i=>i.text).join("\n")||"No response")}catch(e){setTestResult("Error: "+e.message)}setTestLoading(false)};

  const CARDS=[
    {id:"questions",icon:"◈",title:"Big Questions",desc:"9 issues shaping AI. Verified facts. Discussion prompts.",tag:"Discuss",nc:neonColors[0]},
    {id:"news",icon:"◆",title:"AI News & Pulse",desc:"Curated headlines color-coded by topic.",tag:"Stay Current",nc:neonColors[1]},
    {id:"detector",icon:"◉",title:"FakeCheck",desc:"Aggregate AI detectors to assess if content is machine-generated.",tag:"Detect",nc:neonColors[2]},
    {id:"tracker",icon:"◎",title:"Model Tracker",desc:"Rankings, trends, safety grades — understand the AI landscape.",tag:"Track",nc:neonColors[3]},
    {id:"tools",icon:"◇",title:"AI Tools",desc:"Find the right model, test prompts, calculate costs.",tag:"Use",nc:neonColors[4]},
    {id:"action",icon:"★",title:"Take Action",desc:"Personal, community, and civic steps. Host your own discussion.",tag:"Act",nc:neonColors[5]},
  ];
  const cardClick=(id)=>{if(id==="detector"){window.open("https://aicentaur-fakecheck.netlify.app/","_blank")}else{go(id)}};

  const SubCards=({items})=>(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:F?12:16,marginBottom:24}}>
    {items.map((item,i)=>(<div key={item.id} onClick={()=>setSub(item.id)} onMouseEnter={e=>e.currentTarget.style.borderColor=F?neonColors[i%6]:t.borderActive} onMouseLeave={e=>e.currentTarget.style.borderColor=t.border} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radius,padding:F?"20px 18px":"24px 22px",cursor:"pointer",transition:"all 0.3s"}}><div style={{fontSize:24,marginBottom:8}}>{item.emoji}</div><div style={{fontSize:F?15:18,fontWeight:F?700:400,marginBottom:4}}>{item.label}</div><div style={{fontSize:12,color:t.textSec,lineHeight:1.5}}>{item.desc}</div></div>))}
  </div>);
  const BackBtn=()=>(<button onClick={back} style={{background:"none",border:"none",color:t.accent,cursor:"pointer",fontSize:13,fontFamily:t.font,marginBottom:20,padding:0}}>← Back</button>);
  const PageTitle=({children,sub:subtitle})=>(<><h2 style={{fontSize:F?32:36,fontWeight:F?800:400,marginBottom:4}}>{children}</h2>{subtitle&&<p style={{fontSize:14,color:t.textSec,marginBottom:24,lineHeight:1.7,fontStyle:F?"normal":"italic"}}>{subtitle}</p>}</>);

  return(
    <div style={{minHeight:"100vh",background:t.bgGrad,color:t.text,fontFamily:t.font,transition:"all 0.5s",position:"relative",overflow:"hidden"}}>
      {flash&&<div style={{position:"fixed",inset:0,zIndex:9999,background:F?"rgba(0,245,212,0.15)":"rgba(201,168,76,0.15)",pointerEvents:"none"}}/>}
      {F&&<><div style={{position:"fixed",top:-200,right:-200,width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(155,93,229,0.06),transparent 70%)",pointerEvents:"none"}}/><div style={{position:"fixed",bottom:0,left:0,right:0,height:250,background:"linear-gradient(180deg,transparent,rgba(0,245,212,0.02))",pointerEvents:"none"}}/></>}
      {!F&&<div style={{height:3,background:"linear-gradient(90deg,transparent 5%,#C9A84C 50%,transparent 95%)"}}/>}

      {/* NAV */}
      <div style={{maxWidth:900,margin:"0 auto",padding:"14px 40px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div onClick={()=>go("home")} style={{cursor:"pointer",fontSize:11,letterSpacing:F?6:8,color:t.accent,fontFamily:t.fontAlt}}>{F?"◈ ":""}THE AI CENTAUR</div>
        <button onClick={toggle} style={{background:F?"rgba(0,245,212,0.1)":t.accentBg,border:`1px solid ${t.borderActive}`,borderRadius:F?20:4,padding:"5px 14px",fontSize:10,letterSpacing:3,cursor:"pointer",color:t.accent,fontFamily:t.fontAlt,fontWeight:600}}>{F?"◈ CLASSICAL":"⚡ SINGULARITY"}</button>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"0 40px 60px"}}>

      {/* HOME */}
      {page==="home"&&(<div style={{paddingTop:30}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{marginBottom:16}}>{F?<FuturisticCentaur/>:<ClassicalCentaur/>}</div>
          <h1 style={{fontSize:F?44:48,fontWeight:F?800:400,lineHeight:1.12,margin:0,...(F?{background:"linear-gradient(135deg,#00F5D4,#FF006E,#FEE440)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}:{})}}>{F?<>Stay informed.<br/>Stay human.</>:"The AI Centaur"}</h1>
          <div style={{width:F?50:60,height:F?2:1,background:F?"linear-gradient(90deg,#00F5D4,#FF006E)":"#C9A84C",margin:"20px auto",opacity:0.5}}/>
          <p style={{fontSize:F?14:16,color:t.textSec,maxWidth:460,margin:"0 auto",lineHeight:1.8,fontStyle:F?"normal":"italic"}}>{F?"A civic hub for understanding and navigating AI.":"A considered guide to artificial intelligence — its capabilities, its dangers, and the wisdom to navigate between them."}</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:F?"1fr 1fr 1fr":"1fr 1fr",gap:F?14:20}}>
          {CARDS.map((c,i)=>(<div key={c.id} onMouseEnter={()=>setHCard(i)} onMouseLeave={()=>setHCard(null)} onClick={()=>cardClick(c.id)} style={{background:t.surface,border:`1px solid ${hCard===i?(F?c.nc:t.borderActive):t.border}`,borderRadius:t.radius,padding:F?"24px 20px":"32px 26px",cursor:"pointer",transition:"all 0.4s",boxShadow:hCard===i?(F?`0 8px 32px ${c.nc}10`:"0 8px 32px rgba(201,168,76,0.12)"):"none",backdropFilter:F?"blur(12px)":"none",transform:hCard===i&&F?"translateY(-2px)":"none"}}>
            {F&&<div style={{width:28,height:28,borderRadius:7,border:`1.5px solid ${c.nc}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:c.nc,marginBottom:12}}>{c.icon}</div>}
            <div style={{fontSize:F?9:10,letterSpacing:F?3:5,color:F?c.nc:t.accent,marginBottom:F?8:12,textTransform:"uppercase",fontFamily:t.fontAlt,fontWeight:F?700:400}}>{c.tag}</div>
            <div style={{fontSize:F?17:22,fontWeight:F?700:400,marginBottom:F?6:8}}>{c.title}</div>
            <div style={{fontSize:F?12:13,color:t.textSec,lineHeight:1.6}}>{c.desc}</div>
            <div style={{marginTop:F?12:16,fontSize:11,color:F?c.nc:t.accent,fontStyle:F?"normal":"italic",fontWeight:F?600:400}}>{c.id==="detector"?"Open FakeCheck ↗":"Explore →"}</div>
          </div>))}
        </div>
      </div>)}

      {/* BIG QUESTIONS */}
      {page==="questions"&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="9 topics. Verified facts. Discussion prompts. Everything for informed AI conversations.">The Big Questions</PageTitle>
        {BIG_QUESTIONS.map((bq,i)=>(<div key={i} style={{background:t.surface,border:`1px solid ${expQ===i?(F?topicColors[i]:t.borderActive):t.border}`,borderRadius:t.radius,marginBottom:10,overflow:"hidden",transition:"all 0.3s"}}>
          <div onClick={()=>{setExpQ(expQ===i?null:i);setQTab("discuss");setExpSub(null);setShowCentaur(false)}} style={{padding:"18px 22px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:32,height:32,borderRadius:F?6:"50%",background:`${topicColors[i]}15`,border:`1.5px solid ${topicColors[i]}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{topicEmojis[i]}</div>
              <div style={{fontSize:16,fontWeight:F?700:400}}>{bq.title}</div>
            </div>
            <div style={{fontSize:16,color:t.textMuted,transform:expQ===i?"rotate(180deg)":"none",transition:"transform 0.3s"}}>▾</div>
          </div>
          {expQ===i&&(<div style={{borderTop:`1px solid ${t.border}`,padding:"0 22px 22px"}}>
            <div style={{padding:"12px 0 16px",fontSize:13,color:t.textSec,fontStyle:F?"normal":"italic",lineHeight:1.7}}>{bq.tagline}</div>
            <div style={{display:"flex",gap:6,marginBottom:18}}>
              {["discuss","facts","verify"].map(tab=>(<button key={tab} onClick={()=>setQTab(tab)} style={{background:qTab===tab?t.accentBg:"transparent",border:`1px solid ${qTab===tab?t.borderActive:t.border}`,borderRadius:F?8:5,padding:"6px 14px",fontSize:11,cursor:"pointer",color:qTab===tab?t.accent:t.textSec,fontWeight:qTab===tab?700:400,fontFamily:t.font}}>{tab==="discuss"?"💬 Discuss":tab==="facts"?"📊 Facts":"🔗 Verify"}</button>))}
            </div>

            {/* DISCUSS TAB */}
            {qTab==="discuss"&&(<div>
              {/* Subtopics — expandable if they have descriptions */}
              {bq.subtopics.map((s,j)=>(
                <div key={j} style={{marginBottom:4}}>
                  {s.desc ? (
                    <div>
                      <div onClick={()=>setExpSub(expSub===j?null:j)} style={{padding:"10px 12px",fontSize:13,color:t.text,cursor:"pointer",background:expSub===j?t.accentBg:"transparent",border:`1px solid ${expSub===j?t.borderActive:t.border}`,borderRadius:t.radius,display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.2s"}}>
                        <span><span style={{color:topicColors[i],marginRight:8}}>›</span><strong>{s.t}</strong></span>
                        <span style={{fontSize:11,color:t.accent}}>{expSub===j?"▾":"+"}</span>
                      </div>
                      {expSub===j&&(<div style={{padding:"14px 16px",margin:"4px 0 8px",background:t.surfaceAlt,borderRadius:t.radius,borderLeft:`3px solid ${topicColors[i]}`,fontSize:13,color:t.textSec,lineHeight:1.7}}>
                        <div style={{marginBottom:10}}>{s.desc}</div>
                        {s.example&&<div style={{background:t.accentBg,padding:"10px 14px",borderRadius:t.radius,fontSize:12,lineHeight:1.6}}><strong style={{color:t.accent}}>Real example:</strong> {s.example}</div>}
                      </div>)}
                    </div>
                  ) : (
                    <div style={{padding:"8px 12px",fontSize:13,color:t.textSec,borderBottom:j<bq.subtopics.length-1?`1px solid ${t.border}`:"none"}}><span style={{color:topicColors[i],marginRight:8}}>›</span>{s.t}</div>
                  )}
                </div>
              ))}

              {/* Discussion Prompt */}
              <div style={{background:t.accentBg,border:`1px solid ${t.borderActive}`,borderRadius:t.radius,padding:"16px 20px",margin:"16px 0"}}><div style={{fontSize:10,letterSpacing:3,color:t.accent,marginBottom:6,fontFamily:t.fontAlt}}>💬 DISCUSSION PROMPT</div><div style={{fontSize:14,lineHeight:1.7,fontStyle:F?"normal":"italic"}}>{bq.prompt}</div></div>

              {/* Centaur Framework — collapsible */}
              <div onClick={()=>setShowCentaur(!showCentaur)} style={{padding:"10px 14px",cursor:"pointer",background:showCentaur?t.accentBg:"transparent",border:`1px solid ${showCentaur?t.borderActive:t.border}`,borderRadius:t.radius,display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.2s"}}>
                <span style={{fontSize:13,fontWeight:600}}>🐴 Use the Centaur Framework</span>
                <span style={{fontSize:11,color:t.accent}}>{showCentaur?"▾":"+"}</span>
              </div>
              {showCentaur&&(<div style={{padding:"12px 14px",marginTop:4,background:t.surfaceAlt,borderRadius:t.radius}}>
                {CENTAUR_QS.map((cq,j)=>(<div key={j} style={{padding:"6px 0",borderBottom:j<4?`1px solid ${t.border}`:"none"}}><span style={{color:cq.color,fontWeight:700,fontSize:12}}>{cq.emoji} {cq.q}</span></div>))}
              </div>)}
            </div>)}

            {/* FACTS TAB */}
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

            {/* VERIFY TAB */}
            {qTab==="verify"&&(<div>
              <div style={{fontSize:12,color:t.textSec,marginBottom:14,fontStyle:F?"normal":"italic"}}>Every fact above comes from these sources. Click to verify.</div>
              {bq.sources.map((s,j)=>(<div key={j} style={{padding:"10px 0",borderBottom:j<bq.sources.length-1?`1px solid ${t.border}`:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontSize:13,fontWeight:600}}>{s.name}</span> <span style={{fontSize:8,letterSpacing:2,color:s.type==="Primary"?t.accentGreen:t.accent,background:`${s.type==="Primary"?t.accentGreen:t.accent}12`,padding:"2px 6px",borderRadius:3,fontFamily:t.fontAlt}}>{s.type.toUpperCase()}</span></div><a href={s.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:t.accent,textDecoration:"none",fontWeight:600}}>Open ↗</a></div>))}
              <div style={{background:t.accentBg,borderRadius:t.radius,padding:"12px 16px",marginTop:16,fontSize:11,color:t.textSec}}><strong>Last verified:</strong> February 2026.</div>
            </div>)}
          </div>)}
        </div>))}
      </div>)}

      {/* NEWS */}
      {page==="news"&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="Headlines color-coded by Big Question topic.">AI News & Pulse</PageTitle>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:20}}>
          <button onClick={()=>setNewsTopic(null)} style={{fontSize:9,letterSpacing:1,padding:"4px 10px",borderRadius:4,border:`1px solid ${newsTopic===null?t.borderActive:t.border}`,background:newsTopic===null?t.accentBg:"transparent",color:newsTopic===null?t.accent:t.textSec,cursor:"pointer",fontFamily:t.fontAlt}}>ALL</button>
          {BIG_QUESTIONS.map((_,j)=>(<button key={j} onClick={()=>setNewsTopic(newsTopic===j?null:j)} style={{fontSize:9,letterSpacing:1,padding:"4px 10px",borderRadius:4,border:`1px solid ${newsTopic===j?topicColors[j]:t.border}`,background:newsTopic===j?`${topicColors[j]}15`:"transparent",color:newsTopic===j?topicColors[j]:t.textSec,cursor:"pointer",fontFamily:t.fontAlt}}>{topicEmojis[j]} {BIG_QUESTIONS[j].title.split(" ")[0]}</button>))}
        </div>
        {NEWS_ITEMS.filter(n=>newsTopic===null||n.topic===newsTopic).map((n,j)=>(<a key={j} href={n.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",color:"inherit",display:"block"}}><div style={{padding:"14px 0",borderBottom:`1px solid ${t.border}`,display:"flex",gap:12,alignItems:"flex-start",cursor:"pointer"}}><div style={{width:4,height:32,borderRadius:2,background:topicColors[n.topic],flexShrink:0,marginTop:2}}/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:F?600:400,lineHeight:1.4,marginBottom:4}}>{n.headline}</div><div style={{display:"flex",gap:8,fontSize:11,color:t.textMuted}}><span>{n.source}</span><span>·</span><span>{n.date}</span><span>·</span><span style={{color:topicColors[n.topic]}}>{topicEmojis[n.topic]} {BIG_QUESTIONS[n.topic].title.split("&")[0].trim()}</span></div></div>{n.url!=="#"&&<span style={{fontSize:11,color:t.accent,flexShrink:0}}>↗</span>}</div></a>))}
      </div>)}

      {/* MODEL TRACKER */}
      {page==="tracker"&&!sub&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="Understand the AI landscape — who's leading, how they compare, and how safe they are.">Model Tracker</PageTitle>
        <SubCards items={[
          {id:"overview",emoji:"📊",label:"Overview",desc:"All 10 models at a glance — what they are, what they're best at."},
          {id:"rankings",emoji:"🏆",label:"Rankings",desc:"How models score across 6 categories, with benchmark explanations."},
          {id:"acceleration",emoji:"🚀",label:"AI Acceleration",desc:"How fast AI is improving — verified milestones and real data."},
          {id:"safety",emoji:"🛡️",label:"Safety & Ethics",desc:"FLI Safety Index grades for each company."},
        ]}/>
      </div>)}

      {/* Tracker: Overview — card-based */}
      {page==="tracker"&&sub==="overview"&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="The top 10 AI models — who makes them, what they're best at, and what they cost.">Overview</PageTitle>
        <div style={{background:t.accentBg,border:`1px solid ${t.borderActive}`,borderRadius:t.radius,padding:"14px 18px",marginBottom:20}}>
          <div style={{fontSize:13,lineHeight:1.7,color:t.textSec}}>
            <strong style={{color:t.accent}}>What is ELO?</strong> — A rating system borrowed from chess. When two AI models are shown to real people side by side and one is preferred, its ELO goes up and the loser's goes down. Higher ELO = more preferred by humans in blind tests. The scores come from <a href="https://lmarena.ai" target="_blank" rel="noopener" style={{color:t.accent}}>Chatbot Arena</a>, which has collected over 6 million votes.
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {MODELS.map(m=>(<div key={m.id} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radius,padding:"18px 16px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:m.color,opacity:0.5}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginTop:2}}>
              <div><div style={{fontSize:15,fontWeight:700}}>{m.name}</div><div style={{fontSize:11,color:t.textMuted}}>{m.company}{m.open?" · Open Source":""}</div></div>
              <div style={{fontSize:14,fontWeight:700,color:t.accent}}>{m.elo}</div>
            </div>
            <div style={{fontSize:12,color:t.textSec,marginTop:8,lineHeight:1.5}}>✦ {m.best}</div>
            <div style={{fontSize:10,color:t.textMuted,marginTop:8}}>{m.input_price?`API: $${m.input_price}/$${m.output_price} per 1M tokens`:m.open?"Free (open source)":"Included with subscription"} · {m.context>=1e6?`${(m.context/1e6).toFixed(0)}M`:`${(m.context/1e3).toFixed(0)}K`} context</div>
          </div>))}
        </div>
      </div>)}

      {/* Tracker: Rankings */}
      {page==="tracker"&&sub==="rankings"&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="Tap any category to learn what it measures and see how models rank.">Rankings</PageTitle>
        {CATEGORIES.map(cat=>{const sorted=[...MODELS].sort((a,b)=>b[cat.key]-a[cat.key]);return(<div key={cat.key} style={{marginBottom:8}}>
          <div onClick={()=>setExpCat(expCat===cat.key?null:cat.key)} style={{padding:"14px 16px",cursor:"pointer",background:expCat===cat.key?t.accentBg:t.surface,border:`1px solid ${expCat===cat.key?t.borderActive:t.border}`,borderRadius:t.radius,transition:"all 0.2s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:20}}>{cat.emoji}</span><span style={{fontSize:16,fontWeight:700}}>{cat.label}</span></div>
              <span style={{fontSize:11,color:t.accent}}>{expCat===cat.key?"▾":"+"}</span>
            </div>
            <div style={{fontSize:12,color:t.textSec,marginTop:6,lineHeight:1.6}}>{cat.desc}</div>
            <div style={{fontSize:10,color:t.textMuted,marginTop:4}}>Source: {cat.institution}</div>
          </div>
          {expCat===cat.key&&(<div style={{padding:"12px 16px",background:t.surfaceAlt,borderRadius:`0 0 ${t.radius}px ${t.radius}px`,border:`1px solid ${t.border}`,borderTop:"none"}}>
            {sorted.map((m,j)=>(<div key={m.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
              <span style={{width:20,fontSize:11,fontWeight:700,color:j<3?t.accent:t.textGhost,textAlign:"right"}}>{j===0?"🥇":j===1?"🥈":j===2?"🥉":`#${j+1}`}</span>
              <span style={{width:120,fontSize:12,color:t.textSec,flexShrink:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</span>
              <ScoreBar score={m[cat.key]} color={m.color} t={t}/>
              <span style={{fontWeight:700,color:m[cat.key]>=85?t.accentGreen:m[cat.key]>=70?t.accent:t.accentRed,fontSize:12,width:24}}>{grade(m[cat.key])}</span>
            </div>))}
          </div>)}
        </div>)})}
        <div style={{background:t.accentBg,borderRadius:t.radius,padding:"12px 16px",marginTop:8,fontSize:11,color:t.textSec,lineHeight:1.6}}>
          <strong>How grades work:</strong> Scores 1-100 → A+ (90+), A (85+), A- (80+), B+ (75+), B (70+). From independent benchmarks, not company claims. Cross-reference at <a href="https://lmarena.ai" target="_blank" rel="noopener" style={{color:t.accent}}>Chatbot Arena</a> and <a href="https://artificialanalysis.ai" target="_blank" rel="noopener" style={{color:t.accent}}>Artificial Analysis</a>.
        </div>
      </div>)}

      {/* Tracker: AI Acceleration */}
      {page==="tracker"&&sub==="acceleration"&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="How fast is AI improving? Verified milestones from Stanford HAI, Epoch AI, and public benchmarks.">AI Acceleration</PageTitle>

        {/* Combined summary */}
        <div style={{background:t.surface,border:`1px solid ${t.borderActive}`,borderRadius:t.radius,padding:"20px 22px",marginBottom:20}}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:12,color:t.accent}}>The Big Picture</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[
              {num:"96%",label:"Reduction in hallucination rates",period:"2021 → 2025",detail:"Best model went from 21.8% to 0.7%"},
              {num:"10×",label:"Cost reduction per capability",period:"Every ~18 months",detail:"Same performance costs 90% less"},
              {num:"67 pts",label:"SWE-bench coding jump",period:"In one year (2023→2024)",detail:"AI went from struggling to nearly solving real GitHub issues"},
              {num:"<1 yr",label:"Time to saturate new benchmarks",period:"Tests become too easy",detail:"Benchmarks designed to last years are maxed out in months"},
            ].map((d,i)=>(<div key={i} style={{background:t.surfaceAlt,borderRadius:t.radius,padding:"14px 16px"}}>
              <div style={{fontSize:26,fontWeight:700,fontFamily:t.fontAlt,color:t.text}}>{d.num}</div>
              <div style={{fontSize:12,fontWeight:600,marginBottom:2}}>{d.label}</div>
              <div style={{fontSize:11,color:t.accent}}>{d.period}</div>
              <div style={{fontSize:11,color:t.textMuted,marginTop:4}}>{d.detail}</div>
            </div>))}
          </div>
        </div>

        {/* Individual measures — expandable */}
        {[
          {id:"benchmarks",emoji:"📉",title:"Benchmark Saturation Speed",summary:"New AI tests are being maxed out faster than ever. Tests designed to challenge models for years become obsolete in months.",details:[
            {year:"2023",event:"MMMU benchmark introduced (multimodal reasoning)",detail:"Designed to be hard enough to last several years."},
            {year:"2024",event:"MMMU scores jumped 18.8 percentage points",detail:"Models went from struggling to nearly acing it in one year."},
            {year:"2023",event:"GPQA introduced (PhD-level science questions)",detail:"Questions written by domain experts to be beyond AI capabilities."},
            {year:"2024",event:"GPQA scores jumped 48.9 percentage points",detail:"Multiple models now match or exceed average human PhD performance."},
            {year:"2023",event:"SWE-bench introduced (real GitHub code fixes)",detail:"Testing if AI can fix actual software bugs from real projects."},
            {year:"2024",event:"SWE-bench scores jumped 67.3 percentage points",detail:"AI went from mostly failing to solving the majority of real coding tasks."},
          ],source:"Stanford HAI AI Index Report 2025"},
          {id:"cost",emoji:"💸",title:"Training Cost Per Capability",summary:"The same level of AI performance gets roughly 10× cheaper every 18 months. What cost $100M to train in 2023 costs ~$10M in 2025.",details:[
            {year:"2020",event:"GPT-3 training cost: ~$4.6 million",detail:"175 billion parameters. Groundbreaking at the time."},
            {year:"2023",event:"Equivalent capability trainable for ~$500K",detail:"Open-source models matched GPT-3 at a fraction of the cost."},
            {year:"2024",event:"DeepSeek V3 trained for ~$5.5 million",detail:"Comparable to models that cost 10-20× more. Shocked the industry."},
            {year:"2025",event:"Frontier models still expensive ($100M+) but gap closing fast",detail:"The frontier keeps moving, but yesterday's frontier becomes affordable quickly."},
          ],source:"Epoch AI compute trends, industry reports"},
          {id:"elo",emoji:"📈",title:"Peak Arena ELO Over Time",summary:"The highest ELO score keeps climbing, and the gap between top models keeps shrinking — more competition at the frontier.",details:[
            {year:"Jan 2024",event:"Top ELO: ~1250 (GPT-4 Turbo)",detail:"Clear leader with significant gap over competitors."},
            {year:"Jun 2024",event:"Top ELO: ~1290 (Claude 3.5 Sonnet)",detail:"Anthropic takes the lead. Gap to #2 narrowing."},
            {year:"Jan 2025",event:"Top ELO: ~1350 (multiple models within 30 points)",detail:"At least 4 models within striking distance of the top. No clear winner."},
            {year:"Feb 2026",event:"Top ELO: ~1380+ (tight race)",detail:"The frontier is crowded. Lead changes monthly. Competition is fierce."},
          ],source:"Chatbot Arena / LMSYS (lmarena.ai) — 6M+ human votes"},
          {id:"timeline",emoji:"⏱️",title:"Time to Human-Level Performance",summary:"The time it takes AI to match human experts in a new domain is compressing dramatically.",details:[
            {year:"2016",event:"Image recognition surpasses average human",detail:"After decades of research. Felt like a milestone."},
            {year:"2023",event:"Medical licensing exam passed (USMLE)",detail:"AI passed all three steps of the US medical licensing exam."},
            {year:"2024",event:"PhD-level science questions (GPQA)",detail:"AI matches average PhD student performance in their own field."},
            {year:"2025",event:"Competition math (AIME), software engineering (SWE-bench)",detail:"Domains that seemed safely human two years ago are now contested."},
          ],source:"Stanford HAI AI Index 2025, Epoch AI"},
        ].map(measure=>(<div key={measure.id} style={{marginBottom:8}}>
          <div onClick={()=>setExpCat(expCat===measure.id?null:measure.id)} style={{padding:"14px 16px",cursor:"pointer",background:expCat===measure.id?t.accentBg:t.surface,border:`1px solid ${expCat===measure.id?t.borderActive:t.border}`,borderRadius:t.radius,transition:"all 0.2s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:20}}>{measure.emoji}</span><span style={{fontSize:15,fontWeight:700}}>{measure.title}</span></div>
              <span style={{fontSize:11,color:t.accent}}>{expCat===measure.id?"▾":"+"}</span>
            </div>
            <div style={{fontSize:12,color:t.textSec,marginTop:6,lineHeight:1.6}}>{measure.summary}</div>
          </div>
          {expCat===measure.id&&(<div style={{padding:"12px 16px",background:t.surfaceAlt,borderRadius:`0 0 ${t.radius}px ${t.radius}px`,border:`1px solid ${t.border}`,borderTop:"none"}}>
            {measure.details.map((d,j)=>(<div key={j} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:j<measure.details.length-1?`1px solid ${t.border}`:"none"}}>
              <div style={{fontSize:11,fontWeight:700,color:t.accent,fontFamily:t.fontAlt,width:60,flexShrink:0}}>{d.year}</div>
              <div><div style={{fontSize:12,fontWeight:600,marginBottom:2}}>{d.event}</div><div style={{fontSize:11,color:t.textMuted,lineHeight:1.5}}>{d.detail}</div></div>
            </div>))}
            <div style={{fontSize:10,color:t.textMuted,marginTop:10,fontStyle:"italic"}}>Source: {measure.source}</div>
          </div>)}
        </div>))}

        <div style={{background:t.accentBg,borderRadius:t.radius,padding:"14px 18px",marginTop:16,fontSize:12,color:t.textSec,lineHeight:1.6}}>
          All data from verified, published sources. When connected to live data (via API refresh), this section will update automatically.
        </div>
      </div>)}

      {/* Tracker: Safety */}
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
        <div style={{background:t.accentBg,borderRadius:t.radius,padding:"14px 18px",marginTop:12,fontSize:12,color:t.textSec,lineHeight:1.6}}>Source: <a href="https://futureoflife.org/ai-safety-index-winter-2025/" target="_blank" rel="noopener" style={{color:t.accent}}>FLI AI Safety Index (Winter 2025)</a>. No company scored above C+.</div>
      </div>)}

      {/* AI TOOLS */}
      {page==="tools"&&!sub&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="Find the right model, test prompts, and calculate costs.">AI Tools</PageTitle>
        <SubCards items={[
          {id:"bestfor",emoji:"🎯",label:"Best For…",desc:"Pick your task — we recommend the best model."},
          {id:"features",emoji:"🔧",label:"Model by Features",desc:"Toggle the features you need — see which models match."},
          {id:"tryit",emoji:"🧪",label:"Try It",desc:"Test a prompt and compare models head-to-head."},
          {id:"cost",emoji:"💰",label:"Cost Calculator",desc:"Estimate your monthly API cost."},
        ]}/>
      </div>)}

      {/* Tools: Best For */}
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

      {/* Tools: Model by Features */}
      {page==="tools"&&sub==="features"&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="Toggle the features you need. Only models with ALL selected features will show.">Model by Features</PageTitle>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:24}}>
          {FEATURES.map(f=>(<button key={f.key} onClick={()=>toggleFeature(f.key)} style={{padding:"8px 14px",borderRadius:F?20:6,border:`1px solid ${activeFeatures.includes(f.key)?t.borderActive:t.border}`,background:activeFeatures.includes(f.key)?t.accentBg:"transparent",color:activeFeatures.includes(f.key)?t.accent:t.textSec,cursor:"pointer",fontSize:12,fontFamily:t.font,transition:"all 0.2s"}}>{f.label}</button>))}
        </div>
        <div style={{fontSize:12,color:t.textMuted,marginBottom:16}}>{activeFeatures.length===0?"Showing all models. Toggle features above to filter.":matchingModels.length===0?"No models match all selected features. Try removing one.":`${matchingModels.length} model${matchingModels.length!==1?"s":""} match${matchingModels.length===1?"es":""} your criteria:`}</div>
        {matchingModels.map(m=>(<div key={m.id} style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radius,padding:"14px 18px",marginBottom:8,display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:m.color,flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700}}>{m.name}</div>
            <div style={{fontSize:11,color:t.textMuted}}>{m.company}{m.open?" · Open Source":""} · {m.best}</div>
          </div>
          <div style={{fontSize:11,color:t.accent,flexShrink:0}}>{m.input_price?`$${m.input_price}/$${m.output_price}`:m.open?"Free":"Included"}</div>
        </div>))}
      </div>)}

      {/* Tools: Try It */}
      {page==="tools"&&sub==="tryit"&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="Test a prompt or compare models head-to-head.">Try It</PageTitle>

        {/* Direct test */}
        <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radius,padding:20,marginBottom:24}}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Test a prompt against Claude Sonnet 4.5</div>
          <textarea value={testPrompt} onChange={e=>setTestPrompt(e.target.value)} rows={3} style={{width:"100%",background:t.surfaceAlt,border:`1px solid ${t.border}`,borderRadius:t.radius,padding:12,color:t.text,fontSize:13,resize:"vertical",fontFamily:"inherit",boxSizing:"border-box"}}/>
          <button onClick={runTest} disabled={testLoading} style={{background:t.accent,border:"none",borderRadius:t.radius,color:"#000",padding:"8px 20px",fontSize:13,fontWeight:700,cursor:testLoading?"wait":"pointer",marginTop:10,opacity:testLoading?0.5:1}}>{testLoading?"Running…":"▶ Send"}</button>
          {testResult&&<div style={{background:t.surfaceAlt,borderRadius:t.radius,padding:14,marginTop:14,fontSize:13,color:t.textSec,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{testResult}</div>}
        </div>

        {/* Comparison sites — prominent */}
        <div style={{fontSize:16,fontWeight:700,marginBottom:8}}>⚔️ Compare Models Head-to-Head</div>
        <div style={{fontSize:13,color:t.textSec,marginBottom:16,lineHeight:1.7}}>These sites let you send the same prompt to multiple AI models simultaneously and see the results side by side — like a blind taste test. It's the best way to see which model actually performs best for YOUR specific tasks.</div>
        {[
          {name:"Chatbot Arena (LMArena)",url:"https://lmarena.ai",desc:"The gold standard. You get two anonymous responses — you pick the winner without knowing which model wrote which. Over 6 million votes have shaped these rankings. This is where ELO scores come from.",tag:"Anonymous Blind Testing"},
          {name:"Fello AI",url:"https://felloai.com",desc:"Send one prompt to multiple named models and see all responses at once. Great for comparing how different models handle the same question — you can see the differences in style, accuracy, and depth.",tag:"Named Side-by-Side"},
          {name:"OpenRouter Playground",url:"https://openrouter.ai/playground",desc:"API access to 200+ models in one place. More technical, but gives you access to models you can't try anywhere else — including open-source models and smaller providers.",tag:"200+ Models"},
        ].map(s=>(<a key={s.name} href={s.url} target="_blank" rel="noopener" style={{textDecoration:"none",color:"inherit",display:"block"}}>
          <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radius,padding:"18px 20px",marginBottom:10,cursor:"pointer",transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=t.borderActive} onMouseLeave={e=>e.currentTarget.style.borderColor=t.border}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{fontSize:15,fontWeight:700}}>{s.name}</div>
              <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:9,letterSpacing:2,padding:"2px 8px",borderRadius:3,background:t.accentBg,color:t.accent,fontFamily:t.fontAlt}}>{s.tag.toUpperCase()}</span><span style={{color:t.accent}}>↗</span></div>
            </div>
            <div style={{fontSize:13,color:t.textSec,lineHeight:1.6}}>{s.desc}</div>
          </div>
        </a>))}
      </div>)}

      {/* Tools: Cost Calc */}
      {page==="tools"&&sub==="cost"&&(<div style={{paddingTop:10}}>
        <BackBtn/><PageTitle sub="Estimate monthly API cost based on your usage.">Cost Calculator</PageTitle>
        <div style={{background:t.surface,border:`1px solid ${t.border}`,borderRadius:t.radius,padding:20,marginBottom:20}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div><label style={{fontSize:12,fontWeight:700,color:t.textMuted,display:"block",marginBottom:6}}>Messages per day</label><input type="range" min={5} max={500} value={calcMsgs} onChange={e=>setCalcMsgs(+e.target.value)} style={{width:"100%"}}/><div style={{fontSize:20,fontWeight:700,color:t.accent}}>{calcMsgs}</div></div>
            <div><label style={{fontSize:12,fontWeight:700,color:t.textMuted,display:"block",marginBottom:6}}>Avg words per message</label><input type="range" min={50} max={2000} value={calcWords} onChange={e=>setCalcWords(+e.target.value)} style={{width:"100%"}}/><div style={{fontSize:20,fontWeight:700,color:t.accent}}>{calcWords}</div></div>
          </div>
          <div style={{fontSize:11,color:t.textGhost,marginTop:8}}>≈ {(inTok/1000).toFixed(0)}K input + {(outTok/1000).toFixed(0)}K output tokens/day</div>
        </div>
        {[...MODELS].sort((a,b)=>(monthlyCost(a)??999)-(monthlyCost(b)??999)).map((m,i)=>{const c=monthlyCost(m);return(<div key={m.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,padding:"7px 12px",background:i===0?`${t.accentGreen}11`:"transparent",borderRadius:t.radius,border:i===0?`1px solid ${t.accentGreen}33`:"1px solid transparent"}}><span style={{width:8,height:8,borderRadius:"50%",background:m.color,flexShrink:0}}/><span style={{flex:1,fontSize:13,fontWeight:600}}>{m.name}</span><span style={{fontSize:13,fontWeight:700,color:c===null?(m.open?t.accentGreen:t.textGhost):c<1?t.accentGreen:c<10?t.accent:t.accentRed}}>{c===null?(m.open?"Free*":"—"):`$${c.toFixed(2)}/mo`}</span></div>)})}
        <div style={{fontSize:10,color:t.textGhost,marginTop:12}}>*Open-source = free but requires hosting. Prices are API costs. Subscriptions ($20/mo for most) may be better value for individuals.</div>
      </div>)}

      {/* TAKE ACTION */}
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
            <div key={j} style={{display:"flex",gap:14,padding:"8px 0",borderBottom:j<6?`1px solid ${t.border}`:"none"}}><div style={{fontSize:11,color:t.accent,fontWeight:700,fontFamily:t.fontAlt,width:36,flexShrink:0}}>{step.time}</div><div><div style={{fontSize:12,fontWeight:700,marginBottom:1}}>{step.label}</div><div style={{fontSize:11,color:t.textSec,lineHeight:1.5}}>{step.detail}</div></div></div>
          ))}
        </div>
      </div>)}

      </div>
      {/* FOOTER */}
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 40px 20px"}}>
        {!F?<div style={{height:3,background:"linear-gradient(90deg,transparent 5%,#C9A84C 50%,transparent 95%)",marginBottom:14}}/>:<div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(0,245,212,0.2),transparent)",marginBottom:14}}/>}
        <div style={{fontSize:11,color:t.textMuted,letterSpacing:F?2:4,textAlign:"center",fontFamily:t.fontAlt}}>{F?"BUILT BY A CENTAUR · HUMAN + AI · 2026":"HUMAN + MACHINE · MMXXVI"}</div>
      </div>
    </div>
  );
}
