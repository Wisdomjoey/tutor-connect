const chatBtn = document.querySelector(".lk-chat-toggle");
const chatOpen = false;

console.log("Loaded");
console.log(chatBtn);

if (chatBtn) {
  chatBtn.addEventListener("click", () => {
    const chatBox = document.querySelector(".lk-list.lk-chat-messages");
    console.log(chatBox);
    if (chatBox) {
      chatOpen = true;
      chatBox.classList.toggle("open");
    }
  });
}
