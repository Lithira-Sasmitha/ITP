import { useEffect } from "react";
const ChatBox = () => {

  useEffect(() => {
    // Configure the embedded chatbot
    window.embeddedChatbotConfig = {
      chatbotId: "mnZLxPo0KnJniofI8O85Z",
      domain: "www.chatbase.co",
    };

    // Dynamically load the chatbot script after the component mounts
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.setAttribute("chatbotId", "mnZLxPo0KnJniofI8O85Z");
    script.setAttribute("domain", "www.chatbase.co");
    script.defer = true; // Use defer to load the script after the document has been parsed

    document.body.appendChild(script);

    // Clean up the script tag on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

};

export default ChatBox;
