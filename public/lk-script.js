const chatBtns = document.querySelectorAll(".lk-chat-toggle");
const chatOpen = false;

console.log("Loaded");
console.log(chatBtns);

chatBtns.forEach((chatBtn) =>
  chatBtn.addEventListener("click", () => {
    const chatBox = document.querySelector(".lk-chat");
    console.log(chatBox);
    if (chatBox) {
      chatOpen = true;
      chatBox.classList.toggle("open");
    }
  })
);
