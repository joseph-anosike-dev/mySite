/* =============================================================
   PERSONAL BUSINESS DEVELOPMENT WEBSITE
   =============================================================

   This JavaScript file deliberately uses vanilla JavaScript.

   No:
   - React
   - Vue
   - jQuery
   - GSAP
   - Anime.js
   - external libraries

   The purpose is to demonstrate that modern interaction does
   not require a framework.

   ============================================================= */


/* =============================================================
   1. SELECT IMPORTANT ELEMENTS
   ============================================================= */

/*
    querySelector() returns the first matching element.

    querySelectorAll() returns a NodeList containing every
    matching element.
*/

const header = document.querySelector(".site-header");

const menuToggle = document.querySelector(".menu-toggle");

const navLinks = document.querySelector(".nav-links");

const navItems = document.querySelectorAll(".nav-links a");

const revealElements =
    document.querySelectorAll(".reveal");

const yearElement =
    document.querySelector("#year");


/* =============================================================
   2. AUTOMATICALLY UPDATE THE COPYRIGHT YEAR
   ============================================================= */

/*
    JavaScript's Date object gets the user's current year.

    This means you don't have to manually change:

        © 2026

    every year.
*/

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


/* =============================================================
   3. HEADER SCROLL EFFECT
   ============================================================= */

/*
    We don't need to continuously change complicated styles.

    Instead, we simply add/remove a CSS class.

    CSS handles the visual transition.

    This is a useful pattern:

        JavaScript = behavior
        CSS        = presentation
*/

function handleHeaderScroll() {

    if (window.scrollY > 40) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

}


/*
    "passive: true" tells the browser that this event listener
    won't call preventDefault().

    This can help scrolling performance.
*/

window.addEventListener(
    "scroll",
    handleHeaderScroll,
    { passive: true }
);


/*
    Run it once immediately so the correct state exists if
    the page is loaded while already scrolled.
*/

handleHeaderScroll();


/* =============================================================
   4. MOBILE NAVIGATION
   ============================================================= */

function toggleMenu() {

    const isOpen =
        navLinks.classList.toggle("open");

    /*
        aria-expanded tells screen readers whether the menu
        is currently open.
    */

    menuToggle.setAttribute(
        "aria-expanded",
        isOpen
    );


    menuToggle.setAttribute(
        "aria-label",
        isOpen
            ? "Close navigation"
            : "Open navigation"
    );

}


/*
    Only attach the listener if the button exists.
*/

if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        toggleMenu
    );

}


/* =============================================================
   5. CLOSE MOBILE MENU WHEN A LINK IS CLICKED
   ============================================================= */

navItems.forEach(function (link) {

    link.addEventListener("click", function () {

        navLinks.classList.remove("open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Open navigation"
        );

    });

});


/* =============================================================
   6. SCROLL REVEAL
   ============================================================= */

/*
    IntersectionObserver is a browser API designed to detect
    when an element enters or leaves the viewport.

    Instead of asking JavaScript:

        "Are we 400px down the page?"

    every frame, we let the browser tell us when an element
    becomes visible.

    This is much cleaner and more efficient.
*/

const revealObserver =
    new IntersectionObserver(

        function (entries, observer) {

            entries.forEach(function (entry) {

                /*
                    If the element isn't visible yet,
                    do nothing.
                */

                if (!entry.isIntersecting) {
                    return;
                }


                /*
                    Add the CSS class that triggers the
                    reveal animation.
                */

                entry.target.classList.add("visible");


                /*
                    We only need to reveal each element once.

                    After it becomes visible, stop observing it.
                */

                observer.unobserve(
                    entry.target
                );

            });

        },

        {
            /*
                Start the animation slightly before the
                element reaches the center of the viewport.
            */

            threshold: 0.12,

            rootMargin:
                "0px 0px -40px 0px"
        }

    );


/*
    Tell the observer to watch every .reveal element.
*/

revealElements.forEach(function (element) {

    revealObserver.observe(element);

});


/* =============================================================
   7. STAGGERED ANIMATIONS
   ============================================================= */

/*
    Elements that share the same parent can be given slightly
    different transition delays.

    This creates a cascading effect instead of every element
    appearing at exactly the same time.
*/

