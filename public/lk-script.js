const chatBtns = document.querySelectorAll(".lk-chat-toggle");
let chatOpen = false;

chatBtns.forEach((chatBtn) =>
  chatBtn.addEventListener("click", () => {
    const chatBox = document.querySelector(".lk-chat");

    if (chatBox) {
      chatOpen = true;
      chatBox.classList.toggle("open");
    }
  })
);
