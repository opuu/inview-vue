# InView Vue

Vue 3 directives for viewport detection. Simple `v-inview` and `v-outview` directives.

[![npm version](https://badge.fury.io/js/%40opuu%2Finview-vue.svg)](https://badge.fury.io/js/%40opuu%2Finview-vue)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @opuu/inview-vue
```

## Setup

```javascript
// main.js
import { createApp } from "vue";
import { createInViewDirective, createOutViewDirective } from "@opuu/inview-vue";

const app = createApp(App);

app.directive("inview", createInViewDirective());
app.directive("outview", createOutViewDirective());

app.mount("#app");
```

## Usage

```vue
<template>
	<!-- Enter viewport -->
	<div v-inview="handleEnter">I'm visible!</div>

	<!-- Exit viewport -->
	<div v-outview="handleExit">I'm hidden!</div>

	<!-- Both -->
	<div v-inview="onEnter" v-outview="onExit">Track both</div>
</template>

<script setup>
function handleEnter(event) {
	console.log("Visible:", event.percentage + "%");
}

function handleExit(event) {
	console.log("Hidden");
}

function onEnter(event) {
	event.target.classList.add("visible");
}

function onExit(event) {
	event.target.classList.remove("visible");
}
</script>
```

## Examples

### Lazy Loading

```vue
<template>
	<img v-for="image in images" :key="image.id" v-inview="lazyLoad" :data-src="image.src" src="placeholder.jpg" />
</template>

<script setup>
function lazyLoad(event) {
	const img = event.target;
	img.src = img.dataset.src;
}
</script>
```

### Animations

```vue
<template>
	<div v-inview="fadeIn" v-outview="fadeOut" class="box">Animate me!</div>
</template>

<script setup>
function fadeIn(event) {
	event.target.classList.add("animate");
}

function fadeOut(event) {
	event.target.classList.remove("animate");
}
</script>

<style>
.box {
	opacity: 0;
	transition: opacity 0.3s;
}
.box.animate {
	opacity: 1;
}
</style>
```

### Analytics

```vue
<template>
	<section v-inview="trackView" data-section="hero">Hero content</section>
</template>

<script setup>
function trackView(event) {
	if (event.percentage > 50) {
		analytics.track("section_viewed", {
			section: event.target.dataset.section,
		});
	}
}
</script>
```

## Configuration

You can configure directives globally:

```javascript
import { createInViewDirective } from "@opuu/inview-vue";

app.directive(
	"inview",
	createInViewDirective({
		delay: 100, // Debounce delay in ms
		precision: "high", // "low", "medium", or "high"
	})
);
```

| Option      | Default    | Description                    |
| ----------- | ---------- | ------------------------------ |
| `delay`     | `0`        | Debounce delay in milliseconds |
| `precision` | `"medium"` | Observation precision level    |

## Local Registration

```vue
<template>
	<div v-inview="handleEnter">Local directive</div>
</template>

<script setup>
import { createInViewDirective } from "@opuu/inview-vue";

const vInview = createInViewDirective({ delay: 200 });

function handleEnter(event) {
	console.log("Triggered:", event.percentage);
}
</script>
```

## TypeScript

```vue
<script setup lang="ts">
import type { InViewEvent } from "@opuu/inview-vue";

function handleEnter(event: InViewEvent): void {
	console.log(`Element is ${event.percentage}% visible`);
}
</script>
```

## Nuxt.js

Create a plugin:

```javascript
// plugins/inview.js
import { createInViewDirective, createOutViewDirective } from "@opuu/inview-vue";

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.directive("inview", createInViewDirective());
	nuxtApp.vueApp.directive("outview", createOutViewDirective());
});
```

## License

MIT
