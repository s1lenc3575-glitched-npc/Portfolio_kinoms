// ==========================================
// NYRE CONFIGURATION & STATE
// ==========================================

// Tracks the context of the conversation for follow-up questions
let nyreContext = {
    lastTopic: null,
    lastAction: null
};

// ==========================================
// TECHNICAL DEFINITIONS DICTIONARY
// ==========================================
// Handles direct "What is [term]" questions accurately.
const techDictionary = {
    // Web Technologies
    "html": "HTML (HyperText Markup Language) is the standard language used to structure web pages. Jasper uses it extensively for the frontend of his web projects.",
    "css": "CSS (Cascading Style Sheets) is used to style and layout web pages. It controls colors, fonts, and responsiveness.",
    "javascript": "JavaScript is a programming language that allows developers to implement complex, interactive features on web pages. NYRE (that's me!) runs entirely on JavaScript.",
    "js": "JS is short for JavaScript, the programming language that powers interactive web features.",
    "php": "PHP is a server-side scripting language primarily designed for web development. Jasper has used PHP for backend logic and database connections in projects like G.E.N.O.S.",
    "frontend": "Frontend refers to the part of a website or application that users interact with directly, like the UI, buttons, and layouts.",
    "backend": "Backend refers to the server-side part of an application that manages data, logic, and databases. It operates behind the scenes.",
    "responsive design": "Responsive design ensures that web pages look good and function properly on all devices, from desktop monitors to mobile phones.",
    "ui": "UI stands for User Interface. It encompasses the visual elements of a system, like buttons, menus, and typography.",
    "ux": "UX stands for User Experience. It refers to how easy and intuitive it is for a user to interact with a system or website.",
    "dom": "The DOM (Document Object Model) is a programming interface for web documents. It represents the page so that programs can change the document structure, style, and content.",
    "json": "JSON (JavaScript Object Notation) is a lightweight format for storing and transporting data, often used when data is sent from a server to a web page.",
    "http": "HTTP (Hypertext Transfer Protocol) is the foundation of data communication for the World Wide Web.",
    "localhost": "Localhost refers to the local computer that a program is running on. Developers use it to test web applications before deploying them to the internet.",
    "server": "A server is a computer or system that provides resources, data, services, or programs to other computers, known as clients, over a network.",
    "client": "In web terms, a client is typically the user's web browser, which requests data or services from a server.",
    "api": "API stands for Application Programming Interface. It allows different software applications to communicate with each other.",

    // Databases
    "mysql": "MySQL is a popular open-source relational database management system. Jasper uses it to handle information storage for his academic projects.",
    "sql": "SQL (Structured Query Language) is the standard language for managing and querying relational databases.",
    "database": "A database is an organized collection of structured information or data, typically stored electronically in a computer system.",
    "database management": "Database management involves configuring, overseeing, and ensuring the performance and security of database systems.",
    "primary key": "A primary key is a field used to uniquely identify each record in a database table. For example, a member_id uniquely identifies a gym member.",
    "foreign key": "A foreign key is a field in one table that links to the primary key of another table, creating a relationship between the two.",
    "crud": "CRUD stands for Create, Read, Update, and Delete. These are the four basic operations of persistent storage and database management.",
    "normalization": "Database normalization is the process of structuring a database to reduce data redundancy and improve data integrity.",
    "tables": "Tables are database objects that contain all the data in a database, organized in rows and columns.",
    "relationships": "In databases, relationships dictate how tables are connected to one another, such as one-to-one, one-to-many, or many-to-many.",

    // Information Systems
    "information system": "An information system is a set of components that collect, process, store, and distribute information to support decision-making and control in an organization. Jasper's G.E.N.O.S. project is an example of an information system.",
    "information management": "Information management is the collection and management of information from one or more sources and the distribution of that information to one or more audiences.",
    "system analysis": "System analysis is the process of examining a business situation to improve it through better procedures and systems.",
    "system design": "System design is the process of defining the architecture, modules, interfaces, and data for a system to satisfy specified requirements.",
    "reports": "In the context of information systems, reports are organized presentations of data (like member attendance or equipment status) used for operational support.",

    // Hardware & Embedded Systems
    "microcontroller": "A microcontroller is a compact integrated circuit designed to govern a specific operation in an embedded system. They are essentially small computers on a single chip.",
    "arduino": "Arduino is an open-source electronics platform based on easy-to-use hardware and software. Jasper uses it for embedded hardware prototyping.",
    "esp32": "The ESP32 is a low-cost, low-power system on a chip (SoC) series with Wi-Fi and dual-mode Bluetooth capabilities, widely used for IoT and embedded projects.",
    "sensor": "A sensor is a device that detects and responds to some type of input from the physical environment, like light, heat, or motion.",
    "actuator": "An actuator is a component of a machine that is responsible for moving and controlling a mechanism or system, such as opening a valve or moving a robot arm.",
    "servo motor": "A servo motor is a rotary actuator that allows for precise control of angular position, velocity, and acceleration. Jasper uses them in hardware prototypes.",
    "servo": "A servo (or servo motor) is an electronic device that can rotate or push parts of a machine with great precision.",
    "embedded system": "An embedded system is a microprocessor-based computer hardware system with software that is designed to perform a dedicated function, either as an independent system or as a part of a large system.",
    "gpio": "GPIO (General-Purpose Input/Output) pins are customizable pins on a microcontroller (like an ESP32) that can be programmed to act as either input or output.",
    "i2c": "I2C is a serial communication protocol used to attach lower-speed peripheral integrated circuits to processors and microcontrollers.",
    "spi": "SPI is a synchronous serial communication interface specification used for short-distance communication, primarily in embedded systems.",
    "serial communication": "Serial communication is the process of sending data one bit at a time, sequentially, over a communication channel or computer bus.",
    "iot": "IoT (Internet of Things) refers to the network of physical objects embedded with sensors, software, and other technologies to connect and exchange data over the internet.",
    "prototype": "A prototype is an early sample, model, or release of a product built to test a concept or process.",
    "automation": "Automation is the use of technology to perform tasks with minimal human intervention.",
    "qr code": "A QR (Quick Response) code is a type of matrix barcode that can be read by a digital device. Jasper's G.E.N.O.S. project uses them for quick member check-ins."
};

