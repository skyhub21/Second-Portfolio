
/**
 * ANCIENT SIGNAL
 * Main Portfolio Controller
 *
 * Connects:
 * - Project data and dynamic project cards
 * - Project search and category filters
 * - Project details dialog
 * - Project gallery
 * - Motion preference toggle
 * - Contact form feedback
 * - Footer year
 */

(function () {
    "use strict";

    const PROJECTS = () => window.PORTFOLIO_PROJECTS || [];

    const CATEGORY_LABELS = {
        all: "All signals",
        web: "Web systems",
        business: "Business systems",
        desktop: "Desktop applications",
        mobile: "Mobile applications",
        other: "Other projects"
    };

    const elements = {};

    let activeCategory = "all";
    let searchQuery = "";

    /**
     * Cache page elements.
     */
    function cacheElements() {
        elements.projectsGrid = document.getElementById("projectsGrid");
        elements.projectFilters = document.getElementById("projectFilters");
        elements.projectSearch = document.getElementById("projectSearch");
        elements.projectCount = document.getElementById("projectCount");
        elements.projectCountLabel = document.getElementById("projectCountLabel");
        elements.projectsLoading = document.getElementById("projectsLoading");
        elements.projectsEmpty = document.getElementById("projectsEmpty");

        elements.projectDialog = document.getElementById("projectDialog");
        elements.projectDialogBody = document.getElementById("projectDialogBody");
        elements.closeProjectDialog = document.getElementById("closeProjectDialog");

        elements.motionToggle = document.getElementById("motionToggle");

        elements.contactForm = document.getElementById("quickMessageForm");
        elements.senderEmail = document.getElementById("senderEmail");
        elements.messageSubject = document.getElementById("messageSubject");
        elements.messageText = document.getElementById("messageText");
        elements.formFeedback = document.getElementById("formFeedback");

        elements.currentYear = document.getElementById("currentYear");
    }

    /**
     * Escape strings before inserting them into HTML.
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
     * Convert a URL into a safe clickable HTTP(S) URL.
     */
    function safeExternalURL(value) {
        if (typeof value !== "string" || !value.trim()) {
            return "";
        }

        try {
            const url = new URL(value.trim());

            if (url.protocol === "https:" || url.protocol === "http:") {
                return url.href;
            }
        } catch {
            return "";
        }

        return "";
    }

    /**
     * Convert project categories into readable labels.
     */
    function categoryLabel(category) {
        return CATEGORY_LABELS[category] || "Other projects";
    }

    /**
     * Return an icon-free, text-based visual placeholder.
     * Project screenshots are supplied separately through project data.
     */
    function projectVisual(project) {
        const cover = project.coverImage;

        if (cover && window.PortfolioGallery) {
            const images = window.PortfolioGallery.getImages(project);

            if (images.length > 0) {
                return `
                    <div class="project-card__visual">
                        <img
                            src="${escapeHTML(images[0].src)}"
                            alt="${escapeHTML(project.title)} preview"
                            loading="lazy"
                            decoding="async"
                        >
                        <span class="project-card__visual-label">
                            PROJECT RECORD
                        </span>
                    </div>
                `;
            }
        }

        return `
            <div class="project-card__visual project-card__visual--placeholder"
                 aria-hidden="true">
                <span class="project-card__sigil">◇</span>
                <span class="project-card__visual-label">
                    ARCHIVE ENTRY
                </span>
            </div>
        `;
    }

    /**
     * Build one project card.
     */
    function renderProjectCard(project) {
        const title = escapeHTML(project.title || "Untitled project");
        const subtitle = escapeHTML(project.subtitle || "");
        const summary = escapeHTML(project.summary || "");
        const category = escapeHTML(categoryLabel(project.category));
        const status = escapeHTML(project.status || "Project archive");
        const technologies = Array.isArray(project.technologies)
            ? project.technologies
            : [];

        const visibleTechnologies = technologies.slice(0, 4);

        return `
            <article class="project-card"
                     data-project-card
                     data-project-id="${escapeHTML(project.id)}"
                     data-category="${escapeHTML(project.category || "other")}">

                ${projectVisual(project)}

                <div class="project-card__content">
                    <div class="project-card__meta">
                        <span class="project-card__category">${category}</span>
                        <span class="project-card__status">${status}</span>
                    </div>

                    <h3 class="project-card__title">${title}</h3>

                    ${
                        subtitle
                            ? `<p class="project-card__subtitle">${subtitle}</p>`
                            : ""
                    }

                    <p class="project-card__summary">${summary}</p>

                    <div class="project-card__technologies">
                        ${visibleTechnologies.map(function (technology) {
                            return `
                                <span class="technology-tag">
                                    ${escapeHTML(technology)}
                                </span>
                            `;
                        }).join("")}
                    </div>

                    <button
                        class="project-card__open"
                        type="button"
                        data-open-project="${escapeHTML(project.id)}"
                        aria-label="Explore ${title}"
                    >
                        Explore archive
                        <span aria-hidden="true">↗</span>
                    </button>
                </div>
            </article>
        `;
    }

    /**
     * Get unique categories from the available project data.
     */
    function getCategories() {
        const categories = [...new Set(
            PROJECTS()
                .map(project => project.category)
                .filter(Boolean)
        )];

        return ["all", ...categories];
    }

    /**
     * Render category filter controls.
     */
    function renderFilters() {
        if (!elements.projectFilters) {
            return;
        }

        elements.projectFilters.innerHTML = getCategories()
            .map(function (category) {
                const label = categoryLabel(category);
                const isActive = activeCategory === category;

                return `
                    <button
                        type="button"
                        class="project-filter${isActive ? " is-active" : ""}"
                        data-project-filter="${escapeHTML(category)}"
                        aria-pressed="${isActive}"
                    >
                        ${escapeHTML(label)}
                    </button>
                `;
            })
            .join("");
    }

    /**
     * Determine whether a project matches the current search and category.
     */
    function projectMatches(project) {
        const categoryMatches =
            activeCategory === "all" ||
            project.category === activeCategory;

        if (!categoryMatches) {
            return false;
        }

        if (!searchQuery) {
            return true;
        }

        const searchableContent = [
            project.title,
            project.subtitle,
            project.summary,
            project.purpose,
            project.description,
            project.category,
            ...(project.technologies || []),
            ...(project.features || [])
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return searchableContent.includes(searchQuery);
    }

    /**
     * Render all matching project cards.
     */
    function renderProjects() {
        if (!elements.projectsGrid) {
            return;
        }

        const matchingProjects = PROJECTS().filter(projectMatches);

        elements.projectsGrid.innerHTML = matchingProjects
            .map(renderProjectCard)
            .join("");

        if (elements.projectCount) {
            elements.projectCount.textContent = String(matchingProjects.length);
        }

        if (elements.projectCountLabel) {
            elements.projectCountLabel.textContent =
                matchingProjects.length === 1
                    ? "signal discovered"
                    : "signals discovered";
        }

        if (elements.projectsEmpty) {
            elements.projectsEmpty.hidden = matchingProjects.length > 0;

            if (matchingProjects.length === 0) {
                const message = elements.projectsEmpty.querySelector(
                    "[data-empty-message]"
                );

                if (message) {
                    message.textContent = searchQuery || activeCategory !== "all"
                        ? "No projects match your current search or filter."
                        : "The archive is currently empty.";
                }
            }
        }

        if (elements.projectsLoading) {
            elements.projectsLoading.hidden = true;
        }
    }

    /**
     * Render the project details dialog.
     */
    function renderProjectDetails(project) {
        const title = escapeHTML(project.title || "Untitled project");
        const subtitle = escapeHTML(project.subtitle || "");
        const summary = escapeHTML(project.summary || "");
        const purpose = escapeHTML(project.purpose || "");
        const description = escapeHTML(project.description || "");
        const category = escapeHTML(categoryLabel(project.category));
        const status = escapeHTML(project.status || "Project archive");
        const role = escapeHTML(project.role || "Developer");
        const year = escapeHTML(project.year || "");
        const technologies = Array.isArray(project.technologies)
            ? project.technologies
            : [];
        const features = Array.isArray(project.features)
            ? project.features
            : [];
        const challenges = Array.isArray(project.challenges)
            ? project.challenges
            : [];
        const lessons = Array.isArray(project.lessonsLearned)
            ? project.lessonsLearned
            : [];

        const githubURL = safeExternalURL(project.githubUrl);
        const liveURL = safeExternalURL(project.liveUrl);

        const galleryHTML = window.PortfolioGallery
            ? window.PortfolioGallery.render(project)
            : "";

        function renderList(items, emptyMessage) {
            if (items.length === 0) {
                return `<p class="project-detail__muted">${escapeHTML(emptyMessage)}</p>`;
            }

            return `
                <ul class="project-detail__list">
                    ${items.map(function (item) {
                        return `<li>${escapeHTML(item)}</li>`;
                    }).join("")}
                </ul>
            `;
        }

        elements.projectDialogBody.innerHTML = `
            <div class="project-detail">
                <header class="project-detail__header">
                    <div class="project-detail__eyebrow">
                        <span>${category}</span>
                        <span aria-hidden="true"> / </span>
                        <span>${status}</span>
                    </div>

                    <h2 class="project-detail__title" id="projectDialogTitle">
                        ${title}
                    </h2>

                    ${
                        subtitle
                            ? `<p class="project-detail__subtitle">${subtitle}</p>`
                            : ""
                    }

                    <p class="project-detail__summary">${summary}</p>

                    <div class="project-detail__actions">
                        ${
                            githubURL
                                ? `
                                    <a
                                        class="project-detail__link"
                                        href="${escapeHTML(githubURL)}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Source code ↗
                                    </a>
                                `
                                : ""
                        }

                        ${
                            liveURL
                                ? `
                                    <a
                                        class="project-detail__link"
                                        href="${escapeHTML(liveURL)}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Live project ↗
                                    </a>
                                `
                                : ""
                        }
                    </div>
                </header>

                ${galleryHTML}

                <div class="project-detail__body">
                    ${
                        purpose
                            ? `
                                <section class="project-detail__section">
                                    <h3>Purpose</h3>
                                    <p>${purpose}</p>
                                </section>
                            `
                            : ""
                    }

                    ${
                        description
                            ? `
                                <section class="project-detail__section">
                                    <h3>Overview</h3>
                                    <p>${description}</p>
                                </section>
                            `
                            : ""
                    }

                    <section class="project-detail__section">
                        <h3>System capabilities</h3>
                        ${renderList(features, "Project features have not been documented yet.")}
                    </section>

                    <section class="project-detail__section">
                        <h3>Technology codex</h3>

                        ${
                            technologies.length
                                ? `
                                    <div class="project-detail__technologies">
                                        ${technologies.map(function (technology) {
                                            return `
                                                <span class="technology-tag">
                                                    ${escapeHTML(technology)}
                                                </span>
                                            `;
                                        }).join("")}
                                    </div>
                                `
                                : `<p class="project-detail__muted">Technologies have not been listed yet.</p>`
                        }
                    </section>

                    ${
                        challenges.length
                            ? `
                                <section class="project-detail__section">
                                    <h3>Challenges encountered</h3>
                                    ${renderList(challenges, "")}
                                </section>
                            `
                            : ""
                    }

                    ${
                        lessons.length
                            ? `
                                <section class="project-detail__section">
                                    <h3>Lessons learned</h3>
                                    ${renderList(lessons, "")}
                                </section>
                            `
                            : ""
                    }

                    <footer class="project-detail__footer">
                        <span>Role: ${role}</span>
                        ${year ? `<span>Year: ${year}</span>` : ""}
                    </footer>
                </div>
            </div>
        `;

        elements.projectDialog.setAttribute(
            "aria-labelledby",
            "projectDialogTitle"
        );
    }

    /**
     * Open a project by its ID.
     */
    function openProject(projectId) {
        const project = window.getPortfolioProjectById
            ? window.getPortfolioProjectById(projectId)
            : PROJECTS().find(item => item.id === projectId);

        if (!project || !elements.projectDialog || !elements.projectDialogBody) {
            return;
        }

        renderProjectDetails(project);

        if (window.PortfolioGallery) {
            window.PortfolioGallery.init();
        }

        if (typeof elements.projectDialog.showModal === "function") {
            if (!elements.projectDialog.open) {
                elements.projectDialog.showModal();
            }
        } else {
            // Fallback for browsers without native dialog support.
            elements.projectDialog.setAttribute("open", "");
        }
    }

    /**
     * Close the project dialog.
     */
    function closeProjectDialog() {
        if (!elements.projectDialog) {
            return;
        }

        if (typeof elements.projectDialog.close === "function") {
            if (elements.projectDialog.open) {
                elements.projectDialog.close();
            }
        } else {
            elements.projectDialog.removeAttribute("open");
        }
    }

    /**
     * Set up project search.
     */
    function initProjectSearch() {
        if (!elements.projectSearch) {
            return;
        }

        elements.projectSearch.addEventListener("input", function (event) {
            searchQuery = event.target.value.trim().toLowerCase();
            renderProjects();
        });
    }

    /**
     * Set up category filtering and project opening.
     */
    function initProjectInteractions() {
        if (elements.projectFilters) {
            elements.projectFilters.addEventListener("click", function (event) {
                const filterButton = event.target.closest(
                    "[data-project-filter]"
                );

                if (!filterButton) {
                    return;
                }

                activeCategory = filterButton.getAttribute(
                    "data-project-filter"
                ) || "all";

                renderFilters();
                renderProjects();
            });
        }

        if (elements.projectsGrid) {
            elements.projectsGrid.addEventListener("click", function (event) {
                const openButton = event.target.closest("[data-open-project]");

                if (!openButton) {
                    return;
                }

                openProject(openButton.getAttribute("data-open-project"));
            });
        }

        if (elements.closeProjectDialog) {
            elements.closeProjectDialog.addEventListener(
                "click",
                closeProjectDialog
            );
        }

        if (elements.projectDialog) {
            // Close when clicking the dialog backdrop.
            elements.projectDialog.addEventListener("click", function (event) {
                if (event.target === elements.projectDialog) {
                    closeProjectDialog();
                }
            });

            // Native dialog handles Escape. This listener also supports
            // browsers where the dialog is using the fallback attribute.
            elements.projectDialog.addEventListener("keydown", function (event) {
                if (
                    event.key === "Escape" &&
                    !elements.projectDialog.close
                ) {
                    closeProjectDialog();
                }
            });
        }
    }

    /**
     * Respect the visitor's saved motion preference.
     */
    function initMotionToggle() {
        if (!elements.motionToggle) {
            return;
        }

        const storageKey = "ancientSignalReducedMotion";
        let reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        try {
            const savedPreference = localStorage.getItem(storageKey);

            if (savedPreference !== null) {
                reducedMotion = savedPreference === "true";
            }
        } catch {
            // Storage may be unavailable in private browsing.
        }

        applyMotionPreference(reducedMotion);

        elements.motionToggle.addEventListener("click", function () {
            reducedMotion = !reducedMotion;
            applyMotionPreference(reducedMotion);

            try {
                localStorage.setItem(storageKey, String(reducedMotion));
            } catch {
                // The preference remains active for this page session.
            }
        });
    }

    /**
     * Apply the motion preference to the document.
     */
    function applyMotionPreference(reducedMotion) {
        document.documentElement.classList.toggle(
            "reduce-motion",
            reducedMotion
        );

        document.documentElement.dataset.motion = reducedMotion
            ? "reduced"
            : "full";

        if (elements.motionToggle) {
            elements.motionToggle.setAttribute(
                "aria-pressed",
                String(reducedMotion)
            );

            elements.motionToggle.setAttribute(
                "aria-label",
                reducedMotion
                    ? "Enable decorative motion"
                    : "Reduce decorative motion"
            );

            const label = elements.motionToggle.querySelector(
                "[data-motion-label]"
            );

            if (label) {
                label.textContent = reducedMotion
                    ? "Motion reduced"
                    : "Motion enabled";
            }
        }
    }

    /**
     * Contact form helper.
     *
     * This is a mailto-based form, not a server submission.
     * It opens the visitor's configured email application.
     */
    function initContactForm() {
        if (!elements.contactForm) {
            return;
        }

        elements.contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const senderEmail = elements.senderEmail?.value.trim() || "";
            const subject = elements.messageSubject?.value.trim() || "";
            const message = elements.messageText?.value.trim() || "";

            if (!senderEmail || !subject || !message) {
                showFormFeedback(
                    "Please complete all fields before transmitting your message.",
                    "error"
                );
                return;
            }

            if (
                elements.senderEmail &&
                !elements.senderEmail.checkValidity()
            ) {
                showFormFeedback(
                    "Please enter a valid email address.",
                    "error"
                );
                elements.senderEmail.focus();
                return;
            }

            // Keep this destination aligned with the email address in index.html.
            const portfolioEmail = "lindokuhle@gmail.com";

            const emailSubject = encodeURIComponent(subject);
            const emailBody = encodeURIComponent(
                `From: ${senderEmail}\n\n${message}`
            );

            const mailtoURL =
                `mailto:${portfolioEmail}` +
                `?subject=${emailSubject}&body=${emailBody}`;

            showFormFeedback(
                "Your email application should open with the message prepared. Send it there to complete delivery.",
                "success"
            );

            window.location.href = mailtoURL;
        });
    }

    /**
     * Display contact form feedback.
     */
    function showFormFeedback(message, type) {
        if (!elements.formFeedback) {
            return;
        }

        elements.formFeedback.textContent = message;
        elements.formFeedback.hidden = false;
        elements.formFeedback.dataset.state = type;
        elements.formFeedback.setAttribute("role", "status");
        elements.formFeedback.setAttribute("aria-live", "polite");
    }

    /**
     * Update the footer year.
     */
    function initFooterYear() {
        if (elements.currentYear) {
            elements.currentYear.textContent = String(
                new Date().getFullYear()
            );
        }
    }

    /**
     * Initialize the portfolio.
     */
    function init() {
        cacheElements();

        renderFilters();
        renderProjects();

        initProjectSearch();
        initProjectInteractions();
        initMotionToggle();
        initContactForm();
        initFooterYear();

        if (window.PortfolioGallery) {
            window.PortfolioGallery.init();
        }

        document.documentElement.classList.add("js-ready");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    // Expose selected functions for debugging and future enhancements.
    window.AncientSignal = {
        renderProjects: renderProjects,
        renderFilters: renderFilters,
        openProject: openProject,
        closeProjectDialog: closeProjectDialog
    };
})();
