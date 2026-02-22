<template>
  <header class="no-print">
    <h1>PayNow QR Code Generator</h1>
  </header>

  <main>
    <div class="page">
      <div class="input-fields">
        <div class="no-print">
          This page generates a QR for your phone number, or for your UEN. Print it out and
          paste it wherever you run a hawker stall, pasar malam stall, or a garage sale!
        </div>

        <div class="field no-print">
          <h4>PayNow destination type</h4>
          <div>
            <label>
              <input type="radio" :checked="mode === 'phone'" @click="mode = 'phone'" />
              Phone number
            </label>
          </div>

          <div>
            <label>
              <input type="radio" :checked="mode === 'uen'" @click="mode = 'uen'" />
              UEN
            </label>
          </div>
        </div>

        <div class="field no-print">
          <label for="phone">
            <h4>{{ mode === "phone" ? "Phone" : "UEN" }}</h4>
          </label>
          <input
            type="tel"
            v-if="mode === 'phone'"
            id="phone"
            :value="target"
            @input="event => target = (event.target as any).value"
            maxlength="20"
          />
          <input
            type="text"
            v-else
            id="phone"
            :value="target"
            @input="event => target = (event.target as any).value"
            maxlength="20"
          />
        </div>

        <div class="field no-print">
          <label for="reference">
            <h4>Transaction Reference (Optional) (Max length: 35 Characters)</h4>
          </label>
          <input
            type="text"
            id="reference"
            :value="reference"
            @input="event => reference = (event.target as any).value"
            maxlength="35"
          />
        </div>

        <div class="field no-print">
        <label for="receipientName">
          <h4>Receipient Name (Optional)</h4>
        </label>
        <input
          type="text"
          id="receipientName"
          :value="receipientName"
          @input="event => receipientName = (event.target as any).value"
          maxlength="24"
        />
        </div>

        <div class="field no-print">
          <h4>Background style</h4>

          <select v-model="selectedBackgroundId">
            <option
              v-for="bg in BACKGROUNDS"
              :key="bg.id"
              :value="bg.id"
            >
              {{ bg.label }}
            </option>
          </select>
        </div>

      </div>

      <div class="preview">
        <div class="paynow-card">
        <img
          v-if="selectedBackground.src"
          :src="selectedBackground.src"
          class="background"
        />

        <div
          v-else
          class="background background--none"
        ></div>
        <div class="overlay">
          <div class="recipient-name">
            {{ qrCodeReceipientName }}
          </div>

          <img src="./assets/paynow-logo-2-01.png" ref="logoRef" class="logo" />

          <img :src="qrcodeDataURL" class="generated-QR" />

          <canvas ref="canvasRef" :width="imageWidth" :height="imageWidth" style="display: none"></canvas>
            
          <div class="paynow-identifier">
            {{ qrcodeDataTarget.replace(/^\+65/, "") }}
          </div>
        </div>
      </div>
      </div>
    </div>

        <div class="export-options">
          <button class="no-print" @click="downloadPNG">
            Download PNG (Recommended)
          </button>
          <button class="no-print" @click="print">
            Print (PDF)
          </button>
        </div>


  </main>

  <footer class="no-print">
    <h2>References</h2>
    <ol>
      <li>
        <a
          href="https://www.emvco.com/specifications/emv-qr-code-specification-for-payment-systems-emv-qrcps-merchant-presented-mode/"
          >EMV® QR Code Specification for Payment Systems (EMV® QRCPS) Merchant-Presented
          Mode</a
        >
      </li>
      <li>
        <a href="https://www.fullstacksys.com/paynow-qr-code-generator">
          Fullstacksys.com Paynow QR Code Generator
        </a>
        - this website generates QR codes with suggested amounts, but not static codes.
      </li>
      <li>Singapore QR Codes for Payments ("SGQR") Specifications v1.7</li>
    </ol>
  </footer>
</template>

<style scoped>
@media print {
  .no-print {
    display: none;
    margin: 0;
  }

  .paynow-card {
    margin: 0 auto;
  }
}

@media screen {
  .generated-QR {
    max-width: 500px;
    max-height: 500px;
  }

  header,
  main,
  footer {
    max-width: 520px;
    display: block;
    margin: auto;
  }
}

