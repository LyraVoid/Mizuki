// Personal device data

export interface Device {
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

export type DeviceCategory = Record<string, Device[]> & {
	Custom?: Device[];
};

export const devicesData: DeviceCategory = {
	Laptop: [
		{
			name: "Dell Latitude 5580",
			image: "https://www.laptoparena.net/images/DELL_Latitude_5580_1RT12_image_9.jpg",
			specs: "Intel Core i5-7440HQ / 16 GB DDR4 RAM / NVIDIA GeForce 940MX 2 GB",
			description:
			"15.6-inch business laptop used for programming, Linux work, virtualization, and CS/AI learning. CPU: Intel Core i5-7440HQ, 4 cores / 4 threads, 2.80 GHz base and up to 3.80 GHz turbo. GPU: NVIDIA GeForce 940MX with 2 GB VRAM.",
			link: "https://www.dell.com/support/product-details/en-eg/product/latitude-15-5580-laptop",
		},
	],
	Apple: [
		{
			name: "iPhone X",
			image: "https://i.ebayimg.com/images/g/O7UAAeSw0rloBsLm/s-l400.jpg",
			specs: "Apple A11 Bionic / 3 GB RAM / 256 GB storage",
			description:
			"5.8-inch iPhone X with Apple's A11 Bionic chip. Hexa-core CPU with two performance cores and four efficiency cores, paired with 3 GB RAM and 256 GB internal storage.",
			link: "https://support.apple.com/kb/SP770",
		},
	],
	Android: [
		{
			name: "Redmi 9",
			image: "https://www.tradeinn.com/f/13771/137713917/xiaomi-redmi-9-3gb-32gb-6.53-dual-sim-smartphone.jpg",
			specs: "MediaTek Helio G80 / 3 GB RAM / 32 GB storage",
			description:
			"6.53-inch Redmi 9 with MediaTek Helio G80. Octa-core CPU with 2× Cortex-A75 up to 2.0 GHz and 6× Cortex-A55 up to 1.8 GHz, paired with 3 GB RAM and 32 GB internal storage.",
			link: "https://www.mi.com/global/redmi-9/",
		},
	],
};
