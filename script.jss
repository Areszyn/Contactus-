const BOT_TOKEN = "7375741329:AAEGlkVDknj8PTS_4HCVuw08uJpe2X3HEQg";
const CHAT_ID = "2114237158";
const BOT_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Generate Unique User ID
let userId = localStorage.getItem("userId");
if (!userId) {
    userId = `user-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("userId", userId);
}

// Prevent Multiple Submissions
function checkSubmissionStatus() {
    if (localStorage.getItem("submitted")) {
        document.getElementById("status").innerText = "You have already submitted!";
        document.getElementById("submitBtn").disabled = true;
    }
}
checkSubmissionStatus();

// Send Message to Telegram
async function sendMessage(event) {
    event.preventDefault();
    
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();

    if (!name || !email.includes("@") || !message) {
        document.getElementById("status").innerText = "Please fill in all fields correctly!";
        return;
    }

    if (localStorage.getItem("submitted")) {
        document.getElementById("status").innerText = "You have already submitted!";
        return;
    }

    let text = `📩 *New Contact Form Submission*  
👤 *Name:* ${name}  
📧 *Email:* ${email}  
📝 *Message:* ${message}  
🆔 *User ID:* ${userId}`;

    let url = `${BOT_URL}/sendMessage`;
    let data = { chat_id: CHAT_ID, text: text, parse_mode: "Markdown" };

    let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        localStorage.setItem("submitted", "true");
        document.getElementById("status").innerText = "Message sent successfully!";
        document.getElementById("submitBtn").disabled = true;
    } else {
        document.getElementById("status").innerText = "Failed to send. Try again!";
    }
}

document.getElementById("contactForm").addEventListener("submit", sendMessage);

// Fetch Bot Replies (Only for This User)
async function checkMessages() {
    let updates = await fetch(`${BOT_URL}/getUpdates`).then(res => res.json());

    if (updates.result) {
        let messages = updates.result
            .map(update => update.message?.text || update.edited_message?.text)
            .filter(text => text && text.includes(`🆔 *User ID:* ${userId}`));

        let chatBox = document.getElementById("chatBox");
        chatBox.innerHTML = messages.map(msg => `<p>${msg.replace(/🆔.*/, '')}</p>`).join("");
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
    }
}

// Refresh messages every 5 seconds
setInterval(checkMessages, 5000);
