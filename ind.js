/* =========================================
   FITZONE - INTERACTIVE JAVASCRIPT
========================================= */

document.documentElement.classList.add("js-enabled");

document.addEventListener("DOMContentLoaded", () => {

    const preloader = document.getElementById("preloader");
    const header = document.getElementById("header");
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");
    const backToTop = document.getElementById("backToTop");
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");
    const programSelect = document.getElementById("program");

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    let menuOpen = false;

    /* PRELOADER */

    const hidePreloader = () => {
        if (preloader) {
            preloader.classList.add("loaded");
        }
    };

    if (document.readyState === "complete") {
        hidePreloader();
    } else {
        window.addEventListener("load", hidePreloader, {
            once: true
        });

        // Keep the page usable if an external image loads slowly.
        window.setTimeout(hidePreloader, 2500);
    }

    /* MOBILE NAVIGATION */

    function closeMenu() {
        menuOpen = false;

        navMenu.classList.remove("open");
        menuToggle.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    }

    function openMenu() {
        menuOpen = true;

        navMenu.classList.add("open");
        menuToggle.classList.add("active");

        menuToggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("menu-open");
    }

    menuToggle.addEventListener("click", () => {
        if (menuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMenu();
        });
    });

    // Close when clicking the CTA inside the mobile menu.
    const navCta = document.querySelector(".nav-cta");

    if (navCta) {
        navCta.addEventListener("click", closeMenu);
    }

    // Close the menu with Escape.
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuOpen) {
            closeMenu();
            menuToggle.focus();
        }
    });

    // Reset mobile menu state when switching to desktop width.
    window.addEventListener("resize", () => {
        if (window.innerWidth > 780 && menuOpen) {
            closeMenu();
        }
    });

    /* HEADER AND BACK-TO-TOP */

    function handleScroll() {
        const scrollY = window.scrollY;

        header.classList.toggle("scrolled", scrollY > 40);
        backToTop.classList.toggle("visible", scrollY > 450);
    }

    window.addEventListener("scroll", handleScroll, {
        passive: true
    });

    handleScroll();

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: reducedMotion ? "auto" : "smooth"
        });
    });

    /* SCROLL REVEAL */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && !reducedMotion) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach((element) => {
            element.classList.add("visible");
        });

    }

    /* ANIMATED STATISTICS */

    const counters = document.querySelectorAll(".counter");

    function animateCounter(counter) {

        const target = Number(counter.dataset.target);

        if (!Number.isFinite(target)) {
            return;
        }

        if (reducedMotion) {
            counter.textContent = String(target);
            return;
        }

        const duration = 1500;
        const startTime = performance.now();

        function updateCounter(currentTime) {

            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            // Ease-out animation.
            const easedProgress = 1 - Math.pow(1 - progress, 4);

            const currentValue = Math.floor(
                target * easedProgress
            );

            counter.textContent = String(currentValue);

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = String(target);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    if ("IntersectionObserver" in window) {

        const counterObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.5
            }
        );

        counters.forEach((counter) => {
            counterObserver.observe(counter);
        });

    } else {

        counters.forEach(animateCounter);

    }

    /* ACTIVE NAVIGATION LINK */

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const sectionId = entry.target.id;

                    navLinks.forEach((link) => {

                        const isActive =
                            link.getAttribute("href") === `#${sectionId}`;

                        link.classList.toggle("active", isActive);

                    });

                });

            },
            {
                rootMargin: "-30% 0px -60% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });

    }

    /* PROGRAM CARD SELECTION */

    const programLinks = document.querySelectorAll("[data-program]");

    programLinks.forEach((link) => {

        link.addEventListener("click", () => {

            const selectedProgram = link.dataset.program;

            if (programSelect && selectedProgram) {
                programSelect.value = selectedProgram;
            }

        });

    });

    /* CONTACT FORM VALIDATION */

    contactForm.addEventListener("submit", (event) => {

        event.preventDefault();

        formStatus.textContent = "";
        formStatus.className = "form-status";

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const formData = new FormData(contactForm);

        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const program = String(formData.get("program") || "").trim();
        const message = String(formData.get("message") || "").trim();

        if (!name || !email || !program || !message) {

            formStatus.textContent =
                "Please complete all fields before submitting.";

            formStatus.classList.add("error");

            return;
        }

        /*
          This is a frontend demo.

          No email or database submission happens until
          a real backend or form service is connected.
        */

        formStatus.textContent =
            "Your form is valid! This demo is not connected to a submission service yet.";

        formStatus.classList.add("success");

    });

    /* CURRENT YEAR */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = String(new Date().getFullYear());
    }

});