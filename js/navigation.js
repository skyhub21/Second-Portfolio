
/*
 * ============================================================
 * ANCIENT SIGNAL PORTFOLIO
 * File: js/navigation.js
 * Purpose: Desktop and mobile section navigation.
 * ============================================================
 *
 * Navigation order:
 * 1. Home       — Signal
 * 2. About      — Origin
 * 3. Skills     — Codex
 * 4. Projects   — Archive
 * 5. Contact    — Transmission
 *
 * This script expects the section IDs and navigation data
 * attributes defined in index.html.
 */

"use strict";

(function () {
    const SECTION_IDS = [
        "home",
        "about",
        "skills",
        "projects",
        "contact"
    ];

    const SECTION_LABELS = {
        home: "Signal",
        about: "Origin",
        skills: "Codex",
        projects: "Archive",
        contact: "Transmission"
    };

    let sections = [];
    let desktopLinks = [];
    let mobileLinks = [];
    let observer = null;
    let scrollTicking = false;

    /**
     * Find all navigation elements and portfolio sections.
     */
    function collectElements() {
        sections = SECTION_IDS
            .map(function (id) {
                return document.getElementById(id);
            })
            .filter(Boolean);

        desktopLinks = Array.from(
            document.querySelectorAll(".sidebar [data-nav]")
        );

        mobileLinks = Array.from(
            document.querySelectorAll(".bottom-navigation [data-nav]")
        );
    }

    /**
     * Determine whether reduced motion is requested.
     */
    function prefersReducedMotion() {
        return window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
    }

    /**
     * Update active navigation links.
     */
    function setActiveSection(sectionId) {
        if (!SECTION_IDS.includes(sectionId)) {
            return;
        }

        desktopLinks.forEach(function (link) {
            const isActive = link.dataset.nav === sectionId;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        mobileLinks.forEach(function (link) {
            const isActive = link.dataset.nav === sectionId;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        document.body.dataset.activeSection = sectionId;
    }

    /**
     * Navigate to a portfolio section.
     */
    function navigateToSection(sectionId, options) {
        const target = document.getElementById(sectionId);

        if (!target || !SECTION_IDS.includes(sectionId)) {
            return;
        }

        const settings = options || {};
        const shouldUpdateHash = settings.updateHash !== false;

        target.scrollIntoView({
            behavior: prefersReducedMotion() ? "auto" : "smooth",
            block: "start"
        });

        setActiveSection(sectionId);

        if (shouldUpdateHash) {
            const newHash = "#" + sectionId;

            if (window.location.hash !== newHash) {
                window.history.pushState(null, "", newHash);
            }
        }
    }

    /**
     * Handle clicks on both desktop and mobile navigation.
     */
    function handleNavigationClick(event) {
        const link = event.target.closest("[data-nav]");

        if (!link) {
            return;
        }

        const sectionId = link.dataset.nav;

        if (!SECTION_IDS.includes(sectionId)) {
            return;
        }

        event.preventDefault();

        navigateToSection(sectionId);
    }

    /**
     * Set the active section based on which section is visible.
     */
    function setupIntersectionObserver() {
        if (!("IntersectionObserver" in window)) {
            window.addEventListener(
                "scroll",
                handleScrollFallback,
                { passive: true }
            );

            return;
        }

        observer = new IntersectionObserver(
            function (entries) {
                const visibleSections = entries
                    .filter(function (entry) {
                        return entry.isIntersecting;
                    })
                    .sort(function (a, b) {
                        return b.intersectionRatio -
                            a.intersectionRatio;
                    });

                if (visibleSections.length > 0) {
                    setActiveSection(
                        visibleSections[0].target.id
                    );
                }
            },
            {
                root: null,
                rootMargin: "-25% 0px -45% 0px",
                threshold: [0, 0.15, 0.3, 0.5, 0.75]
            }
        );

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    /**
     * Fallback for browsers without IntersectionObserver.
     * Scroll work is limited to one animation frame at a time.
     */
    function handleScrollFallback() {
        if (scrollTicking) {
            return;
        }

        scrollTicking = true;

        window.requestAnimationFrame(function () {
            const referenceLine = window.innerHeight * 0.4;
            let currentSection = sections[0];

            sections.forEach(function (section) {
                const rect = section.getBoundingClientRect();

                if (rect.top <= referenceLine) {
                    currentSection = section;
                }
            });

            if (currentSection) {
                setActiveSection(currentSection.id);
            }

            scrollTicking = false;
        });
    }

    /**
     * Handle browser back and forward navigation.
     */
    function handleHistoryChange() {
        const sectionId = window.location.hash.replace("#", "");

        if (SECTION_IDS.includes(sectionId)) {
            navigateToSection(sectionId, {
                updateHash: false
            });
        } else {
            setActiveSection("home");
        }
    }

    /**
     * Handle initial page load and direct section URLs.
     */
    function handleInitialNavigation() {
        const sectionId = window.location.hash.replace("#", "");

        if (SECTION_IDS.includes(sectionId)) {
            navigateToSection(sectionId, {
                updateHash: false
            });
        } else {
            setActiveSection("home");
        }
    }

    /**
     * Make the section label available for other scripts.
     */
    function getSectionLabel(sectionId) {
        return SECTION_LABELS[sectionId] || "";
    }

    /**
     * Initialise navigation once the DOM is ready.
     */
    function initNavigation() {
        collectElements();

        if (sections.length === 0) {
            console.warn(
                "Navigation: No portfolio sections were found."
            );
            return;
        }

        document.addEventListener(
            "click",
            handleNavigationClick
        );

        window.addEventListener(
            "popstate",
            handleHistoryChange
        );

        setupIntersectionObserver();
        handleInitialNavigation();

        // Expose small, reusable navigation helpers.
        window.PortfolioNavigation = {
            navigateToSection: navigateToSection,
            setActiveSection: setActiveSection,
            getSectionLabel: getSectionLabel,
            sectionIds: SECTION_IDS.slice()
        };
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initNavigation,
            { once: true }
        );
    } else {
        initNavigation();
    }
})();
