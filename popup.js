function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(sec => sec.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.getElementById(`tab-${tab}`).classList.add('active');
}
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

function getContent(callback) {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'getContent'}, res => {
      callback(res?.content || '');
    });
  });
}

// Summarize
document.getElementById('summarize-btn').onclick = () => {
  getContent(content => {
    document.getElementById('summary-result').textContent = "Summarizing...";
    chrome.runtime.sendMessage({type: "summarize", content}, res => {
      document.getElementById('summary-result').textContent = res.summary;
    });
  });
};

// Flashcards
document.getElementById('flashcards-btn').onclick = () => {
  getContent(content => {
    document.getElementById('flashcards-result').textContent = "Generating...";
    chrome.runtime.sendMessage({type: "flashcards", content}, res => {
      document.getElementById('flashcards-result').textContent = res.flashcards;
    });
  });
};

// Q&A
document.getElementById('qa-btn').onclick = () => {
  getContent(content => {
    let question = document.getElementById('qa-question').value;
    if (!question) return;
    document.getElementById('qa-result').textContent = "Thinking...";
    chrome.runtime.sendMessage({type: "qa", content, question}, res => {
      document.getElementById('qa-result').textContent = res.answer;
    });
  });
};

// Distraction Blocker
document.getElementById('block-btn').onclick = () => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'blockDistractions'}, res => {
      document.getElementById('block-result').textContent = "Distractions blocked!";
    });
  });
};

// Floating Widget
document.getElementById('widget-btn').onclick = () => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {action: 'toggleWidget'}, res => {
      document.getElementById('widget-result').textContent = "Overlay widget shown!";
    });
  });
};