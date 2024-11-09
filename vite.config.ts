import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	assetsInclude: ["**/*.lottie"], // Включаем Lottie-файлы в сборку
	build: {
		outDir: "./build",
		target: "esnext", // Используем последние возможности браузера для улучшения производительности
		minify: "esbuild", // Быстрое и эффективное минифицирование
		cssCodeSplit: true, // Уменьшаем количество CSS-файлов для оптимизации рендеринга
		rollupOptions: {
			output: {
				manualChunks: {
					// Пример разделения кода для улучшения загрузки
					vendor: ["react", "react-dom", 'lottie-react'],
				},
			},
		},
		chunkSizeWarningLimit: 1000 // Adjust the limit as needed
	},
	esbuild: {
		jsxFactory: "React.createElement", // Оптимизация рендеринга JSX
		jsxFragment: "React.Fragment",
	},
	server: {
		port: 3000, // Запуск dev-сервера на нужном порту
		open: true, // Автоматическое открытие в браузере
		host: true,
	},
	resolve: {
		alias: {
			"@components": "/src/components", // Удобные алиасы для структуры проекта
		},
	},
	optimizeDeps: {
		// Принудительная предварительная сборка зависимостей для улучшения старта
		include: ["react", "react-dom"],
	},
});