// ==========================================
// CORE INTENT KNOWLEDGE BASE
// ==========================================
// Patterns use Regular Expressions.
// Responses are arrays of variations for natural interaction.
const intents = {

    // ------------------------------------------
    // GENERAL CONVERSATION
    // ------------------------------------------
    "greeting": {
        patterns: [/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening|yo)\b/i],
        responses: [
            "Hey! I'm NYRE, Jasper's portfolio assistant. You can ask me about his education, skills, projects, or G.E.N.O.S.",
            "Hello! I am NYRE. Feel free to ask me about Jasper's academic background, technical skills, or web projects.",
            "Hi there! I'm NYRE. How can I help you explore Jasper's portfolio today?",
            "Greetings! I'm NYRE, the assistant here. Ask me anything about Jasper Kinomnga's IT background or hardware prototypes.",
            "Hello! I'm here to answer questions about Jasper's work, including his PHP, MySQL, and ESP32 projects."
        ]
    },
    "thanks": {
        patterns: [/\b(thanks|thank you|ty|appreciate it)\b/i],
        responses: [
            "You're very welcome! Let me know if there's anything else you'd like to know about Jasper's projects.",
            "No problem at all! Feel free to ask more questions if you have them.",
            "You're welcome! I'm always here to help.",
            "Anytime! Is there anything else about Jasper's portfolio you'd like to explore?"
        ]
    },
    "goodbye": {
        patterns: [/\b(bye|goodbye|see ya|cya|later|farewell)\b/i],
        responses: [
            "Goodbye! Thanks for checking out Jasper's portfolio.",
            "See you later! Have a great day.",
            "Bye! Feel free to return if you want to know more about Jasper's projects.",
            "Take care! Thanks for visiting the site."
        ]
    },
    "acknowledgment": {
        patterns: [/\b(okay|ok|cool|nice|interesting|wow|awesome|great|good to know)\b/i],
        responses: [
            "Glad you think so! Is there a specific project or skill you want to know more about?",
            "Yep! Let me know if you want to dive deeper into any of Jasper's technologies or studies.",
            "Indeed! Feel free to ask me another question.",
            "I agree! Let me know if you need more details about his web development or hardware experience."
        ]
    },
    "help": {
        patterns: [/\b(help|what can i ask|what do you know|options|menu)\b/i],
        responses: [
            "I can answer questions about Jasper Kinomnga! Try asking about his 'education', his 'skills' (like PHP or ESP32), or his main projects like 'G.E.N.O.S.'.",
            "You can ask me things like: 'Where does Jasper study?', 'What is GENOS?', 'What are his programming skills?', or ask for technical definitions like 'What is an ESP32?'."
        ]
    },
    "how_are_you": {
        patterns: [/\b(how are you|hows it going|how are things)\b/i],
        responses: [
            "I'm just a JavaScript assistant, so I'm always doing great! How can I help you with Jasper's portfolio?",
            "I'm operating perfectly! Ready to answer your questions about Jasper's IT and hardware projects."
        ]
    },

    // ------------------------------------------
    // IDENTITY
    // ------------------------------------------
    "identity_nyre": {
        patterns: [/\b(who are you|what are you|your name|nyre|about you|who is nyre|what does nyre do)\b/i],
        responses: [
            "I am NYRE (Ask NYRE), Jasper's portfolio assistant. I exist to help visitors quickly find information about his technical skills, academic projects, and background.",
            "My name is NYRE! I'm a custom JavaScript chatbot built to guide you through Jasper's portfolio and answer questions about his IT studies.",
            "I'm NYRE! I don't use any external AI or APIs; I'm completely built with local JavaScript to answer your questions about Jasper Kinomnga's projects."
        ]
    },
    "identity_jasper": {
        patterns: [/\b(who is jasper|about jasper|jasper kinomnga|who is he|who created this|whose portfolio)\b/i],
        responses: [
            "Jasper Kinomnga is an IT student with a strong interest in web development, information management, and embedded hardware systems.",
            "Jasper is a BSIT student who works on full-stack web development and hardware prototyping. He created me (NYRE) to help visitors explore his portfolio.",
            "Jasper Kinomnga is the creator of this portfolio. He focuses on building web systems using PHP/MySQL and experimenting with hardware like Arduino and ESP32."
        ]
    },

    // ------------------------------------------
    // EDUCATION
    // ------------------------------------------
    "education_general": {
        patterns: [/\b(study|studying|course|degree|college|university|school|bsit|graduat|education|program|where does he go)\b/i],
        contextTopic: "education",
        responses: [
            "Jasper is currently pursuing his Bachelor of Science in Information Technology (BSIT) at Baguio Data Center College of the Philippines.",
            "For his higher education, Jasper is taking BSIT at Baguio Data Center College of the Philippines. Before that, he attended Baguio City National Science High School.",
            "Jasper's educational background includes Pacday Quino Elementary, Joaquin Smith National High, Baguio City National Science High, and currently, a BSIT degree at Baguio Data Center College of the Philippines."
        ]
    },
    "education_elem_high": {
        patterns: [/\b(elementary|junior high|senior high|high school|pacday|joaquin|science high)\b/i],
        contextTopic: "education",
        responses: [
            "Jasper attended Pacday Quino Elementary School, followed by Joaquin Smith National High School for Junior High, and Baguio City National Science High School for Senior High.",
            "Before his current IT studies, Jasper graduated from Baguio City National Science High School (Senior High) and Joaquin Smith National High School (Junior High)."
        ]
    },

    // ------------------------------------------
    // SKILLS & TECHNOLOGIES
    // ------------------------------------------
    "skills_general": {
        patterns: [/\b(skills|know|technologies|can do|what does he do|proficient|experience with)\b/i],
        contextTopic: "skills",
        responses: [
            "Jasper's technical skills cover web development (HTML, CSS, JS, PHP, MySQL) and embedded hardware prototyping (Arduino, ESP32, sensors, servos). He also studies database design and system analysis.",
            "Jasper works across software and hardware. He builds web interfaces and backend databases using PHP and SQL, and creates embedded prototypes using Arduino and ESP32 microcontrollers.",
            "His academic and hands-on skills include Information Management, Database Design, UI development, and embedded systems hardware troubleshooting."
        ]
    },
    "skills_web": {
        patterns: [/\b(web|web development|frontend|backend|websites|web apps)\b/i],
        contextTopic: "skills",
        responses: [
            "In web development, Jasper works with HTML, CSS, and JavaScript for frontend interfaces, and uses PHP and MySQL for backend server logic and databases.",
            "Jasper handles both frontend and backend development in his academic projects, utilizing HTML/CSS/JS for the UI and PHP/SQL for data management."
        ]
    },
    "skills_db": {
        patterns: [/\b(database|databases|sql|mysql|tables|crud|normalization)\b/i],
        contextTopic: "database",
        responses: [
            "Jasper has academic experience in Database Design and Information Management. He uses MySQL and SQL to structure relationships, tables, and handle CRUD operations for systems like G.E.N.O.S.",
            "For databases, Jasper is skilled in system analysis, normalization, and managing relational data using MySQL. He applies this to track users, schedules, and operations in his web systems."
        ]
    },
    "skills_hardware": {
        patterns: [/\b(hardware|arduino|esp32|sensor|sensors|embedded|motor|camera|cameras|display|displays|microcontroller|robotics|prototypes)\b/i],
        contextTopic: "hardware",
        responses: [
            "Jasper does hands-on academic work with embedded systems. He prototypes with ESP32 and Arduino boards, integrating sensors, displays, cameras, servos, and audio components.",
            "In the hardware space, Jasper focuses on embedded-system prototyping. He experiments with microcontrollers (ESP32, Arduino) and various hardware modules to build functional experimental setups.",
            "His hardware troubleshooting skills involve wiring, testing, and coding embedded prototypes using GPIO pins, I2C devices, and sensors on platforms like Arduino."
        ]
    },

    // ------------------------------------------
    // PROJECTS & G.E.N.O.S.
    // ------------------------------------------
    "projects_general": {
        patterns: [/\b(projects|portfolio|what projects are here|what has he made|showcase)\b/i],
        contextTopic: "projects",
        responses: [
            "Jasper's portfolio showcases a mix of information web systems and hardware prototypes. His flagship academic project is G.E.N.O.S. (a gym operations system), alongside experimental Arduino/ESP32 work.",
            "You can explore projects ranging from database-driven web systems (like G.E.N.O.S. for GOALS Gym) to embedded electronics prototyping. Do you want to hear about the web systems or the hardware?"
        ]
    },
    "genos_general": {
        patterns: [/\b(genos|g\.e\.n\.o\.s|gym|goals gym|gym system|gym project|gym operations|gym management)\b/i],
        contextTopic: "genos",
        responses: [
            "G.E.N.O.S. (Gym Enhancement through Networked Operations System) is an academic case study for GOALS Gym. It focuses on organizing gym information, membership tracking, and operational support.",
            "G.E.N.O.S. is a comprehensive information management proposal for GOALS Gym. It features QR-based check-ins, membership expiration tracking, and class/coach scheduling.",
            "Jasper worked on G.E.N.O.S. to manage gym operations. It uses web technologies and databases to track equipment maintenance, member attendance, and generate operational reports."
        ]
    },
    "genos_features": {
        patterns: [/\b(genos features|what does genos do|gym features|qr|check-in|attendance|scheduling)\b/i],
        contextTopic: "genos",
        responses: [
            "G.E.N.O.S. features include QR-based member identification, automated check-in/check-out, trainer scheduling, class tracking, and equipment maintenance logs.",
            "The system is designed to handle membership information, track expiration dates, manage coach schedules, and provide structured reports for gym management."
        ]
    }
};

