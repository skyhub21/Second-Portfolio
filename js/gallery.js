
/**
 * Ancient Signal Portfolio
 * Project Gallery
 *
 * Responsibilities:
 * - Display project cover images and screenshots.
 * - Navigate between gallery images.
 * - Provide accessible previous/next controls.
 * - Support keyboard navigation.
 * - Show a placeholder when a project has no images.
 *
 * Expected project fields:
 * - coverImage: string
 * - galleryImages: array of strings or image objects
 *
 * Supported image object example:
 * {
 *   src: "assets/images/projects/example/screenshot.webp",
 *   alt: "Project dashboard"
 * }
 */

(function () {
    "use strict";

    const GALLERY_SELECTOR = "[data-project-gallery]";
    const IMAGE_SELECTOR = "[data-gallery-image]";
    const PREVIOUS_SELECTOR = "[data-gallery-action='previous']";
    const NEXT_SELECTOR = "[data-gallery-action='next']";
    const COUNTER_SELECTOR = "[data-gallery-counter]";

    /**
     * Escape text before inserting it into HTML.
     */
    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (character) {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entities[character];
        });
    }

    /**
     * Accept relative asset paths and HTTP(S) URLs only.
     * Prevent javascript: and other unsafe URL schemes.
     */
    function isSafeImageURL(value) {
        if (typeof value !== "string" || !value.trim()) {
            return false;
        }

        const url = value.trim();

        if (/^(javascript|data|vbscript):/i.test(url)) {
            return false;
        }

        if (/^https?:\/\//i.test(url)) {
            try {
                const parsedURL = new URL(url);
                return (
                    parsedURL.protocol === "https:" ||
                    parsedURL.protocol === "http:"
                );
            } catch {
                return false;
            }
        }

        // Allow normal relative paths and root-relative paths.
        // Reject protocol-relative URLs and unexpected schemes.
        if (url.startsWith("//")) {
            return false;
        }

        if (/^[a-z][a-z0-9+.-]*:/i.test(url)) {
            return false;
        }

        return true;
    }

    /**
     * Convert a project image entry into a consistent format.
     */
    function normalizeImage(image, index, projectTitle) {
        if (typeof image === "string") {
            return {
                src: image,
                alt: `${projectTitle} screenshot ${index + 1}`
            };
        }

        if (image && typeof image === "object") {
            return {
                src: image.src || image.url || "",
                alt: image.alt || `${projectTitle} screenshot ${index + 1}`
            };
        }

        return null;
    }

    /**
     * Collect the cover image and gallery screenshots.
     * Duplicate paths are included only once.
     */
    function getImages(project) {
        if (!project || typeof project !== "object") {
            return [];
        }

        const title = project.title || "Project";
        const entries = [];

        if (project.coverImage) {
            entries.push({
                src: project.coverImage,
                alt: `${title} cover image`
            });
        }

        if (Array.isArray(project.galleryImages)) {
            project.galleryImages.forEach(function (image, index) {
                const normalized = normalizeImage(image, index, title);

                if (normalized) {
                    entries.push(normalized);
                }
            });
        }

        const seen = new Set();

        return entries.filter(function (image) {
            if (!isSafeImageURL(image.src)) {
                return false;
            }

            const key = image.src.trim();

            if (seen.has(key)) {
                return false;
            }

            seen.add(key);

            image.src = key;
            return true;
        });
    }

    /**
     * Render the gallery markup for a project.
     *
     * Use this when constructing the project details dialog:
     * PortfolioGallery.render(project)
     */
    function render(project) {
        const title = escapeHTML(project?.title || "Project");
        const images = getImages(project);

        if (images.length === 0) {
            return `
                <section class="project-gallery project-gallery--empty"
                         aria-label="Project image gallery">
                    <div class="gallery-placeholder">
                        <span class="gallery-placeholder__symbol"
                              aria-hidden="true">◇</span>
                        <p class="gallery-placeholder__title">
                            Visual archive pending
                        </p>
                        <p class="gallery-placeholder__description">
                            Screenshots for ${title} will appear here.
                        </p>
                    </div>
                </section>
            `;
        }

        const imageData = escapeHTML(JSON.stringify(images));

        return `
            <section
                class="project-gallery"
                data-project-gallery
                data-gallery-images="${imageData}"
                data-gallery-index="0"
                aria-label="${title} image gallery"
            >
                <div class="gallery-stage">
                    <img
                        class="gallery-stage__image"
                        data-gallery-image
                        src="${escapeHTML(images[0].src)}"
                        alt="${escapeHTML(images[0].alt)}"
                        loading="lazy"
                        decoding="async"
                    >

                    <div class="gallery-stage__overlay"
                         aria-hidden="true">
                        <span class="gallery-stage__label">
                            VISUAL RECORD
                        </span>
                    </div>

                    ${
                        images.length > 1
                            ? `
                                <button
                                    class="gallery-control gallery-control--previous"
                                    type="button"
                                    data-gallery-action="previous"
                                    aria-label="Show previous image"
                                >
                                    <span aria-hidden="true">←</span>
                                </button>

                                <button
                                    class="gallery-control gallery-control--next"
                                    type="button"
                                    data-gallery-action="next"
                                    aria-label="Show next image"
                                >
                                    <span aria-hidden="true">→</span>
                                </button>
                            `
                            : ""
                    }
                </div>

                <div class="gallery-footer">
                    <span class="gallery-footer__caption"
                          data-gallery-caption>
                        ${escapeHTML(images[0].alt)}
                    </span>

                    <span class="gallery-footer__counter"
                          data-gallery-counter
                          aria-live="polite">
                        01 / ${String(images.length).padStart(2, "0")}
                    </span>
                </div>

                ${
                    images.length > 1
                        ? `
                            <div class="gallery-thumbnails"
                                 aria-label="Choose a project image">
                                ${images.map(function (image, index) {
                                    return `
                                        <button
                                            class="gallery-thumbnail${index === 0 ? " is-active" : ""}"
                                            type="button"
                                            data-gallery-thumbnail="${index}"
                                            aria-label="View image ${index + 1}"
                                            aria-pressed="${index === 0}"
                                        >
                                            <img
                                                src="${escapeHTML(image.src)}"
                                                alt=""
                                                loading="lazy"
                                                decoding="async"
                                            >
                                        </button>
                                    `;
                                }).join("")}
                            </div>
                        `
                        : ""
                }
            </section>
        `;
    }

    /**
     * Display a specific image in a gallery.
     */
    function showImage(gallery, requestedIndex) {
        if (!gallery) {
            return;
        }

        let images;

        try {
            images = JSON.parse(
                gallery.getAttribute("data-gallery-images") || "[]"
            );
        } catch {
            return;
        }

        if (!Array.isArray(images) || images.length === 0) {
            return;
        }

        const index =
            ((requestedIndex % images.length) + images.length) % images.length;

        const selected = images[index];

        if (!selected || !isSafeImageURL(selected.src)) {
            return;
        }

        const imageElement = gallery.querySelector(IMAGE_SELECTOR);
        const counter = gallery.querySelector(COUNTER_SELECTOR);
        const caption = gallery.querySelector("[data-gallery-caption]");
        const thumbnails = gallery.querySelectorAll(
            "[data-gallery-thumbnail]"
        );

        if (!imageElement) {
            return;
        }

        gallery.setAttribute("data-gallery-index", String(index));

        imageElement.src = selected.src;
        imageElement.alt = selected.alt || "Project screenshot";

        if (caption) {
            caption.textContent = selected.alt || "Project screenshot";
        }

        if (counter) {
            counter.textContent =
                `${String(index + 1).padStart(2, "0")} / ` +
                `${String(images.length).padStart(2, "0")}`;
        }

        thumbnails.forEach(function (thumbnail, thumbnailIndex) {
            const isActive = thumbnailIndex === index;

            thumbnail.classList.toggle("is-active", isActive);
            thumbnail.setAttribute("aria-pressed", String(isActive));
        });
    }

    /**
     * Attach delegated controls to the project dialog.
     * Delegation continues to work when project details are replaced.
     */
    function init() {
        const dialog = document.getElementById("projectDialog");

        if (!dialog || dialog.dataset.galleryInitialized === "true") {
            return;
        }

        dialog.dataset.galleryInitialized = "true";

        dialog.addEventListener("click", function (event) {
            const thumbnail = event.target.closest(
                "[data-gallery-thumbnail]"
            );

            if (thumbnail && dialog.contains(thumbnail)) {
                const gallery = thumbnail.closest(GALLERY_SELECTOR);
                const index = Number(
                    thumbnail.getAttribute("data-gallery-thumbnail")
                );

                if (gallery && Number.isInteger(index)) {
                    showImage(gallery, index);
                }

                return;
            }

            const control = event.target.closest(
                "[data-gallery-action]"
            );

            if (!control || !dialog.contains(control)) {
                return;
            }

            const gallery = control.closest(GALLERY_SELECTOR);

            if (!gallery) {
                return;
            }

            const currentIndex = Number(
                gallery.getAttribute("data-gallery-index") || 0
            );

            const action = control.getAttribute("data-gallery-action");

            if (action === "previous") {
                showImage(gallery, currentIndex - 1);
            } else if (action === "next") {
                showImage(gallery, currentIndex + 1);
            }
        });

        dialog.addEventListener("keydown", function (event) {
            if (!dialog.open) {
                return;
            }

            const gallery = event.target.closest(GALLERY_SELECTOR);

            if (!gallery) {
                return;
            }

            // Do not intercept arrow keys while navigating thumbnails
            // or interacting with other controls.
            if (
                event.target.closest("button, input, textarea, select")
            ) {
                return;
            }

            const currentIndex = Number(
                gallery.getAttribute("data-gallery-index") || 0
            );

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                showImage(gallery, currentIndex - 1);
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                showImage(gallery, currentIndex + 1);
            }
        });
    }

    /**
     * Public gallery API used by main.js.
     */
    window.PortfolioGallery = {
        render: render,
        getImages: getImages,
        showImage: showImage,
        init: init
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