/* Mobile: stack */
@media (max-width: 768px) {
  .page {
    flex-direction: column;
    gap: 1rem;
  }

  .input-fields {
    border-right: none;
    padding-right: 0;
  }

  .preview {
    padding-left: 0;
    width: 100%;
    display: flex;
    justify-content: center; 
  }

  .paynow-card {
    max-width: 100%; /* allow it to expand fully */
  }
}

h4 {
  margin-top: 1em;
  margin-bottom: 0;
}

input[type="radio"] {
  margin: 0.8em 0;
}

input[type="text"],
input[type="tel"] {
  padding: 0.3em;
  line-height: 1.5;
  width: 100%;
  box-sizing: border-box;
}

.logo {
  display: none;
}

.export-options {
  display: flex;
  justify-content: center; /* keep QR card centered */
  position: relative;
  gap: 10px;
  flex-wrap: wrap; 
}

.input-fields {
  flex: 1 1 300px;   /* grow/shrink, min width 300px */
  max-width: 400px;
}

.export-options {
  margin-top: 2rem;
}

/* Preview should stay at natural height */
.preview {
  flex: 1 1 300px;
  display: flex;
  justify-content: center; /* keep QR card centered */
}

.page {
  display: flex;
  gap: 6rem;         /* space between columns */
  flex-wrap: wrap;    /* allows items to move to next line on small screens */
}

.paynow-card {
  position: relative;
  width: 100%;
  max-width: 520px; /* desktop max */
  margin-bottom: 2.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-radius: 0px;
  overflow: hidden;
}

.recipient-name {
  position: absolute;
  top: 16%;              /* sits above QR */
  width: 100%;
  text-align: center;
  font-size: 2em;     /* smaller, cleaner */
  font-weight: 600;
  letter-spacing: 0.3px;
}

.background {
  width: 100%;
  display: block;
}

.background--none {
  width: 100%;
  aspect-ratio: 520 / 330;
  background: #ffffff;
}

.overlay {
  position: absolute;
  inset: 0; /* top:0 right:0 bottom:0 left:0 */
  pointer-events: none; /* prevents blocking clicks if needed */
}

.generated-QR {
  width: 60%;
  max-width: 100%; /* this ensures it never overflows */
  position: absolute;
  top: 23%;
  left: 50%;
  transform: translateX(-50%);
}

.paynow-identifier {
  position: absolute;
  bottom: 3%;
  right: 5%;

  font-size: 0.7em;      /* small print */
  font-weight: 500;
  letter-spacing: 0.4px;

  color: #444;
  opacity: 0.8;
}

.caption {
  text-align: center;
}

footer ol li {
  margin-top: 1em;
}

button {
  padding: 1em;
}

main {
  max-width: 900px; /* increase from 520px to a more desktop-friendly width */
  margin: auto;      /* center horizontally */
  padding: 1rem;     /* optional padding */
}

header, footer {
  max-width: 900px;
  margin: auto;
  padding: 1rem;
}
</style>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { sortBy, throttle } from "lodash";
import * as qrcode from "qrcode";
import crc16ccitt from "crc/calculators/crc16ccitt";
import { toPng } from "html-to-image";
import { BACKGROUNDS } from "../src/background";

const selectedBackgroundId = ref("basic");

const selectedBackground = computed(() =>
  BACKGROUNDS.find(b => b.id === selectedBackgroundId.value)!
);

const downloadPNG = async () => {
  const node = document.querySelector(".paynow-card") as HTMLElement;
  if (!node) return;

  const dataUrl = await toPng(node, {
    pixelRatio: 2, // sharper print
    backgroundColor: "#ffffff",
  });

  const link = document.createElement("a");
  link.download = "paynow-card.png";
  link.href = dataUrl;
  link.click();
};

const mode = ref("phone");
const target = ref("");
const reference = ref("");
const receipientName = ref("");
const canvasRef = ref(null as null | HTMLCanvasElement);
const logoRef = ref(null as null | HTMLImageElement);

type QRDataComponentValue = null | string | QRData;

class QRData {
  components: Record<string, QRDataComponentValue>;

  constructor(components: Record<string, QRDataComponentValue>) {
    this.components = components;
  }

  data() {
    return {
      backgroundPreset: 'default', // future-proofing
    }
  }

