import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [dts()],
	build: {
		target: "es2015",
		lib: {
			entry: "src/inview-vue.ts",
			name: "InViewVue",
		},
		rollupOptions: {
			external: ["vue", "@opuu/inview"],
			output: {
				globals: {
					vue: "Vue",
					"@opuu/inview": "InView",
				},
			},
		},
	},
});
