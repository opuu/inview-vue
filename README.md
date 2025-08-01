# InView Vue

Vue.js directives for viewport detection. Built on top of the high-performance [@opuu/inview](https://www.npmjs.com/package/@opuu/inview) library with native TypeScript support and optimized for Vue 3.

[![npm version](https://badge.fury.io/js/%40opuu%2Finview-vue.svg)](https://badge.fury.io/js/%40opuu%2Finview-vue)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-green.svg)](https://vuejs.org/)

## Why InView Vue?

InView Vue brings the power of viewport detection directly to your Vue templates through intuitive directives. Perfect for:

- **Lazy Loading**: Load images, videos, and components as they come into view
- **Scroll Animations**: Trigger animations when elements enter the viewport
- **Infinite Scrolling**: Load more content as users scroll down
- **Analytics Tracking**: Track element visibility for user engagement metrics
- **Progressive Enhancement**: Improve performance by deferring non-critical content

## Key Features

- **Native Vue 3 Directives**: `v-inview` and `v-outview` for seamless integration
- **Ultra-lightweight**: Only ~1.5KB gzipped with zero additional dependencies
- **TypeScript Ready**: Complete type definitions for Vue 3 and TypeScript projects
- **High Performance**: Built on native Intersection Observer API via @opuu/inview
- **Composition API**: Fully compatible with Vue 3 Composition API and Options API
- **SSR Friendly**: Works with Nuxt.js and other server-side rendering setups
- **Automatic Cleanup**: Automatically destroys observers when components unmount

## Installation

```bash
npm install @opuu/inview-vue
```

```bash
pnpm add @opuu/inview-vue
```

```bash
yarn add @opuu/inview-vue
```

## Quick Start

### 1. Register Directives Globally

```javascript
// main.js or main.ts
import { createApp } from "vue";
import { createInViewDirective, createOutViewDirective } from "@opuu/inview-vue";
import App from "./App.vue";

const app = createApp(App);

// Register both directives globally
app.directive("inview", createInViewDirective());
app.directive("outview", createOutViewDirective());

app.mount("#app");
```

### 2. Use in Components

```vue
<template>
	<div class="container">
		<!-- Basic enter detection -->
		<div v-inview="handleEnterView">This will trigger when entering viewport</div>

		<!-- Exit detection -->
		<div v-outview="handleExitView">This will trigger when leaving viewport</div>

		<!-- Both enter and exit -->
		<div v-inview="handleEnter" v-outview="handleExit" class="tracked-element">
			Track both enter and exit events
		</div>
	</div>
</template>

<script setup>
function handleEnterView(event) {
	console.log("Element entered view!", event.percentage + "%");
	event.target.classList.add("visible");
}

function handleExitView(event) {
	console.log("Element left view!");
	event.target.classList.remove("visible");
}

function handleEnter(event) {
	console.log("Entered:", event.percentage + "%");
}

function handleExit(event) {
	console.log("Exited");
}
</script>
```

## Configuration

### Global Configuration

Configure directives globally with shared settings:

```javascript
import { createInViewDirective, createOutViewDirective } from "@opuu/inview-vue";

// Global configuration applied to all instances
const config = {
	delay: 100, // 100ms delay before triggering
	precision: "high", // High precision tracking
};

app.directive("inview", createInViewDirective(config));
app.directive("outview", createOutViewDirective(config));
```

### Configuration Options

| Option      | Type                              | Default    | Description                                                      |
| ----------- | --------------------------------- | ---------- | ---------------------------------------------------------------- |
| `delay`     | `number`                          | `0`        | Delay in milliseconds before triggering callbacks                |
| `precision` | `"low"` \| `"medium"` \| `"high"` | `"medium"` | Intersection detection precision                                 |
| `single`    | `boolean`                         | `true`     | Whether to observe only the element (always true for directives) |

#### Precision Levels

- **`"low"`**: 10% increments - Best performance, less precise
- **`"medium"`**: 1% increments - Balanced performance and precision
- **`"high"`**: 0.1% increments - Highest precision, slight performance cost

## Common Use Cases

### Lazy Loading Images

```vue
<template>
	<div class="image-gallery">
		<img
			v-for="image in images"
			:key="image.id"
			:data-src="image.src"
			v-inview="lazyLoadImage"
			src="/placeholder.jpg"
			:alt="image.alt"
			class="lazy-image"
		/>
	</div>
</template>

<script setup>
const images = [
	{ id: 1, src: "/image1.jpg", alt: "Image 1" },
	{ id: 2, src: "/image2.jpg", alt: "Image 2" },
	// ... more images
];

function lazyLoadImage(event) {
	const img = event.target;
	if (img.dataset.src) {
		img.src = img.dataset.src;
		img.removeAttribute("data-src");
		img.classList.add("loaded");
	}
}
</script>

<style>
.lazy-image {
	opacity: 0.3;
	transition: opacity 0.3s;
}
.lazy-image.loaded {
	opacity: 1;
}
</style>
```

### Scroll Animations

```vue
<template>
	<div class="animated-content">
		<section
			v-for="section in sections"
			:key="section.id"
			v-inview="animateIn"
			v-outview="animateOut"
			class="content-section"
		>
			<h2>{{ section.title }}</h2>
			<p>{{ section.content }}</p>
		</section>
	</div>
</template>

<script setup>
const sections = [
	{ id: 1, title: "Section 1", content: "Content for section 1..." },
	{ id: 2, title: "Section 2", content: "Content for section 2..." },
	// ... more sections
];

function animateIn(event) {
	if (event.percentage > 30) {
		// Trigger when 30% visible
		event.target.classList.add("animate-in");
		event.target.classList.remove("animate-out");
	}
}

function animateOut(event) {
	event.target.classList.add("animate-out");
	event.target.classList.remove("animate-in");
}
</script>

<style>
.content-section {
	opacity: 0;
	transform: translateY(30px);
	transition: all 0.6s ease;
}

.content-section.animate-in {
	opacity: 1;
	transform: translateY(0);
}

.content-section.animate-out {
	opacity: 0;
	transform: translateY(30px);
}
</style>
```

### Infinite Scrolling

```vue
<template>
	<div class="infinite-scroll-container">
		<article v-for="post in posts" :key="post.id" class="post">
			<h3>{{ post.title }}</h3>
			<p>{{ post.excerpt }}</p>
		</article>

		<!-- Load more trigger -->
		<div v-if="hasMore" v-inview="loadMore" class="load-trigger">Loading more posts...</div>
	</div>
</template>

<script setup>
import { ref } from "vue";

const posts = ref([
	{ id: 1, title: "Post 1", excerpt: "Excerpt 1..." },
	// ... initial posts
]);
const hasMore = ref(true);
const loading = ref(false);

async function loadMore(event) {
	if (loading.value || !hasMore.value) return;

	loading.value = true;
	try {
		const newPosts = await fetchMorePosts();
		posts.value.push(...newPosts);

		if (newPosts.length === 0) {
			hasMore.value = false;
		}
	} catch (error) {
		console.error("Failed to load more posts:", error);
	} finally {
		loading.value = false;
	}
}

async function fetchMorePosts() {
	// Your API call here
	const response = await fetch(`/api/posts?offset=${posts.value.length}`);
	return response.json();
}
</script>
```

### Analytics Tracking

```vue
<template>
	<div class="analytics-content">
		<section
			v-for="section in contentSections"
			:key="section.id"
			v-inview="trackSectionView"
			:data-section-id="section.id"
			:data-section-name="section.name"
			class="tracked-section"
		>
			<h2>{{ section.title }}</h2>
			<p>{{ section.content }}</p>
		</section>
	</div>
</template>

<script setup>
const contentSections = [
	{ id: "intro", name: "Introduction", title: "Welcome", content: "..." },
	{ id: "features", name: "Features", title: "Key Features", content: "..." },
	// ... more sections
];

function trackSectionView(event) {
	// Only track when element is substantially visible
	if (event.percentage > 50) {
		const element = event.target;

		// Send analytics event
		gtag("event", "section_viewed", {
			section_id: element.dataset.sectionId,
			section_name: element.dataset.sectionName,
			visibility_percentage: event.percentage,
			timestamp: event.time,
		});

		console.log(`Section "${element.dataset.sectionName}" viewed:`, event.percentage + "%");
	}
}
</script>
```

## TypeScript Support

InView Vue includes complete TypeScript definitions for Vue 3:

```typescript
// types.ts
import type { InViewEvent } from "@opuu/inview-vue";

// Type your event handlers
function handleEnterView(event: InViewEvent): void {
	console.log(`Element is ${event.percentage}% visible`);

	// Full type safety for event properties
	const element: Element = event.target;
	const visibility: number = event.percentage;
	const timestamp: number = event.time;
}
```

```vue
<!-- Component.vue -->
<template>
	<div v-inview="handleEnter" class="typed-component">TypeScript-ready component</div>
</template>

<script setup lang="ts">
import type { InViewEvent } from "@opuu/inview-vue";

function handleEnter(event: InViewEvent): void {
	event.target.classList.add("visible");
	console.log(`Visibility: ${event.percentage}%`);
}
</script>
```

## Local Registration

Register directives locally within specific components:

```vue
<template>
	<div v-inview="handleEnter">Component with local directive</div>
</template>

<script setup>
import { createInViewDirective } from "@opuu/inview-vue";

// Local directive registration
const vInview = createInViewDirective({
	delay: 200,
	precision: "high",
});

function handleEnter(event) {
	console.log("Local directive triggered:", event.percentage);
}
</script>
```

## Options API Support

Works seamlessly with Vue 3 Options API:

```vue
<template>
	<div>
		<div v-inview="handleEnter" v-outview="handleExit">Options API component</div>
	</div>
</template>

<script>
export default {
	methods: {
		handleEnter(event) {
			console.log("Entered view:", event.percentage + "%");
			this.isVisible = true;
		},

		handleExit(event) {
			console.log("Exited view");
			this.isVisible = false;
		},
	},

	data() {
		return {
			isVisible: false,
		};
	},
};
</script>
```

## Nuxt.js Integration

For Nuxt.js applications, create a plugin:

```javascript
// plugins/inview.client.js
import { createInViewDirective, createOutViewDirective } from "@opuu/inview-vue";

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.directive(
		"inview",
		createInViewDirective({
			delay: 100,
			precision: "medium",
		})
	);

	nuxtApp.vueApp.directive(
		"outview",
		createOutViewDirective({
			delay: 100,
			precision: "medium",
		})
	);
});
```

Then use in your Nuxt pages and components as normal:

```vue
<template>
	<div v-inview="handleEnter">Nuxt.js component with InView directive</div>
</template>
```

## Event Object

The event object passed to directive handlers contains:

```typescript
interface InViewEvent {
	percentage: number; // Visibility percentage (0-100)
	rootBounds: DOMRectReadOnly | null; // Viewport rectangle
	boundingClientRect: DOMRectReadOnly; // Element rectangle
	intersectionRect: DOMRectReadOnly; // Intersection rectangle
	target: Element; // The observed element
	time: number; // Event timestamp
	event: "enter" | "exit"; // Event type
}
```

## Performance Considerations

### Best Practices

1. **Use appropriate precision**: Start with "medium" precision and only use "high" when needed
2. **Leverage delay for expensive operations**: Use the delay option for heavy computations
3. **Automatic cleanup**: Directives automatically clean up when components unmount
4. **Conditional observing**: Use `v-if` to conditionally apply directives when needed

### Example: Conditional Observing

```vue
<template>
	<div>
		<!-- Only observe when feature is enabled -->
		<div v-if="enableLazyLoading" v-inview="lazyLoad" class="lazy-content">Content that may be lazy loaded</div>
	</div>
</template>

<script setup>
import { ref } from "vue";

const enableLazyLoading = ref(true);

function lazyLoad(event) {
	// Heavy operation only when needed
	if (event.percentage > 30) {
		loadExpensiveContent();
	}
}
</script>
```

## Browser Support

InView Vue works on all modern browsers with Vue 3 support:

- **Vue**: 3.0+
- **Chrome**: 51+
- **Firefox**: 55+
- **Safari**: 12.1+
- **Edge**: 15+

For older browser support, consider using an [Intersection Observer polyfill](https://github.com/w3c/IntersectionObserver/tree/main/polyfill).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT License](LICENSE) - feel free to use this project in your commercial and personal projects.

## Author

**Obaydur Rahman**

- GitHub: [@opuu](https://github.com/opuu)
- Website: [opu.rocks](https://opu.rocks)

## Related Projects

- [@opuu/inview](https://www.npmjs.com/package/@opuu/inview) - Core JavaScript library that powers this Vue package
