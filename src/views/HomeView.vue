<template>
  <ol-map style="min-width: 800px; min-height: 800px">
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
        @click="$refs.chatBox.runAI([item + 132.87291795137622 + offset, 35.517821791218614])"
        class="pinpoint"
      />
    </ol-overlay>
  </ol-map>

  <ul>
    <li>center : {{ currentCenter }}</li>
    <li>resolution : {{ currentResolution }}</li>
    <li>zoom : {{ currentZoom }}</li>
    <li>rotation : {{ currentRotation }}</li>
    <br />
    <ChatBox ref="chatBox" />
  </ul>
</template>

<script setup>
import { ref, computed } from 'vue'
import ChatBox from '@/components/ChatBox.vue'

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

const calculateIconSize = computed(() => {
  return Math.max(20, Math.min(100, 50 * (currentZoom.value / 6.38)))
})
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
</script>

<style scoped>
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

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>
