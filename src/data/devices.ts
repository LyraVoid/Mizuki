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
			image: "",
			specs: "Intel Core i5-7440HQ / 16 GB RAM / GeForce 940MX 2 GB",
			description:
				"Current laptop used for programming, Linux work, virtualization, and CS/AI learning.",
			link: "https://www.dell.com/support/home/en-us/product-support/product/latitude-15-5580-laptop/overview",
		},
	],
	Apple: [
		{
			name: "iPhone X",
			image: "",
			specs: "Daily iPhone",
			description: "Current iPhone used as part of the personal device setup.",
			link: "https://support.apple.com/kb/SP770",
		},
		{
			name: "iPad mini 1",
			image: "",
			specs: "1st generation iPad mini",
			description: "Older Apple tablet kept as part of the device collection.",
			link: "https://support.apple.com/kb/SP661",
		},
		{
			name: "iPhone 5c",
			image: "",
			specs: "iPhone 5c",
			description: "Older iPhone kept as part of the device collection and experimentation setup.",
			link: "https://support.apple.com/kb/SP684",
		},
	],
	Android: [
		{
			name: "Redmi 9",
			image: "",
			specs: "Xiaomi Redmi 9",
			description: "Android device used for system experiments, Linux/mobile OS exploration, and testing.",
			link: "https://www.mi.com/global/redmi-9/",
		},
	],
};