// ==========================================
// CONTEXT FOLLOW-UPS
// ==========================================
// Handled when the user says "tell me more" or "what technologies does it use"
const contextFollowUps = {
    "genos": {
        patterns: [/\b(tell me more|technologies|how does it work|more about it)\b/i],
        response: "G.E.N.O.S. uses web technologies and database management (like PHP and MySQL) to securely store member data and track gym operations in real-time."
    },
    "hardware": {
        patterns: [/\b(tell me more|what kind|examples|more about it)\b/i],
        response: "His hardware projects usually involve coding C++ on Arduino IDE to control servos, read sensor data, or display information on LCD/OLED screens."
    },
    "skills": {
        patterns: [/\b(tell me more|examples)\b/i],
        response: "Jasper applies his skills by building full-stack web applications and wiring up microcontroller circuits for his IT coursework."
    }
};

// ==========================================
// DYNAMIC HANDLERS (Time, Date, Math)
// ==========================================

function handleDynamicRequests(message) {
    const text = message.toLowerCase();

    // Time Check
    if (/\b(what time is it|current time|time right now)\b/.test(text)) {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `The current local time on your device is ${hours}:${minutes} ${ampm}.`;
    }

    // Date Check
    if (/\b(what is the date|what date is it|what day is it today|current date)\b/.test(text)) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return `Today is ${now.toLocaleDateString(undefined, options)} based on your device settings.`;
    }
    
    // Year Check
    if (/\b(what year is it|current year)\b/.test(text)) {
        return `It is currently the year ${new Date().getFullYear()}.`;
    }
    
    // Month Check
    if (/\b(what month is it|current month)\b/.test(text)) {
        const month = new Date().toLocaleString('default', { month: 'long' });
        return `We are currently in the month of ${month}.`;
    }

    // Math: Percentages (e.g., "What is 25% of 200?")
    const percentMatch = text.match(/(?:what is|calculate)\s*(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)/i);
    if (percentMatch) {
        const percent = parseFloat(percentMatch[1]);
        const value = parseFloat(percentMatch[2]);
        const result = (percent / 100) * value;
        return `${percent}% of ${value} is ${result}.`;
    }

    // Math: Basic Arithmetic
    // Matches: "what is 5 + 5", "calculate 10 * 2", "100 divided by 4", "50 minus 10"
    const mathMatch = text.match(/(?:what is|calculate)?\s*(\d+(?:\.\d+)?)\s*([\+\-\*\/]|plus|minus|times|multiplied by|divided by)\s*(\d+(?:\.\d+)?)/i);
    if (mathMatch) {
        const num1 = parseFloat(mathMatch[1]);
        const operatorStr = mathMatch[2].trim().toLowerCase();
        const num2 = parseFloat(mathMatch[3]);
        let result = null;
        let opSymbol = "";

        if (operatorStr === '+' || operatorStr === 'plus') { result = num1 + num2; opSymbol = "+"; }
        else if (operatorStr === '-' || operatorStr === 'minus') { result = num1 - num2; opSymbol = "-"; }
        else if (operatorStr === '*' || operatorStr === 'times' || operatorStr === 'multiplied by') { result = num1 * num2; opSymbol = "*"; }
        else if (operatorStr === '/' || operatorStr === 'divided by') { 
            if(num2 === 0) return "I can't divide by zero!";
            result = num1 / num2; 
            opSymbol = "/"; 
        }

        if (result !== null) {
            // Round to 4 decimal places max to avoid floating point weirdness
            result = Math.round(result * 10000) / 10000;
            return `${num1} ${opSymbol} ${num2} equals ${result}.`;
        }
    }

    return null;
}

