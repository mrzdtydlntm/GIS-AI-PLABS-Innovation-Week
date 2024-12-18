<template>
  <div class="map-container">
    <ol-map class="full-screen-map">
      <ol-view
        ref="view"
        :center="center"
        :rotation="rotation"
        :zoom="zoom"
        :projection="projection"
        @change:center="centerChanged"
        @change:resolution="resolutionChanged"
        @change:rotation="rotationChanged"
      />
      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>

      <ol-overlay
        :position="[item + 132.87291795137622 + offset, 35.517821791218614]"
        v-for="item in list"
        :key="item"
        :autoPan="true"
      >
        <img
          :width="calculateIconSize"
          :height="calculateIconSize"
          src="@/assets/marker-icon.png"
          @click="handleMarkerClick(item)"
          class="pinpoint"
        />
      </ol-overlay>
    </ol-map>

    <div v-if="showInfo" class="info-modal">
      <div class="info-modal-content">
        <h2 style="color: black">About This Map</h2>
        <br />
        <p style="color: black">Copyright Kamikaze Team, 2024</p>
        <p style="color: black">Made for Innovation Week PLABS.ID</p>
        <br />
        <button @click="toggleInfo">Close</button>
      </div>
    </div>

    <div class="bottom-bar">
      <div class="bottom-bar-content">
        <h1>{{ title }}</h1>
        <div class="bottom-bar-actions">
          <button @click="toggleInfo" class="info-button">
            <span>ℹ️ About</span>
          </button>
        </div>
      </div>
    </div>

    <div class="chat-overlay" :class="{ minimized: isChatMinimized }">
      <div class="chat-toggle-btn" @click="toggleChat">
        {{ isChatMinimized ? 'Expand Chat' : 'Minimize Chat' }}
      </div>
      <ChatBox ref="chatBox" v-show="!isChatMinimized" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ChatBox from '@/components/ChatBox.vue'

const title = ref('Health-GIS')
const center = ref([135.87291795137622, 35.417821791218614])
const projection = ref('EPSG:4326')
const zoom = ref(6.38)
const rotation = ref(0)

const currentCenter = ref(center.value)
const currentZoom = ref(zoom.value)
const currentRotation = ref(rotation.value)
const currentResolution = ref(0)
const offset = ref(0)
const list = ref([2, 1, 3, 5, -1])
const chatBox = ref(null)
const isChatMinimized = ref(true)
const showInfo = ref(false)

const calculateIconSize = computed(() => {
  return Math.max(20, Math.min(100, 50 * (currentZoom.value / 6.38)))
})
function toggleChat() {
  isChatMinimized.value = !isChatMinimized.value
}
function toggleInfo() {
  showInfo.value = !showInfo.value
}
function resolutionChanged(event) {
  currentResolution.value = event.target.getResolution()
  currentZoom.value = event.target.getZoom()
}
function centerChanged(event) {
  currentCenter.value = event.target.getCenter()
}
function rotationChanged(event) {
  currentRotation.value = event.target.getRotation()
}
function handleMarkerClick(item) {
  const longitude = item + 132.87291795137622 + offset.value
  const latitude = 35.51782179121861

  isChatMinimized.value = false

  if (chatBox.value) {
    chatBox.value.runAI([longitude, latitude])
  }
}
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}
.ol-map {
  position: relative;
}
.ol-map-loading:after {
  content: '';
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  margin-top: -40px;
  margin-left: -40px;
  border-radius: 50%;
  border: 5px solid rgba(180, 180, 180, 0.6);
  border-top-color: var(--vp-c-brand-1);
  animation: spinner 0.6s linear infinite;
}
.pinpoint:hover {
  cursor: pointer;
}
.chat-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 620px;
  transition: all 0.3s ease;
  z-index: 1000;
}

.chat-overlay.minimized {
  width: 200px;
  height: 50px;
}

.chat-toggle-btn {
  background-color: #007bff;
  color: white;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 10px;
}
.bottom-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px 20px;
  z-index: 1000;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.bottom-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.bottom-bar h1 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.bottom-bar-actions {
  display: flex;
  align-items: center;
}

.info-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
  transition: transform 0.2s;
}

.info-button:hover {
  transform: scale(1.1);
}

.full-screen-map {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.info-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.info-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  text-align: center;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>
