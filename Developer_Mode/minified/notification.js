const DEFAULT_OPTIONS = {
  autoClose: 3000,
  position: "top-right",
  onClose: () => {},
  canClose: true,
  showProgress: true,
};

export default class notification {
  #notificationElement;
  #autoCloseInterval;
  #progressInterval;
  #removeBinded;
  #timeVisible = 0;
  #autoClose;
  #isPaused = false;
  #unpause;
  #pause;
  #visibilityChange;
  #shouldUnPause;

  constructor(options) {
    this.#notificationElement = document.createElement("div");
    this.#notificationElement.classList.add("lp-no0cx");
    requestAnimationFrame(() => {
      this.#notificationElement.classList.add("show");
    });
    this.#removeBinded = this.remove.bind(this);
    this.#unpause = () => (this.#isPaused = false);
    this.#pause = () => (this.#isPaused = true);
    this.#visibilityChange = () => {
      this.#shouldUnPause = document.visibilityState === "visible";
    };
    this.update({ ...DEFAULT_OPTIONS, ...options });
  }

  set autoClose(value) {
    this.#autoClose = value;
    this.#timeVisible = 0;
    if (value === false) return;

    let lastTime;
    const func = (time) => {
      if (this.#shouldUnPause) {
        lastTime = null;
        this.#shouldUnPause = false;
      }
      if (lastTime == null) {
        lastTime = time;
        this.#autoCloseInterval = requestAnimationFrame(func);
        return;
      }
      if (!this.#isPaused) {
        this.#timeVisible += time - lastTime;
        if (this.#timeVisible >= this.#autoClose) {
          this.remove();
          return;
        }
      }

      lastTime = time;
      this.#autoCloseInterval = requestAnimationFrame(func);
    };

    this.#autoCloseInterval = requestAnimationFrame(func);
  }

  set position(value) {
    const currentContainer = this.#notificationElement.parentElement;
    const selector = `.lp-no0cx-container[data-position="${value}"]`;
    const container =
      document.querySelector(selector) || createContainer(value);
    container.append(this.#notificationElement);
    if (currentContainer == null || currentContainer.hasChildNodes()) return;
    currentContainer.remove();
  }

  set text(value) {
    this.#notificationElement.innerHTML = `<p class="root-p">${value}</p>

    <button class="lp-btn7 lp-btn7-g lp-scv32" style="margin-top: 9px;" data-toggle="modal" data-target="#edit_cards_modal">Edit</button>`;
  }

  set canClose(value) {
    this.#notificationElement.classList.toggle("can-close", value);
    if (value) {
      this.#notificationElement.addEventListener("click", this.#removeBinded);
    } else {
      this.#notificationElement.removeEventListener(
        "click",
        this.#removeBinded
      );
    }
  }

  set showProgress(value) {
    this.#notificationElement.classList.toggle("progs", value);
    this.#notificationElement.style.setProperty("--progs", 1);

    if (value) {
      const func = () => {
        if (!this.#isPaused) {
          this.#notificationElement.style.setProperty(
            "--progs",
            1 - this.#timeVisible / this.#autoClose
          );
        }
        this.#progressInterval = requestAnimationFrame(func);
      };

      this.#progressInterval = requestAnimationFrame(func);
    }
  }

  set pauseOnHover(value) {
    if (value) {
      this.#notificationElement.addEventListener("mouseover", this.#pause);
      this.#notificationElement.addEventListener("mouseleave", this.#unpause);
    } else {
      this.#notificationElement.removeEventListener("mouseover", this.#pause);
      this.#notificationElement.removeEventListener(
        "mouseleave",
        this.#unpause
      );
    }
  }

  set pauseOnFocusLoss(value) {
    if (value) {
      document.addEventListener("visibilitychange", this.#visibilityChange);
    } else {
      document.removeEventListener("visibilitychange", this.#visibilityChange);
    }
  }

  update(options) {
    Object.entries(options).forEach(([key, value]) => {
      this[key] = value;
    });
  }

  remove() {
    cancelAnimationFrame(this.#autoCloseInterval);
    cancelAnimationFrame(this.#progressInterval);
    const container = this.#notificationElement.parentElement;
    this.#notificationElement.classList.remove("show");
    this.#notificationElement.addEventListener("transitionend", () => {
      this.#notificationElement.remove();
      if (container.hasChildNodes()) return;
      container.remove();
    });
    this.onClose();
  }
}

function createContainer(position) {
  const container = document.createElement("div");
  container.classList.add("lp-no0cx-container");
  container.dataset.position = position;
  document.body.append(container);
  return container;
}
