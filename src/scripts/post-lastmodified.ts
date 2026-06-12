export interface LastModifiedOptions {
	prefix: string;
	year: string;
	month: string;
	day: string;
	hour: string;
	minute: string;
	second: string;
}

export function initLastModifiedHandler(options: LastModifiedOptions) {
	const { prefix, year, month, day, hour, minute, second } = options;

	function updateLastModified(lastModified: string) {
		const startDate = new Date(lastModified);
		const currentDate: Date = new Date();
		const diff: number = currentDate.getTime() - startDate.getTime();
		const seconds = Math.floor(diff / 1000);
		const days = Math.floor(seconds / 86400);
		const hours = Math.floor((seconds % 86400) / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		const years = Math.floor(days / 365);
		const months = Math.floor((days % 365) / 30);
		const remainingDays = days % 30;

		let result = prefix + " ";
		if (years > 0) {
			result += `${years} ${year} `;
		}
		if (months > 0) {
			result += `${months} ${month} `;
		}
		if (remainingDays > 0) {
			result += `${remainingDays} ${day} `;
		}
		result += `${hours} ${hour} `;
		result += `${mins < 10 ? "0" : ""}${mins} ${minute} `;
		result += `${secs < 10 ? "0" : ""}${secs} ${second}`;

		const element = document.getElementById("modifiedtime");
		if (element) {
			element.innerHTML = result;
		}
	}

	const element = document.getElementById("last-modified");
	if (element) {
		updateLastModified(element.dataset.lastModified || "");
		setInterval(() => {
			updateLastModified(element.dataset.lastModified || "");
		}, 1000);
	}
}
