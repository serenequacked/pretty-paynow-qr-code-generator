<template>
  <canvas ref="canvas" :width="1080" :height="1350"></canvas>
</template>

<script>
// PosterCanvas.vue
const CANVAS_WIDTH = 1080
const CANVAS_HEIGHT = 1350

const CARD = {
  x: 140,
  y: 260,
  width: 800,
  height: 820,
  radius: 24
}

const QR = {
  size: 480,
  x: 300,
  y: 360
}

import QRCode from "qrcode"

export default {
  name: "PosterCanvas",
  props: {
    qrValue: { type: String, required: true },
    name: { type: String, default: "" }
  },
  data() {
    return {
      WIDTH: 1080,
      HEIGHT: 1350
    }
  },
  async mounted() {
    await this.draw()
  },
  watch: {
    qrValue() {
      this.draw()
    },
    name() {
      this.draw()
    }
  },
  methods: {
    async draw() {
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext("2d")

      // Clear
      ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT)

      // 1. Draw background
      await this.drawBackground(ctx)

      // 2. Draw white card
      this.drawCard(ctx)

      // 3. Draw name
      this.drawName(ctx)

      // 4. Draw QR
      await this.drawQr(ctx)
    },

    async drawBackground(ctx) {
      const bg = new Image()
      bg.src = "/assets/backgrounds/default.png"
      await bg.decode()
      ctx.drawImage(bg, 0, 0, this.WIDTH, this.HEIGHT)
    },

    drawCard(ctx) {
      const cardX = 140
      const cardY = 260
      const cardW = 800
      const cardH = 820
      const radius = 24

      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.moveTo(cardX + radius, cardY)
      ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + cardH, radius)
      ctx.arcTo(cardX + cardW, cardY + cardH, cardX, cardY + cardH, radius)
      ctx.arcTo(cardX, cardY + cardH, cardX, cardY, radius)
      ctx.arcTo(cardX, cardY, cardX + cardW, cardY, radius)
      ctx.closePath()
      ctx.fill()
    },

    drawName(ctx) {
      if (!this.name) return

      ctx.fillStyle = "#000"
      ctx.font = "bold 40px Montserrat, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(this.name.toUpperCase(), this.WIDTH / 2, 220)
    },

    async drawQr(ctx) {
      const qrCanvas = document.createElement("canvas")

      await QRCode.toCanvas(qrCanvas, this.qrValue, {
        width: 480,
        margin: 1
      })

      ctx.drawImage(qrCanvas, 300, 360)
    }
  }
}
</script>
