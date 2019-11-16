const k = prompt("k");

const out = document.getElementById("out");

const recognizer = new webkitSpeechRecognition();

recognizer.lang = "en-US";
recognizer.continuous = true;
recognizer.interimResults = true;

const startSession = () => {
  console.log("startSession");
  const startTransaction = (index = 0) => {
    console.log("startTransaction", index);
    const li = document.createElement("li");
    const sourceElement = document.createElement("p");
    const resultElement = document.createElement("p");
    li.appendChild(sourceElement);
    li.appendChild(resultElement);
    out.insertBefore(li, out.firstChild);

    const onResultHandler = async ({ results }) => {
      console.log("onResultHandler", index);
      const result = results[results.length - 1];
      const [{ transcript }] = result;
      if (result.isFinal) {
        console.log("onResultHandler isFinal", index);
        recognizer.removeEventListener("result", onResultHandler);
        if (recognizer.continuous) {
          console.log("onResultHandler continuous", index);
          setTimeout(() => startTransaction(index + 1), 0);
        }
      }

      sourceElement.textContent = transcript;
      const res = await fetch(
        `https://script.google.com/macros/s/AKfycbysK9hu_drkiMYjoz4UXN4ACifodCb4-s4Geo8pKgZ01LOVkfZC/exec?t=${encodeURIComponent(
          transcript
        )}&k=${k}`
      );
      const text = await res.text();
      // const text = await new Promise(resolve =>
      //   setTimeout(() => resolve(`${transcript}の翻訳結果`), 800)
      // );
      resultElement.textContent = text;
    };

    recognizer.addEventListener("result", onResultHandler);
  };

  const onEndHandler = () => {
    console.log("session onEndHandler");
    recognizer.removeEventListener("end", onEndHandler);
    setTimeout(() => startSession(), 0);
  };

  recognizer.addEventListener("end", onEndHandler);
  recognizer.start();
  startTransaction();
};

startSession();
