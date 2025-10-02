import { definePlugin } from "@expressive-code/core";
import type { Element } from "hast";

export function pluginCustomCopyButton() {
	return definePlugin({
		name: "Custom Copy Button",
		baseStyles: ({ cssVar }) => `
			.copy-btn {
				position: absolute;
				top: 0.5rem;
				right: 0.5rem;
				z-index: 10;
				padding: 0.25rem;
				background: ${cssVar('frames.copyButtonBackground')};
				border: none;
				border-radius: 0.25rem;
				cursor: pointer;
				opacity: 0;
				transition: all 0.2s ease;
				color: ${cssVar('frames.copyButtonForeground')};
			}
			
			.copy-btn:hover {
				background: ${cssVar('frames.copyButtonBackgroundHover')};
				opacity: 1;
			}
			
			.copy-btn:active {
				background: ${cssVar('frames.copyButtonBackgroundActive')};
			}
			
			.frame:hover .copy-btn {
				opacity: 1;
			}
			
			.copy-btn-icon {
				width: 0.75rem;
				height: 0.75rem;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			
			.copy-btn svg {
				width: 100%;
				height: 100%;
				fill: currentColor;
			}
			
			.copy-btn .success-icon {
				display: none;
			}
			
			.copy-btn.success .copy-icon {
				display: none;
			}
			
			.copy-btn.success .success-icon {
				display: block;
			}
			
			.copy-btn.success {
				color: var(--primary);
			}
			
			/* 移动端优化：使用触摸事件而不是始终显示 */
			@media (hover: none) {
				.frame.touch-active .copy-btn {
					opacity: 1;
				}
			}
		`,
		jsModules: [`
			// Copy button functionality
			document.addEventListener('DOMContentLoaded', function() {
				function initializeCopyButtons() {
					const copyButtons = document.querySelectorAll('.copy-btn:not([data-initialized])');
					
					copyButtons.forEach(button => {
						button.addEventListener('click', async function() {
							const codeBlock = this.closest('pre');
							if (!codeBlock) return;
							
							const code = codeBlock.querySelector('code');
							if (!code) return;
							
							try {
								await navigator.clipboard.writeText(code.textContent || '');
								
								// Show success state
								this.classList.add('success');
								
								// Reset after 2 seconds
								setTimeout(() => {
									this.classList.remove('success');
									// 在移动端，复制成功后也重置touch-active状态
									const frame = this.closest('.frame');
									if (frame && window.matchMedia('(hover: none)').matches) {
										frame.classList.remove('touch-active');
									}
								}, 2000);
								
							} catch (err) {
								console.error('Failed to copy code:', err);
							}
						});
						
						// 在移动端添加触摸事件支持
						if (window.matchMedia('(hover: none)').matches) {
							const frame = button.closest('.frame');
							if (frame) {
								// 添加触摸开始事件
								frame.addEventListener('touchstart', function() {
									this.classList.add('touch-active');
									
									// 3秒后自动隐藏按钮（除非处于成功状态）
									setTimeout(() => {
										const copyBtn = this.querySelector('.copy-btn');
										if (copyBtn && !copyBtn.classList.contains('success')) {
											this.classList.remove('touch-active');
										}
									}, 3000);
								}, { passive: true });
							}
						}
						
						button.setAttribute('data-initialized', 'true');
					});
				}
				
				// Initialize on page load
				initializeCopyButtons();
				
				// Re-initialize after page transitions
				if (window.swup) {
					window.swup.hooks.on('page:view', initializeCopyButtons);
				}
				
				// Handle dynamic content loading
				const observer = new MutationObserver(function(mutations) {
					mutations.forEach(function(mutation) {
						if (mutation.addedNodes.length > 0) {
							initializeCopyButtons();
						}
					});
				});
				
				observer.observe(document.body, {
					childList: true,
					subtree: true
				});
			});
		`],
		hooks: {
			postprocessRenderedBlock: (context) => {
				function traverse(node: Element) {
					if (node.type === "element" && node.tagName === "pre") {
						processCodeBlock(node);
						return;
					}
					if (node.children) {
						for (const child of node.children) {
							if (child.type === "element") traverse(child);
						}
					}
				}

				function processCodeBlock(node: Element) {
					const copyButton = {
						type: "element" as const,
						tagName: "button",
						properties: {
							className: ["copy-btn"],
							"aria-label": "Copy code",
						},
						children: [
							{
								type: "element" as const,
								tagName: "div",
								properties: {
									className: ["copy-btn-icon"],
								},
								children: [
									{
										type: "element" as const,
										tagName: "svg",
										properties: {
											viewBox: "0 -960 960 960",
											xmlns: "http://www.w3.org/2000/svg",
											className: ["copy-btn-icon", "copy-icon"],
										},
										children: [
											{
												type: "element" as const,
												tagName: "path",
												properties: {
													d: "M368.37-237.37q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-474.26q0-34.48 24.26-58.74 24.26-24.26 58.74-24.26h378.26q34.48 0 58.74 24.26 24.26 24.26 24.26 58.74v474.26q0 34.48-24.26 58.74-24.26 24.26-58.74 24.26H368.37Zm0-83h378.26v-474.26H368.37v474.26Zm-155 238q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-515.76q0-17.45 11.96-29.48 11.97-12.02 29.33-12.02t29.54 12.02q12.17 12.03 12.17 29.48v515.76h419.76q17.45 0 29.48 11.96 12.02 11.97 12.02 29.33t-12.02 29.54q-12.03 12.17-29.48 12.17H213.37Zm155-238v-474.26 474.26Z",
												},
												children: [],
											},
										],
									},
									{
										type: "element" as const,
										tagName: "svg",
										properties: {
											viewBox: "0 -960 960 960",
											xmlns: "http://www.w3.org/2000/svg",
											className: ["copy-btn-icon", "success-icon"],
										},
										children: [
											{
												type: "element" as const,
												tagName: "path",
												properties: {
													d: "m389-377.13 294.7-294.7q12.58-12.67 29.52-12.67 16.93 0 29.61 12.67 12.67 12.68 12.67 29.53 0 16.86-12.28 29.14L419.07-288.41q-12.59 12.67-29.52 12.67-16.94 0-29.62-12.67L217.41-430.93q-12.67-12.68-12.79-29.45-.12-16.77 12.55-29.45 12.68-12.67 29.62-12.67 16.93 0 29.28 12.67L389-377.13Z",
												},
												children: [],
											},
										],
									},
								],
							},
						],
					} as Element;

					if (!node.children) {
						node.children = [];
					}
					node.children.push(copyButton);
				}

				traverse(context.renderData.blockAst);
			},
		},
	});
}