  toString(): string {
    return sortBy(Object.entries(this.components), ([k, v]: [string, any]) => k)
      .map(([key, comp]: [key: string, comp: QRDataComponentValue]) => {
        if (!key.match(/^[0-9]{2}$/)) {
          throw new Error("Key should be a 2-digit numeric key code");
        }

        if (comp === null) {
          return "";
        }

        const encodedValue = typeof comp === "string" ? comp : comp.toString();

        const length = encodedValue.length;

        if (length > 99) {
          throw new Error("Encoded length should not exceed 99!");
        }

        return [key, length.toString().padStart(2, "0"), encodedValue].join("");
      })
      .join("");
  }

  toStringWithCRC(): string {
    const result = this.toString() + "6304";
    const rcode = crc16ccitt(new TextEncoder().encode(result))
      .toString(16)
      .padStart(4, "0")
      .toUpperCase();

    return result + rcode;
  }
}

const print = () => window.print();

const getLocalStorage = (key: string) => {
  try {
    return window.localStorage[key];
  } catch {
    return "";
  }
};

const updateLocalStorage = (key: string, value: string) => {
  try {
    window.localStorage[key] = value;
  } catch {
    return "";
  }
};

const qrcodeDataURL = ref(getLocalStorage("phone"));
const qrcodeDataTarget = ref("");
const qrCodeReceipientName = ref(receipientName);

const standardizePhone = (mode: string, s: string) => {
  if (mode !== "phone") {
    return s;
  } else {
    if (s.match(/^[0-9]{8}$/)) {
      return "+65" + s;
    } else {
      return s;
    }
  }
};

const imageWidth = 1500;
const UEN_MAX_LENGTH = 20;
const TRANSATION_REF_MAX_LENGTH = 99;

watch(
  [mode, target, reference, canvasRef, imageWidth],
  throttle(
    async () => {
      const finalTarget = standardizePhone(mode.value, target.value);
      const data = new QRData({
        // EMV-Co specs: https://www.emvco.com/specifications/emv-qr-code-specification-for-payment-systems-emv-qrcps-merchant-presented-mode/
        "00": "01", // Payload format indicator: Version we're using
        "01": "11", // Point of initiation method: 11 - static, 12 - dynamic
        "26": new QRData({
          "00": "SG.PAYNOW",
          "01": mode.value === "phone" ? "0" : "2",
          "02": finalTarget,
          "03": "1", // Amount is editabe
          // "04": "YYYYMMDD or YYYYMMDDHHMMSS", // QR code expiry date & time
          "05": reference.value || null,
        }),
        "52": "0000", // Merchant category code
        "53": "702", // ISO 4217 code for SGD
        "58": "SG",
        "59": "NA", // Merchant name -- doesn't matter because PayNow has its own lookup
        "62": new QRData({
          "01": reference.value || null,
        }),
        "60": "Singapore", // City
      }).toStringWithCRC();

      updateLocalStorage("phone", target.value);

      console.log(data);

      // const dataURL = await qrcode.toDataURL(data, { errorCorrectionLevel: 'H' })

      // qrcodeDataURL.value = dataURL;
      if (canvasRef.value) {
        await qrcode.toCanvas(canvasRef.value, data, {
          errorCorrectionLevel: "M",
          width: imageWidth,

          margin: 1,              // 🔑 reduces white border (default is 4)
          scale: 4,               // keeps modules crisp

          color: {
            dark: "#941c80",
            light: "#ffffff",
          },
        });
        const context = canvasRef.value?.getContext("2d");

        const logoElem = logoRef.value;

      if (logoElem) {
          const width = 1323;
          const height = 894;
          const targetWidth = imageWidth / 4;
          const targetHeight = (height / width) * targetWidth;
          const midPoint = imageWidth / 2;
          context!.imageSmoothingEnabled=true
          // context!.imageSmoothingQuality='high'
          context!.fillStyle = "white";
          context!.fillRect(
            midPoint - targetWidth / 2,
            midPoint - targetHeight / 2,
            targetWidth,
            targetHeight
          );
          context!.drawImage(
            logoElem,
            midPoint - targetWidth / 2,
            midPoint - targetHeight / 2,
            targetWidth,
            targetHeight
          );
        }

        qrcodeDataURL.value = canvasRef.value.toDataURL();
        qrcodeDataTarget.value = finalTarget;
      }
    },
    500,
    { leading: true, trailing: true }
  ),
  { immediate: true }
);
</script>