// ==========================================
// FALLBACK RESPONSES
// ==========================================
const fallbacks = [
    "I don't have that information in Jasper's portfolio yet. You can ask me about his education, skills, projects, G.E.N.O.S., or ESP32 work.",
    "I'm not quite sure about that. I primarily have information on Jasper's academic background and IT skills. Would you like to know about his hardware prototyping or web development?",
    "That isn't explicitly covered in my portfolio knowledge base. Feel free to ask me about his BSIT course, his skills with PHP and Arduino, or his gym system project.",
    "I'm sorry, I don't have that detail. I'm programmed strictly to avoid inventing information! Ask me about G.E.N.O.S. or Jasper's web programming skills instead."
];

// ==========================================
// MAIN PROCESSING FUNCTION
// ==========================================

/**
 * Main function exposed to the global window object.
 * Called by portfolio.html when a user sends a message.
 */
window.askNyre = async function(userMessage) {
    // Simulate natural typing delay (between 600ms and 1200ms)
    const delay = Math.floor(Math.random() * 600) + 600; 
    
    return new Promise((resolve) => {
        setTimeout(() => {
            const response = generateNyreResponse(userMessage);
            resolve(response);
        }, delay);
    });
};

/**
 * Internal logic to parse intents, dictionary, math, and context.
 */
