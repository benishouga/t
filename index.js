const k = prompt("k");

const out = document.getElementById("out");

const recognizer = new webkitSpeechRecognition();
recognizer.lang = "en-US";
recognizer.addEventListener("result", async ({ results: [result] }) => {
  if (result.isFinal) {
    const [{ transcript }] = result;
    const li = document.createElement("li");
    li.style.backgroundColor = "#ddd";
    li.style.padding = "0.2em 1em";
    li.style.fontSize = "2em";
    const prev = document.createElement("p");
    const after = document.createElement("p");
    li.appendChild(prev);
    li.appendChild(after);
    out.insertBefore(li, out.firstChild);
    prev.innerText = transcript;
    const res = await fetch(
      `https://script.google.com/macros/s/AKfycbysK9hu_drkiMYjoz4UXN4ACifodCb4-s4Geo8pKgZ01LOVkfZC/exec?text=${encodeURIComponent(
        transcript
      )}&k=${k}`
    );
    const text = await res.text();
    after.innerText = text;
  }
});

recognizer.addEventListener("end", () =>
  setTimeout(() => recognizer.start(), 0)
);

recognizer.start();
