import * as THREE from "three";

import { EventEmitter } from "events";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import Experience from "../Experience.js";

export default class Resources extends EventEmitter {
    constructor(assets) {
        super();
        this.experience = new Experience();
        this.renderer = this.experience.renderer;

        this.assets = assets;

        this.items = {};
        this.queue = this.assets.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }

    setLoaders() {
        this.loaders = {};
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.dracoLoader = new DRACOLoader();
        this.loaders.dracoLoader.setDecoderPath("/draco/");
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
    }

    createMonitorScreenTexture() {
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        texture.colorSpace = THREE.SRGBColorSpace;

        let frame = 0;
        const renderScreen = () => {
            frame++;
            const bg = ctx.createLinearGradient(0, 0, 1024, 512);
            bg.addColorStop(0, "#0b1120");
            bg.addColorStop(0.5, "#111827");
            bg.addColorStop(1, "#1e1b4b");
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, 1024, 512);

            ctx.fillStyle = "#1e293b";
            ctx.fillRect(28, 24, 968, 46);
            ctx.fillStyle = "#ef4444";
            ctx.beginPath();
            ctx.arc(56, 47, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#f59e0b";
            ctx.beginPath();
            ctx.arc(82, 47, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#10b981";
            ctx.beginPath();
            ctx.arc(108, 47, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#94a3b8";
            ctx.font = "bold 20px monospace";
            ctx.fillText("saami@operations-workstation: ~/portfolio-systems", 140, 54);

            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 2;
            ctx.strokeRect(44, 92, 450, 380);

            ctx.fillStyle = "#38bdf8";
            ctx.font = "bold 26px sans-serif";
            ctx.fillText("ABDULLAH SAAMI", 68, 136);

            ctx.fillStyle = "#f472b6";
            ctx.font = "bold 18px monospace";
            ctx.fillText("OPERATIONS & FULL STACK DEV", 68, 168);

            const lines = [
                "> Team VoltEdge 007 (IIT Bombay)",
                "> SplitPayMe App (Google Play)",
                "> II PUC: 526/600 (87.67% | CS 99)",
                "> SSLC: 579/625 (92.64% | A+)",
                "> Student Council President 25-26",
                "> Assistant Head Boy 23-24",
            ];
            ctx.fillStyle = "#e2e8f0";
            ctx.font = "18px monospace";
            lines.forEach((line, idx) => {
                ctx.fillText(line, 68, 214 + idx * 36);
            });

            if (Math.floor(frame / 15) % 2 === 0) {
                ctx.fillStyle = "#34d399";
                ctx.fillText("> status: READY_FOR_EXECUTION _", 68, 444);
            } else {
                ctx.fillStyle = "#34d399";
                ctx.fillText("> status: READY_FOR_EXECUTION", 68, 444);
            }

            ctx.strokeStyle = "#818cf8";
            ctx.lineWidth = 2;
            ctx.strokeRect(520, 92, 460, 380);

            ctx.fillStyle = "#a5b4fc";
            ctx.font = "bold 20px monospace";
            ctx.fillText("WORKFLOW & TELEMETRY", 546, 132);

            const barCount = 14;
            for (let i = 0; i < barCount; i++) {
                const wave =
                    Math.sin(frame * 0.08 + i * 0.55) * 0.4 +
                    Math.cos(frame * 0.05 - i * 0.3) * 0.3 +
                    0.5;
                const barH = Math.max(24, Math.min(220, wave * 200));
                const bx = 548 + i * 29;
                const by = 390 - barH;

                const barGrad = ctx.createLinearGradient(0, by, 0, 390);
                barGrad.addColorStop(0, "#38bdf8");
                barGrad.addColorStop(1, "#ec4899");
                ctx.fillStyle = barGrad;
                ctx.fillRect(bx, by, 20, barH);
            }

            ctx.fillStyle = "#94a3b8";
            ctx.font = "16px monospace";
            ctx.fillText("PROCESS EFFICIENCY: 99.0% | ACTIVE", 548, 438);

            texture.needsUpdate = true;
        };

        renderScreen();
        this.screenInterval = setInterval(renderScreen, 60);
        return texture;
    }

    startLoading() {
        for (const asset of this.assets) {
            if (asset.type === "glbModel") {
                this.loaders.gltfLoader.load(asset.path, (file) => {
                    this.singleAssetLoaded(asset, file);
                });
            } else if (asset.type === "canvasScreen") {
                const screenTexture = this.createMonitorScreenTexture();
                this.singleAssetLoaded(asset, screenTexture);
            }
        }
    }

    singleAssetLoaded(asset, file) {
        this.items[asset.name] = file;
        this.loaded++;

        if (this.loaded === this.queue) {
            this.emit("ready");
        }
    }

    destroy() {
        if (this.screenInterval) {
            clearInterval(this.screenInterval);
        }
    }
}