function generateNyreResponse(message) {
    const msg = message.toLowerCase().trim();
    
    // 1. Check for Math / Date / Time calculations first
    const dynamicResponse = handleDynamicRequests(msg);
    if (dynamicResponse) {
        // We don't change context for utility questions
        return dynamicResponse;
    }

    // 2. Check for Dictionary / Definition questions
    // e.g. "what is html", "define esp32", "what does crud mean"
    const defMatch = msg.match(/(?:what is|what are|define|what does)\s+(?:a|an)?\s*([a-z0-9\s\.\-]+?)(?:\s+mean)?\s*\??$/i);
    if (defMatch) {
        // Clean up the captured term (remove punctuation)
        const term = defMatch[1].replace(/[^\w\s\.]/g, '').trim();
        
        if (techDictionary[term]) {
            return techDictionary[term];
        } else if (techDictionary[term.replace(/\s+/g, '')]) { // Try without spaces (e.g. 'servomotor' vs 'servo motor')
            return techDictionary[term.replace(/\s+/g, '')];
        }
        // If it looks like a definition but we don't have it, we let it fall through to Intent logic.
    }

    // 3. Check for Context Follow-ups based on the last conversation topic
    if (nyreContext.lastTopic && contextFollowUps[nyreContext.lastTopic]) {
        const followUpLogic = contextFollowUps[nyreContext.lastTopic];
        for (let pattern of followUpLogic.patterns) {
            if (pattern.test(msg)) {
                return followUpLogic.response;
            }
        }
    }

    // 4. Check Core Intents
    let matchedIntentKey = null;

    for (const [key, data] of Object.entries(intents)) {
        for (const pattern of data.patterns) {
            if (pattern.test(msg)) {
                matchedIntentKey = key;
                break;
            }
        }
        if (matchedIntentKey) break;
    }

    if (matchedIntentKey) {
        const intentData = intents[matchedIntentKey];
        
        // Update context if this intent sets one
        if (intentData.contextTopic) {
            nyreContext.lastTopic = intentData.contextTopic;
        }

        // Return a random variation from the matched intent array
        const randomIndex = Math.floor(Math.random() * intentData.responses.length);
        return intentData.responses[randomIndex];
    }

    // 5. Check if they are just typing single words that exist in the dictionary as a fallback
    // (e.g. User types "arduino" instead of "what is arduino")
    const cleanMsg = msg.replace(/[^\w\s\.]/g, '').trim();
    if (techDictionary[cleanMsg]) {
        return techDictionary[cleanMsg];
    }

    // 6. Unknown Question Fallback
    // Do not update context so they can still follow up on the previous topic if they rephrase
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}