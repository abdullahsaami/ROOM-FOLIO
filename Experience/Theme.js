import { EventEmitter } from "events";

export default class Theme extends EventEmitter {
    constructor() {
        super();

        this.theme = "light";

        this.toggleButton = document.querySelector(".boko-app-container .toggle-button");
        this.toggleCircle = document.querySelector(".boko-app-container .toggle-circle");
        this.container = document.querySelector(".boko-app-container");

        this.setEventListeners();
    }

    setEventListeners() {
        if (!this.toggleButton) return;
        this.handleClick = () => {
            if (this.toggleCircle) {
                this.toggleCircle.classList.toggle("slide");
            }
            this.theme = this.theme === "light" ? "dark" : "light";
            if (this.container) {
                this.container.classList.toggle("dark-theme");
                this.container.classList.toggle("light-theme");
            }

            this.emit("switch", this.theme);
        };
        this.toggleButton.addEventListener("click", this.handleClick);
    }
}
