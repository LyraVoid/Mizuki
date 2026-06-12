// Shared filter handler for FilterTabs atom component
// Works with Swup page transitions
// FilterTabs renders data-filter-attr and data-filter-value on each button
// Cards/entries should have a matching data attribute (e.g. data-category, data-type)

(function () {
	function initFilterTabs(reset) {
		var containers = document.querySelectorAll(".filter-tabs");

		containers.forEach(function (container) {
			if (!reset && container.dataset.initialized) return;
			container.dataset.initialized = "true";

			var tabs = container.querySelectorAll(".filter-tabs-item");
			var filterAttr = tabs[0] ? tabs[0].dataset.filterAttr : null;
			if (!filterAttr) return;

			var dataSelector = "[data-" + filterAttr + "]";
			var parent = container.closest(".card-base") || document;
			var items = parent.querySelectorAll(dataSelector);
			var noResults = parent.querySelector("#no-results");

			if (items.length === 0) return;

			tabs.forEach(function (tab) {
				tab.addEventListener("click", function () {
					tabs.forEach(function (t) {
						t.classList.remove("active");
					});
					tab.classList.add("active");

					var activeValue = tab.dataset.filterValue || "all";
					var visibleCount = 0;

					items.forEach(function (item) {
						var itemValue = item.dataset[filterAttr];
						var match =
							activeValue === "all" || (itemValue && itemValue.split(",").indexOf(activeValue) !== -1);

						if (match) {
							item.classList.remove("filtered-out");
							visibleCount++;
						} else {
							item.classList.add("filtered-out");
						}
					});

					if (noResults) {
						noResults.classList.toggle("hidden", visibleCount > 0);
					}
				});
			});
		});
	}

	// Expose for dynamic tab rebuild (e.g. Memos API fetch)
	window.__initFilterTabs = function () {
		initFilterTabs(true);
	};

	function onInit() {
		if (document.querySelector(".filter-tabs")) {
			initFilterTabs(false);
		}
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", onInit);
	} else {
		onInit();
	}

	document.addEventListener("astro:page-load", onInit);
})();
