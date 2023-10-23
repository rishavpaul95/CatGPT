const chatContainer = document.getElementById("chat");
const userInput = document.getElementById("user-input");
const submitIcon = document.getElementById("submit-icon");
const chatContent = document.querySelector(".chat-content");
const scrollToBottomButton = document.querySelector("#scroll-to-bottom");

let manuallyScrolledToBottom = false;

chatContent.addEventListener("scroll", function() {
    if (chatContent.scrollTop + chatContent.clientHeight < chatContent.scrollHeight) {
        scrollToBottomButton.style.display = "block";
        manuallyScrolledToBottom = false;
    } else {
        scrollToBottomButton.style.display = manuallyScrolledToBottom ? "none" : "block";
    }
});

async function sendMessage() {
    const userMessage = userInput.value.trim();

    if (userMessage !== "") {
        // Disable the submit image
        submitIcon.classList.add("disabled");
        submitIcon.removeEventListener("click", sendMessage); // Remove the click event listener

        appendMessage("user-msg", userMessage);
        userInput.value = "";
        const generatingResponseMessage = appendMessage("bot-msg generating-response", "Generating response");

        userInput.focus(); // Keep the cursor in the user-input field during response generation

        try {
            const botResponse = await generateChatGPTResponse(userMessage);
            generatingResponseMessage.remove();
            appendMessage("bot-msg", botResponse);
        } catch (error) {
            console.error(error);
            generatingResponseMessage.textContent = "Error generating response";
        }

        // Re-enable the submit image
        submitIcon.classList.remove("disabled");
        submitIcon.addEventListener("click", sendMessage); // Add back the click event listener

        chatContent.scrollTop = chatContent.scrollHeight;
        manuallyScrolledToBottom = false;
        scrollToBottomButton.style.display = "none";
    }
}

chatContent.addEventListener("scroll", function() {
    if (chatContent.scrollTop + chatContent.clientHeight >= chatContent.scrollHeight) {
        manuallyScrolledToBottom = false;
        scrollToBottomButton.style.display = "none";
    } else {
        scrollToBottomButton.style.display = "block";
    }
});

submitIcon.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", handleKeyPress);

function handleKeyPress(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
}

function appendMessage(className, message) {
    const chatMessage = document.createElement("li");
    chatMessage.className = className;
    chatMessage.textContent = message;
    chatContainer.appendChild(chatMessage);
    checkIfAtBottom();
    return chatMessage;
}

function checkIfAtBottom() {
    if (chatContent.scrollTop + chatContent.clientHeight >= chatContent.scrollHeight) {
        manuallyScrolledToBottom = false;
        scrollToBottomButton.style.display = "none";
    }
}

async function generateChatGPTResponse(userMessage) {
    const apiUrl = 'http://127.0.0.1:5000/process_message';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_message: userMessage }),
        });

        if (response.status === 200) {
            const data = await response.json();
            const botResponse = data.bot_response;
            return botResponse;
        } else {
            throw new Error(`Server error: ${response.status}`);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

scrollToBottomButton.addEventListener("click", function() {
    chatContent.scrollTop = chatContent.scrollHeight;
    manuallyScrolledToBottom = false;
    scrollToBottomButton.style.display = "none";
});

checkIfAtBottom();

setTimeout(() => {
    scrollToBottomButton.style.display = "none";
}, 3000);