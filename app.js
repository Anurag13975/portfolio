(function () {
    const root = document.documentElement;
    const themeBtn = document.getElementById("theme-btn");
    const themeIcon = themeBtn.querySelector("i");

    function applyTheme(theme) {
        root.classList.toggle("light-mode", theme === "light");
        themeIcon.className = theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
    function readTheme() {
        try { return localStorage.getItem("theme"); } catch (e) { return null; }
    }
    function saveTheme(theme) {
        try { localStorage.setItem("theme", theme); } catch (e) { /* storage blocked */ }
    }
    applyTheme(readTheme() || "dark");
    themeBtn.addEventListener("click", () => {
        const next = root.classList.contains("light-mode") ? "dark" : "light";
        saveTheme(next);
        applyTheme(next);
    });

    const nav = document.getElementById("nav");
    const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");

    function setMenu(open) {
        navLinks.classList.toggle("open", open);
        menuBtn.setAttribute("aria-expanded", String(open));
        menuBtn.querySelector("i").className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
    }
    menuBtn.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
    navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));

    window.addEventListener("scroll", () => {
        nav.classList.toggle("scrolled", window.scrollY > 20);
    }, { passive: true });

    const links = [...document.querySelectorAll(".nav-link")];
    const spy = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
        });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(s => spy.observe(s));

    const reveal = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                reveal.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => reveal.observe(el));

    const typed = document.getElementById("typed");
    const roles = ["Software Engineer", "Full-Stack Developer", "Backend Engineer", "Problem Solver"];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
        typed.textContent = roles[0];
    } else {
        let roleIdx = 0, charIdx = 0, deleting = false;
        (function tick() {
            const word = roles[roleIdx];
            charIdx += deleting ? -1 : 1;
            typed.textContent = word.slice(0, charIdx);
            let delay = deleting ? 45 : 90;
            if (!deleting && charIdx === word.length) { deleting = true; delay = 1600; }
            else if (deleting && charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 300; }
            setTimeout(tick, delay);
        })();
    }

    document.getElementById("year").textContent = new Date().getFullYear();

    const scriptURL = "https://script.google.com/macros/s/AKfycbySqzOB6EUntzi8trUyjBMUeCv5lmUWQxNH_yvj7TcrabWMWVGzH2_SI-srdNffG3nN/exec";
    const form = document.forms["submit-to-google-sheet"];
    const msg = document.getElementById("msg");
    const submitBtn = form.querySelector(".submit-btn");
    const submitLabel = submitBtn.querySelector(".btn-label");

    function showMsg(text, type) {
        msg.textContent = text;
        msg.className = "form-msg " + type;
        setTimeout(() => { msg.textContent = ""; msg.className = "form-msg"; }, 5000);
    }

    form.addEventListener("submit", e => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitLabel.textContent = "Sending...";
        fetch(scriptURL, { method: "POST", body: new FormData(form) })
            .then(() => {
                showMsg("Message sent successfully. I'll get back to you soon!", "success");
                form.reset();
            })
            .catch(() => showMsg("Something went wrong. Please email me directly.", "error"))
            .finally(() => {
                submitBtn.disabled = false;
                submitLabel.textContent = "Send message";
            });
    });
})();
