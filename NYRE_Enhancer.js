/**
 * NYRE_Enhancer.js
 * Local, rule-based enhancement for the existing NYRE portfolio chatbot.
 *
 * Requirements:
 * 1. Load NYRE.js first.
 * 2. Load this file after NYRE.js.
 * 3. No API, backend, external library, or network request is used.
 *
 * This is a knowledge-based chatbot, not an LLM. Extend localKnowledgeBase to
 * teach it additional topics.
 */
(function () {
    "use strict";

    // Capture the original function once. This prevents the wrapper from
    // accidentally calling itself recursively.
    const originalAskNyre = typeof window.askNyre === "function"
        ? window.askNyre
        : null;

    const context = {
        lastTopicId: null,
        lastQuestion: "",
        lastAnswer: "",
        recentTopics: [],
        reset() {
            this.lastTopicId = null;
            this.lastQuestion = "";
            this.lastAnswer = "";
            this.recentTopics = [];
        },
        remember(topicId, question, answer) {
            if (topicId) {
                this.lastTopicId = topicId;
                this.recentTopics = [
                    topicId,
                    ...this.recentTopics.filter(id => id !== topicId)
                ].slice(0, 5);
            }
            this.lastQuestion = question || "";
            this.lastAnswer = answer || "";
        }
    };

    // Keep punctuation needed for arithmetic in the raw message. Text matching
    // uses a separate normalized form.
    function normalizeText(value) {
        if (typeof value !== "string") return "";
        return value
            .toLowerCase()
            .replace(/[’‘]/g, "'")
            .replace(/[^a-z0-9\s%?.'-]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function tokenize(value) {
        const stopWords = new Set([
            "a", "an", "the", "is", "are", "was", "were", "to", "of", "in",
            "on", "at", "by", "for", "with", "about", "it", "that", "this",
            "and", "or", "but", "can", "could", "would", "should", "you",
            "your", "me", "my", "please", "tell", "explain", "what", "how",
            "why", "does", "do"
        ]);

        return normalizeText(value)
            .replace(/[?.']/g, " ")
            .split(/\s+/)
            .filter(word => word.length > 1 && !stopWords.has(word));
    }

    function randomItem(items) {
        return items[Math.floor(Math.random() * items.length)];
    }

    function isOriginalFallback(response) {
        if (typeof response !== "string" || !response.trim()) return true;

        const text = response.toLowerCase().replace(/\s+/g, " ").trim();

        // Match common generic fallback wording. Keep this list broad enough to
        // support slightly different wording in the original NYRE.js.
        const fallbackPatterns = [
            /i don't understand/,
            /i do not understand/,
            /could you (please )?rephrase/,
            /please rephrase/,
            /not sure what you mean/,
            /can you ask (something|me) else/,
            /i couldn't find/,
            /i could not find/,
            /i don't have (that )?(information|an answer)/,
            /i do not have (that )?(information|an answer)/,
            /not in (my|jasper's) portfolio/,
            /outside (my|jasper's) portfolio/,
            /i can help with .*portfolio/,
            /i'm not sure how to answer/,
            /i am not sure how to answer/,
            /try asking about .*portfolio/,
            /i don't know how to answer/
        ];

        return text.length < 5 || fallbackPatterns.some(pattern => pattern.test(text));
    }

    const greetings = [
        "hi", "hello", "hey", "hey there", "hi there", "yo", "sup", "howdy",
        "good morning", "good afternoon", "good evening", "good night",
        "what's up", "whats up", "how are you", "how's it going",
        "hows it going", "how's life", "are you there", "hello again",
        "nice to meet you", "long time no see"
    ];

    const greetingResponses = [
        "Hey! I'm NYRE. Ask me about Jasper's portfolio, technology, science, or one of my built-in topics.",
        "Hi there! What would you like to talk about?",
        "Hello! I can help with portfolio questions and a range of general topics. What's on your mind?",
        "Hey! Ready when you are. Ask me a question or name a topic."
    ];

    const casualResponses = {
        thanks: [
            "You're welcome! Let me know if you want to explore anything else.",
            "Happy to help!",
            "Anytime!"
        ],
        apology: [
            "No worries!",
            "All good. What would you like to try next?"
        ],
        goodbye: [
            "See you later! Take care.",
            "Goodbye! Feel free to come back anytime.",
            "Bye! Good luck with your projects."
        ],
        acknowledgment: [
            "Got it!",
            "Alright!",
            "Sounds good."
        ],
        positive: [
            "Nice!",
            "Glad that helped.",
            "Awesome!"
        ]
    };

    function handleCasualConversation(message) {
        const text = normalizeText(message);
        if (!text) return null;

        if (/^(bye|goodbye|see you|see ya|catch you later|cya)(\s|$)/.test(text)) {
            return randomItem(casualResponses.goodbye);
        }

        if (/\b(thanks|thank you|thx|appreciate it)\b/.test(text)) {
            return randomItem(casualResponses.thanks);
        }

        if (/^(sorry|my bad|never mind|nevermind)\b/.test(text)) {
            return randomItem(casualResponses.apology);
        }

        if (/^(ok|okay|alright|got it|understood|makes sense)[.! ]*$/.test(text)) {
            return randomItem(casualResponses.acknowledgment);
        }

        if (/^(nice|cool|awesome|great|that's cool|thats cool)[.! ]*$/.test(text)) {
            return randomItem(casualResponses.positive);
        }

        const isPureGreeting = greetings.some(greeting => text === greeting);
        if (isPureGreeting) return randomItem(greetingResponses);

        // Handle greeting plus a question without swallowing the actual question.
        if (/^(hi|hello|hey)[,! ]+(nyre[,! ]*)?/.test(text) && text.length < 18) {
            return randomItem(greetingResponses);
        }

        return null;
    }

    const localKnowledgeBase = [
        {
            id: "sky_blue",
            keywords: ["sky", "blue sky", "why is the sky blue", "color of the sky"],
            topic: "Why is the sky blue?",
            summary: "The sky looks blue because air molecules scatter shorter-wavelength blue light from sunlight in many directions.",
            details: "Sunlight contains many colors. When it enters Earth's atmosphere, tiny gas molecules scatter shorter wavelengths more strongly than longer wavelengths. This is called Rayleigh scattering. Violet light is scattered too, but our eyes and the spectrum of sunlight make the sky appear mainly blue.",
            examples: "Think of sunlight entering the atmosphere from different directions. Blue light gets scattered toward your eyes, so the sky looks blue even when you are not looking directly at the Sun."
        },
        {
            id: "gravity",
            keywords: ["gravity", "gravitational force", "how does gravity work"],
            topic: "Gravity",
            summary: "Gravity is the attraction between objects that have mass and, more broadly, the effect of mass and energy on spacetime.",
            details: "In everyday life, Earth's gravity pulls objects toward its center. In Einstein's general relativity, mass and energy curve spacetime, and objects move through that curved spacetime. Newton's description is still very useful for ordinary calculations.",
            examples: "When you drop a pen, Earth's gravity accelerates it toward the ground."
        },
        {
            id: "ram_storage",
            keywords: ["ram", "storage", "ssd", "hdd", "ram vs storage", "difference between ram and storage", "memory vs storage"],
            topic: "RAM vs. Storage",
            summary: "RAM temporarily holds information programs are using, while an SSD or HDD keeps files even when the computer is turned off.",
            details: "RAM is fast and volatile, so its contents are normally lost when power is removed. Storage is non-volatile and holds the operating system, apps, photos, and documents. More RAM can help with multitasking; faster storage can help boot and load programs more quickly.",
            examples: "RAM is like a desk where you spread out the work you are doing. Storage is like a cabinet where you keep documents for later."
        },
        {
            id: "overheating",
            keywords: ["computer overheating", "pc overheating", "laptop overheating", "computer hot", "why does my computer overheat"],
            topic: "Computer Overheating",
            summary: "A computer overheats when its cooling system cannot remove heat quickly enough.",
            details: "Common causes include blocked vents, dust buildup, a failing fan, high workloads, or poor contact between a chip and its heatsink. The computer may slow down to protect itself. Check airflow and fan operation before assuming a component is damaged.",
            examples: "Using a laptop on a blanket can block its air intake and trap heat."
        },
        {
            id: "electricity",
            keywords: ["electricity", "electric current", "voltage", "current and resistance", "what is electricity"],
            topic: "Electricity",
            summary: "Electricity involves electric charges and the effects they create. In a circuit, voltage drives current through components.",
            details: "Voltage is the electrical potential difference, current is the rate of charge flow, and resistance opposes current. These are related by Ohm's law: V = I × R for a simple ohmic component.",
            examples: "A battery provides a voltage. When a switch closes a complete circuit, current can flow and power a lamp."
        },
        {
            id: "wifi",
            keywords: ["wifi", "wi fi", "wireless internet", "how does wifi work"],
            topic: "How Wi-Fi Works",
            summary: "Wi-Fi uses radio waves to exchange data between wireless devices and an access point or router.",
            details: "Your device encodes data into radio signals and sends them to the router. The router forwards traffic to other local devices or to the internet through its network connection. Wi-Fi itself is the local wireless connection, not the internet service.",
            examples: "Your phone can connect to a Wi-Fi router even if the router's internet connection is temporarily down."
        },
        {
            id: "html_css",
            keywords: ["html", "css", "html vs css", "difference between html and css", "what is html", "what is css"],
            topic: "HTML and CSS",
            summary: "HTML describes the structure and content of a web page, while CSS controls its appearance and layout.",
            details: "HTML provides elements such as headings, paragraphs, images, and links. CSS controls colors, fonts, spacing, positioning, and responsive layouts. JavaScript can add behavior and interactivity.",
            examples: "HTML is the structure of a house, CSS is its paint and interior design, and JavaScript is like the switches and moving parts."
        },
        {
            id: "javascript",
            keywords: ["javascript", "js", "what is javascript", "javascript programming"],
            topic: "JavaScript",
            summary: "JavaScript is a programming language commonly used to add behavior and interactivity to websites.",
            details: "In a browser, JavaScript can respond to button clicks, validate forms, update page content, and work with data. It can also run outside the browser in environments such as Node.js.",
            examples: "A JavaScript click handler can make a menu open when a user presses its button."
        },
        {
            id: "php",
            keywords: ["php", "what is php", "php programming"],
            topic: "PHP",
            summary: "PHP is a server-side scripting language often used to build dynamic websites and interact with databases.",
            details: "A PHP script can process form submissions, check permissions, query a database, and generate a response for the browser. Unlike a static GitHub Pages site, PHP normally needs a server that can execute PHP.",
            examples: "A PHP login form can check a submitted username and password against stored account data on a configured server."
        },
        {
            id: "database",
            keywords: ["database", "sql", "mysql", "what is a database", "what is mysql"],
            topic: "Databases",
            summary: "A database organizes information so it can be stored, searched, updated, and managed consistently.",
            details: "A relational database stores data in tables containing rows and columns. SQL is a language used to create, query, and update many relational databases. MySQL is one database management system that uses SQL.",
            examples: "A gym system might store members in one table and attendance records in another, linked by a member ID."
        },
        {
            id: "esp32",
            keywords: ["esp32", "esp 32", "what is an esp32", "esp32 microcontroller"],
            topic: "ESP32 Microcontroller",
            summary: "The ESP32 is a family of microcontrollers with wireless features on many models, commonly used in embedded and Internet of Things projects.",
            details: "Depending on the specific model, an ESP32 can provide Wi-Fi, Bluetooth, GPIO pins, timers, and interfaces for sensors and displays. It can be programmed using tools such as Arduino IDE or ESP-IDF. Features differ between ESP32 variants.",
            examples: "An ESP32 can read a temperature sensor and send the measurement over Wi-Fi to a dashboard."
        },
        {
            id: "earth_seasons",
            keywords: ["seasons", "why do we have seasons", "summer and winter"],
            topic: "Why Earth Has Seasons",
            summary: "Earth's seasons are mainly caused by its axis being tilted about 23.5 degrees as it orbits the Sun.",
            details: "When a hemisphere tilts toward the Sun, it receives more direct sunlight and generally has longer days. When it tilts away, sunlight is less direct and days are shorter. Earth's changing distance from the Sun is not the main cause of seasons.",
            examples: "When the Northern Hemisphere tilts toward the Sun around June, it experiences summer while the Southern Hemisphere experiences winter."
        },
        {
            id: "renewable_energy",
            keywords: ["renewable energy", "green energy", "solar energy", "wind energy", "hydroelectric"],
            topic: "Renewable Energy",
            summary: "Renewable energy comes from sources that naturally replenish, such as sunlight, wind, and flowing water.",
            details: "Solar panels convert light into electricity. Wind turbines convert moving air into electricity. Hydroelectric systems use moving or falling water to turn turbines. Each source has benefits and limitations related to location, cost, storage, and environmental effects.",
            examples: "A rooftop solar panel system can generate electricity during daylight when there is sufficient sunlight."
        },
        {
            id: "earth_rotation",
            keywords: ["earth stopped rotating", "what if earth stopped rotating", "earth stop spinning", "stop rotating"],
            topic: "What If Earth Suddenly Stopped Rotating?",
            summary: "If Earth suddenly stopped rotating while its atmosphere and surface kept their motion, the result would be catastrophic because of inertia.",
            details: "At the equator, Earth's surface moves eastward at roughly 1,670 km/h. A sudden stop would create extreme motion in the atmosphere and oceans. The real outcome would depend on how the stop happened; Earth does not have a realistic mechanism to halt instantly.",
            examples: "A sudden change in motion is dangerous because objects and fluids tend to keep moving unless a force changes their motion."
        },
        {
            id: "internet",
            keywords: ["internet", "how does the internet work", "what is the internet"],
            topic: "The Internet",
            summary: "The internet is a global network of connected networks that exchange data using agreed communication protocols.",
            details: "Devices send data in packets. Routers forward packets between networks, while protocols such as IP and TCP help data reach the right destination and arrive in usable form. The web is one service that runs on the internet; email and other services also use it.",
            examples: "When you open a website, your device looks up the domain, connects to a server, and requests the page's resources."
        },
        {
            id: "ai",
            keywords: ["artificial intelligence", "ai", "machine learning", "what is ai"],
            topic: "Artificial Intelligence",
            summary: "Artificial intelligence is a broad field focused on systems that perform tasks associated with abilities such as recognizing patterns, understanding language, or making predictions.",
            details: "Some AI systems use rules written by people; others learn patterns from training data. Machine learning is a major approach within AI. A rule-based chatbot follows programmed rules and stored information, while a large language model generates text using a model trained on large amounts of data.",
            examples: "A rule-based chatbot might match the word 'ESP32' to a stored explanation. A language model can generate a response to many differently phrased questions, though it can still make mistakes."
        },
        {
            id: "photosynthesis",
            keywords: ["photosynthesis", "how do plants make food"],
            topic: "Photosynthesis",
            summary: "Photosynthesis lets plants use light energy to turn water and carbon dioxide into sugars, releasing oxygen as a by-product.",
            details: "In plants, photosynthesis mainly occurs in chloroplasts. Chlorophyll helps capture light energy. The process stores energy in chemical form and supports much of the food web on Earth.",
            examples: "A plant uses light, water from its roots, and carbon dioxide from the air to make sugars it can use to grow."
        },
        {
            id: "newton_laws",
            keywords: ["newton laws", "newton's laws", "laws of motion", "three laws of motion"],
            topic: "Newton's Laws of Motion",
            summary: "Newton's three laws describe inertia, how net force changes motion, and equal-and-opposite interaction forces.",
            details: "First law: an object keeps its motion unless a net external force acts on it. Second law: net force equals mass times acceleration, F = ma. Third law: forces between interacting objects occur in equal and opposite pairs.",
            examples: "Pushing an empty cart accelerates it more easily than a heavily loaded cart when you apply the same force."
        }
    ];

    function findKnowledgeItemById(id) {
        return localKnowledgeBase.find(item => item.id === id) || null;
    }

    function scoreKnowledgeItem(message, item) {
        const normalized = normalizeText(message);
        const userTokens = tokenize(message);
        let score = 0;

        for (const keyword of item.keywords) {
            const normalizedKeyword = normalizeText(keyword);
            if (normalized === normalizedKeyword) {
                score += 30 + normalizedKeyword.length;
            } else if (normalized.includes(normalizedKeyword)) {
                score += 10 + normalizedKeyword.length;
            }
        }

        const itemTokens = new Set(tokenize(item.topic + " " + item.summary + " " + item.keywords.join(" ")));
        for (const token of userTokens) {
            if (itemTokens.has(token)) score += 2;
        }

        // Avoid letting a single common word such as "what" select a topic.
        return score;
    }

    function queryKnowledgeBase(message) {
        let bestItem = null;
        let bestScore = 0;

        for (const item of localKnowledgeBase) {
            const score = scoreKnowledgeItem(message, item);
            if (score > bestScore) {
                bestScore = score;
                bestItem = item;
            }
        }

        if (!bestItem || bestScore < 4) return null;

        const response = `**${bestItem.topic}**\n\n${bestItem.summary}\n\n${bestItem.details}`;
        context.remember(bestItem.id, message, response);
        return response;
    }

    function handleFollowUp(message) {
        const text = normalizeText(message);

        if (/\b(reset context|clear memory|start over|forget this topic)\b/.test(text)) {
            context.reset();
            return "Context cleared. What would you like to talk about next?";
        }

        const asksFollowUp = /\b(tell me more|explain more|explain that|why|how so|give me an example|example|simplify|make it simple|what do you mean|step by step|continue)\b/.test(text);
        if (!asksFollowUp || !context.lastTopicId) return null;

        const item = findKnowledgeItemById(context.lastTopicId);
        if (!item) return null;

        if (/\b(example|give me an example)\b/.test(text)) {
            return `**Example — ${item.topic}**\n\n${item.examples || item.summary}`;
        }

        if (/\b(simplify|make it simple|beginner|simple words)\b/.test(text)) {
            return `**In simple terms:** ${item.summary}`;
        }

        if (/\b(step by step|steps)\b/.test(text)) {
            return `**${item.topic}, step by step**\n\n${item.details}`;
        }

        return `**More about ${item.topic}**\n\n${item.details}\n\n**Example:** ${item.examples}`;
    }

    function handleMath(message) {
        // Use the original message rather than normalizeText because operators
        // such as +, -, *, and / must remain intact.
        const text = String(message).toLowerCase().replace(/,/g, "").trim();

        const percent = text.match(/(-?\d+(?:\.\d+)?)\s*%\s*(?:of)\s*(-?\d+(?:\.\d+)?)/);
        if (percent) {
            const percentage = Number(percent[1]);
            const value = Number(percent[2]);
            const result = percentage / 100 * value;
            return `${percentage}% of ${value} is **${formatNumber(result)}**.`;
        }

        const arithmetic = [
            { regex: /(-?\d+(?:\.\d+)?)\s*(?:plus|\+)\s*(-?\d+(?:\.\d+)?)/, op: "+" },
            { regex: /(-?\d+(?:\.\d+)?)\s*(?:minus)\s*(-?\d+(?:\.\d+)?)/, op: "-" },
            { regex: /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/, op: "-" },
            { regex: /(-?\d+(?:\.\d+)?)\s*(?:times|multiplied by|multiply by|x|\*)\s*(-?\d+(?:\.\d+)?)/, op: "*" },
            { regex: /(-?\d+(?:\.\d+)?)\s*(?:divided by|over|\/)\s*(-?\d+(?:\.\d+)?)/, op: "/" }
        ];

        for (const item of arithmetic) {
            const match = text.match(item.regex);
            if (!match) continue;

            const a = Number(match[1]);
            const b = Number(match[2]);
            let result;

            if (item.op === "+") result = a + b;
            if (item.op === "-") result = a - b;
            if (item.op === "*") result = a * b;
            if (item.op === "/") {
                if (b === 0) return "Division by zero is undefined.";
                result = a / b;
            }

            if (Number.isFinite(result)) {
                return `${a} ${item.op} ${b} = **${formatNumber(result)}**.`;
            }
        }

        return null;
    }

    function formatNumber(number) {
        return Number.isInteger(number)
            ? String(number)
            : String(Number(number.toFixed(8)));
    }

    function isLikelyPortfolioQuestion(message) {
        return /\b(jasper|portfolio|genos|g\.e\.n\.o\.s|education|school|project|skills|experience|contact|resume|cv|about you|your creator)\b/i.test(message);
    }

    function chooseResponse(message) {
        const casual = handleCasualConversation(message);
        if (casual) return { response: casual, topicId: null };

        const followUp = handleFollowUp(message);
        if (followUp) return { response: followUp, topicId: context.lastTopicId };

        const math = handleMath(message);
        if (math) return { response: math, topicId: null };

        const knowledge = queryKnowledgeBase(message);
        if (knowledge) return { response: knowledge, topicId: context.lastTopicId };

        return null;
    }

    // Keep the wrapper asynchronous because the original NYRE.js may return a
    // Promise. Awaiting also works if it returns an ordinary string.
    window.askNyre = async function (userMessage) {
        if (typeof userMessage !== "string" || !userMessage.trim()) {
            return "Your message looks empty. What would you like to ask?";
        }

        const message = userMessage.trim().slice(0, 1000);

        // Handle explicit reset before asking the original engine, so the
        // reset command cannot be swallowed by a generic portfolio fallback.
        if (/\b(reset context|clear memory|start over|forget this topic)\b/i.test(message)) {
            context.reset();
            return "Context cleared. What would you like to talk about next?";
        }

        // Prefer existing portfolio answers for portfolio-specific questions.
        // For other questions, try the enhancer first so a generic original
        // fallback cannot block a known local answer.
        if (!isLikelyPortfolioQuestion(message)) {
            const enhanced = chooseResponse(message);
            if (enhanced) {
                if (enhanced.topicId) {
                    context.remember(enhanced.topicId, message, enhanced.response);
                } else {
                    context.lastQuestion = message;
                    context.lastAnswer = enhanced.response;
                }
                return enhanced.response;
            }
        }

        let originalResponse = null;
        if (originalAskNyre) {
            try {
                originalResponse = await originalAskNyre(message);
            } catch (error) {
                console.warn("NYRE original handler failed; trying enhancer.", error);
            }
        }

        if (typeof originalResponse === "string" && originalResponse.trim() && !isOriginalFallback(originalResponse)) {
            context.remember(null, message, originalResponse);
            return originalResponse;
        }

        // If the original did not recognize the question, let the local
        // knowledge base and casual handlers try it.
        const enhanced = chooseResponse(message);
        if (enhanced) {
            if (enhanced.topicId) {
                context.remember(enhanced.topicId, message, enhanced.response);
            } else {
                context.lastQuestion = message;
                context.lastAnswer = enhanced.response;
            }
            return enhanced.response;
        }

        if (typeof originalResponse === "string" && originalResponse.trim()) {
            return originalResponse;
        }

        const fallback = "I'm not sure about that yet. I can answer questions about Jasper's portfolio and my built-in topics in science, technology, programming, and basic math. Try asking in a different way.";
        context.remember(null, message, fallback);
        return fallback;
    };

    // Optional debugging access. Does not expose or change the original engine.
    window.NYREEnhancer = {
        resetContext: () => context.reset(),
        getContext: () => ({
            lastTopicId: context.lastTopicId,
            lastQuestion: context.lastQuestion,
            lastAnswer: context.lastAnswer,
            recentTopics: [...context.recentTopics]
        }),
        topics: () => localKnowledgeBase.map(item => item.topic)
    };

    if (!originalAskNyre) {
        console.warn("NYRE_Enhancer.js loaded before NYRE.js. Load NYRE.js first, then NYRE_Enhancer.js.");
    } else {
        console.info("NYRE_Enhancer.js loaded successfully.");
    }
})();