const revealGroups =
    document.querySelectorAll(
        ".capability-list, .process, .work-grid"
    );


revealGroups.forEach(function (group) {

    const children =
        group.querySelectorAll(".reveal");


    children.forEach(function (child, index) {

        child.style.transitionDelay =
            `${index * 80}ms`;

    });

});


/* =============================================================
   8. CUSTOM CURSOR
   ============================================================= */

/*
    The cursor is deliberately restrained.

    There are two pieces:

        cursor-dot
        cursor-ring

    The dot follows immediately.

    The ring follows with a small amount of smoothing.
*/

const cursorDot =
    document.querySelector(".cursor-dot");

const cursorRing =
    document.querySelector(".cursor-ring");


/*
    We track the desired cursor position.

    The actual ring position will gradually approach it.
*/

let mouseX = 0;
let mouseY = 0;

let ringX = 0;
let ringY = 0;


/*
    Listen for mouse movement.
*/

window.addEventListener(
    "mousemove",
    function (event) {

        mouseX = event.clientX;
        mouseY = event.clientY;


        /*
            The small dot doesn't need smoothing.
        */

        if (cursorDot) {

            cursorDot.style.transform =
                `translate3d(
                    ${mouseX}px,
                    ${mouseY}px,
                    0
                )`;

        }

    }
);


/*
    This animation loop creates the smooth trailing ring.

    requestAnimationFrame() asks the browser to run the
    animation at the appropriate rendering frequency.
*/

function animateCursor() {

    /*
        Linear interpolation.

        Instead of instantly moving the ring to the cursor,
        move it 15% of the remaining distance each frame.

        This creates the smooth trailing effect.
    */

    ringX +=
        (mouseX - ringX) * 0.15;

    ringY +=
        (mouseY - ringY) * 0.15;


    if (cursorRing) {

        cursorRing.style.transform =
            `translate3d(
                ${ringX}px,
                ${ringY}px,
                0
            )`;

    }


    requestAnimationFrame(
        animateCursor
    );

}


/*
    Start the animation loop.
*/

animateCursor();


/* =============================================================
   9. CURSOR INTERACTION WITH LINKS
   ============================================================= */

/*
    When the cursor is over an interactive element, expand
    the ring slightly.

    This gives the interface a subtle responsive quality.
*/

const interactiveElements =
    document.querySelectorAll(
        "a, button"
    );


interactiveElements.forEach(function (element) {

    element.addEventListener(
        "mouseenter",
        function () {

            if (cursorRing) {

                cursorRing.classList.add(
                    "cursor-hover"
                );

            }

        }
    );


    element.addEventListener(
        "mouseleave",
        function () {

            if (cursorRing) {

                cursorRing.classList.remove(
                    "cursor-hover"
                );

            }

        }
    );

});


/* =============================================================
   10. SIMPLE PARALLAX EFFECT
   ============================================================= */

/*
    The hero visual moves slightly as the user scrolls.

    This is intentionally subtle.

    A portfolio site should feel alive without feeling like
    an animation demo.
*/

const heroVisual =
    document.querySelector(".hero-visual");


function handleParallax() {

    if (!heroVisual) {
        return;
    }


    /*
        Don't perform the effect on narrow screens.

        Mobile devices should prioritize battery and simplicity.
    */

    if (window.innerWidth <= 700) {

        heroVisual.style.transform =
            "translate3d(0, 0, 0)";

        return;

    }


    const movement =
        window.scrollY * 0.08;


    heroVisual.style.transform =
        `translate3d(
            0,
            ${movement}px,
            0
        )`;

}


window.addEventListener(
    "scroll",
    handleParallax,
    { passive: true }
);


/* =============================================================
   11. KEYBOARD ESCAPE FOR MOBILE MENU
   ============================================================= */

/*
    This is a small accessibility improvement.

    If someone opens the mobile menu and presses Escape,
    close it.
*/

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {
            return;
        }


        if (
            navLinks &&
            navLinks.classList.contains("open")
        ) {

            navLinks.classList.remove("open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation"
            );

        }

    }
);


const params = newURLSearchParams(window.location.search);
const project = params.get('project');
if (project) document.queryselector('h2').innerText = 'ACCESSING: ${project}';

/* =============================================================
   END
   ============================================================= */