class SimpleEmitter {
  constructor() {
    this._map = {};
  }
  _set(name) {
    return (this._map[name] = this._map[name] || new Set());
  }
  addEventListener(name, handler) {
    this._set(name).add(handler);
  }
  removeEventListener(name, handler) {
    this._set(name).delete(handler);
  }
  emit(name, ...args) {
    this._set(name).forEach(handler => handler(...args));
  }
}

const SCRIPT =
  "Paton Bridge is one of the bridges across the Dnieper in Kiev, Ukraine named after its constructor Evgeny Paton. Built between 1941 and 1953, it is the world's first all-welded bridge and is also the longest bridge in Kiev having a length of 1,543 metres. Traffic across the bridge was opened on 5 November 1953. The bridge also acts as a segment of the Lesser Ring Road of Kiev.";
class AroundVoices extends SimpleEmitter {
  constructor() {
    super();
    setInterval(() => this.voice(), 300);
    this.source = SCRIPT.replace(/\./g, " ").split(" ");
    this.index = 0;
  }
  voice() {
    const current = this.source[this.index++];
    if (this.source.length <= this.index) {
      this.index = 0;
    }
    if (current) {
      this.emit("script", current);
    }
  }
}

class Mock extends SimpleEmitter {
  constructor() {
    super();
    this._vadTimeoutId = null;
    this._transcript = [];
    this._result = [];
    this._isInserted = false;
    this._results = [];
    this._isActive = false;
    const voices = new AroundVoices();
    voices.addEventListener("script", text => this._voice(text));
    this.continuous = false;
    this.interimResults = false;
  }
  _voice(text) {
    if (!this._isActive) {
      return;
    }

    this._transcript.push(text);
    if (this._vadTimeoutId !== null) {
      clearTimeout(this._vadTimeoutId);
    }
    this._vadTimeoutId = setTimeout(() => {
      this._vadTimeoutId = null;
      this.emitResult(true);
    }, 500);

    if (this.interimResults) {
      this.emitResult(false);
    }
  }

  emitResult(isFinal) {
    this._result[0] = { transcript: this._transcript.join(" ") };
    this._result.isFinal = isFinal;
    if (!this._isInserted) {
      this._results.push(this._result);
    }
    this.emit("result", { results: this._results });

    if (isFinal) {
      this._transcript = [];
      this._result = [];
      this._isInserted = false;

      if (!this.continuous) {
        this.stop();
      }
    }
  }

  start() {
    this._isActive = true;
    this._results = [];
  }
  stop() {
    this._isActive = false;
    if (this._vadTimeoutId) {
      clearTimeout(this._vadTimeoutId);
    }
    this.emit("end");
  }
}
window.webkitSpeechRecognition = Mock;
