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
				"Main laptop for programming, Linux work, virtualization, and CS/AI learning.",
			link: "https://www.dell.com/support/home/en-us/product-support/product/latitude-15-5580-laptop/overview",
		},
	],
	Apple: [
		{
			name: "iPhone X",
			image: "",
			specs: "iPhone X",
			description: "Current iPhone in the personal device setup.",
			link: "https://support.apple.com/kb/SP770",
		},
	],
	Android: [
		{
			name: "Redmi 9",
			image: "",
			specs: "Xiaomi Redmi 9",
			description: "Android device used for mobile OS experiments, Linux exploration, and testing.",
			link: "https://www.mi.com/global/redmi-9/",
		},
	],
};
