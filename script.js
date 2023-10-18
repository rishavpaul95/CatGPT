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


function sendMessage() {
    const userMessage = userInput.value.trim();

    if (userMessage !== "") {
        // Only disable the submit image
        submitIcon.classList.add("disabled");
        submitIcon.removeEventListener("click", sendMessage); // Remove the click event listener

        appendMessage("user-msg", userMessage);
        userInput.value = "";
        const generatingResponseMessage = appendMessage("bot-msg generating-response", "Generating response");

        userInput.focus(); // Keep the cursor in the user-input field during response generation

        setTimeout(function() {
            generatingResponseMessage.remove();
            const botResponse = generateMeows(userMessage.length);
            appendMessage("bot-msg", botResponse);

            // Re-enable the submit image
            submitIcon.classList.remove("disabled");
            submitIcon.addEventListener("click", sendMessage); // Add back the click event listener

            chatContent.scrollTop = chatContent.scrollHeight;
            manuallyScrolledToBottom = false;
            scrollToBottomButton.style.display = "none";
        }, 3000);
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


function handleKeyPress(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
}

userInput.addEventListener("keypress", handleKeyPress);


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


function generateMeows(length) {
    if (length <= 6) {
        return "Meow";
    }

    const words = "Meow".split(" ");
    const numMeows = Math.floor(Math.random() * (length - words.length) + 2); // Minimum of 2 meows

    const meowArray = [];
    for (let i = 0; i < numMeows; i++) {
        if (i === 0) {
            meowArray.push("Meow " + words.slice(1).join(" "));
        } else {
            meowArray.push("meow");
        }
    }

    return meowArray.join(" ");
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