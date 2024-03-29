"use strict";
(function () {
    function DisplayEventsPlanningPage() {
        console.log("Called DisplayEventsPlanningPage()");
    }
    function DisplayStatisticsPage() {
        console.log("Called DisplayStatisticsPage()");
        fetch('./data/statistics.json')
            .then(response => response.json())
            .then(data => {
            console.log(data);
            const labels = data.labels;
            const values = data.values;
            const ctx = document.getElementById('statistics-chart');
            if (ctx) {
                console.log(ctx);
                const chart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                                label: 'Statistics',
                                data: values,
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1
                            }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                        }
                    }
                });
                chart.render();
            }
        })
            .catch(error => {
            console.error('Error fetching statistical data:', error);
        });
    }
    function handleLogin() {
        LoadHeaderLinks(document.title);
    }
    function handleLogout() {
        localStorage.removeItem("userInfo");
        LoadHeaderLinks(document.title);
        window.location.href = "login";
    }
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", handleLogout);
    }
    function showRegistrationSuccess(username) {
        alert(`Registration successful! Welcome, ${username}!`);
        LoadLink("login");
    }
    function showRegistrationError(errorMessage) {
        alert(errorMessage);
    }
    function showWelcomeMessage(username) {
        const loginFeedback = document.getElementById("login-feedback");
        if (loginFeedback) {
            loginFeedback.textContent = `Welcome, ${username}!`;
            loginFeedback.classList.remove("text-danger");
            loginFeedback.classList.add("text-success");
        }
        window.location.href = "index.html";
        handleLogin();
    }
    function showLoginError(errorMessage) {
        const loginFeedback = document.getElementById("login-feedback");
        if (loginFeedback) {
            loginFeedback.textContent = errorMessage;
            loginFeedback.classList.remove("text-success");
            loginFeedback.classList.add("text-danger");
        }
    }
    function isAuthenticated() {
        const authenticated = localStorage.getItem("authenticated");
        return authenticated === 'true';
    }
    function setAuthenticated(authenticated) {
        if (authenticated) {
            localStorage.setItem("authenticated", 'true');
        }
        else {
            localStorage.removeItem('authenticated');
        }
    }
    function checkAuthenticated() {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            const { username } = JSON.parse(userInfo);
            showWelcomeMessage(username);
        }
    }
    function loadContactForm() {
        const form = document.getElementById("contact-form");
        form.addEventListener('submit', event => {
            event.preventDefault();
            if (!form.checkValidity()) {
                event.stopPropagation();
                form.classList.add('was-validated');
                return;
            }
            console.log('Form is valid. Proceeding with submission.');
            const firstNameInput = document.getElementById('firstName');
            const lastNameInput = document.getElementById('lastName');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            const addressInput = document.getElementById("address");
            const phoneInput = document.getElementById("phone");
            if (firstNameInput.value === '') {
                setCustomValidityAndDisplayError(firstNameInput, 'Please enter your first name.');
                return;
            }
            if (lastNameInput.value === '') {
                setCustomValidityAndDisplayError(lastNameInput, 'Please enter your last name.');
                return;
            }
            if (addressInput.value === '') {
                setCustomValidityAndDisplayError(addressInput, 'Please enter a valid address.');
                return;
            }
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/;
            if (!emailRegex.test(emailInput.value)) {
                setCustomValidityAndDisplayError(emailInput, 'Please enter a valid email address.');
                return;
            }
            clearCustomValidity(firstNameInput);
            const element = document.getElementById('form-modal');
            const modalBody = document.getElementById("form-modal-body");
            const contact = new Contact(firstNameInput.value.trim(), lastNameInput.value.trim(), emailInput.value.trim(), subjectInput.value.trim(), messageInput.value.trim(), addressInput.value.trim(), phoneInput.value.trim());
            contact.toFormModalBody().forEach((element) => modalBody?.appendChild(element));
            if (element) {
                const modal = new bootstrap.Modal(element, {});
                modal.show();
            }
        });
    }
    function setCustomValidityAndDisplayError(inputElement, message) {
        inputElement.setCustomValidity(message);
        const feedbackElement = inputElement.parentElement?.querySelector('.invalid-feedback');
        feedbackElement.textContent = message;
    }
    function clearCustomValidity(inputElement) {
        inputElement.setCustomValidity('');
        const feedbackElement = inputElement.parentElement?.querySelector('.invalid-feedback');
        feedbackElement.textContent = '';
    }
    const apiKey = '627ed0f3b2e8432b8670d2b8d7d2f6a5';
    const newsEndpoint = 'https://newsapi.org/v2/top-headlines';
    async function fetchNews() {
        try {
            const response = await fetch(`${newsEndpoint}?country=us&apiKey=${apiKey}`);
            if (!response.ok) {
                throw new Error(`Error fetching news: ${response.statusText}`);
            }
            const data = await response.json();
            const newsContainer = document.getElementById('news-container');
            if (newsContainer) {
                newsContainer.innerHTML = '';
                data.articles.slice(0, 3).forEach((article) => {
                    const newsItem = `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <img src="${article.urlToImage}" class="card-img-top" alt="${article.title}">
                            <div class="card-body">
                                <h5 class="card-title">${article.title}</h5>
                                <p class="card-text">${article.description}</p>
                                <a href="${article.url}" class="btn btn-primary" target="_blank">Read More</a>
                            </div>
                        </div>
                    </div>
                `;
                    if (newsContainer) {
                        newsContainer.innerHTML += newsItem;
                    }
                });
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    document.addEventListener('DOMContentLoaded', async () => {
        await fetchNews();
    });
    function LoadLink(link, data = "") {
        router.ActiveLink = link;
        router.LinkData = data;
        history.pushState({}, "", router.ActiveLink);
        document.title = capitalizeFirstCharacter(router.ActiveLink);
        $("ul>li>a").each(function () {
            $(this).removeClass("active");
        });
        $(`li > a:contains(${document.title})`).addClass("active");
        LoadContent();
    }
    function DisplayHomePage() {
        console.log("Called DisplayHomePage()");
    }
    function DisplayPortfolioPage() {
        console.log("Called DisplayPortfolioPage()");
        const element = document.getElementById("projects-load-more-btn");
        element?.addEventListener("click", () => {
            LoadProjects();
        });
        LoadProjects();
    }
    function DisplayServicesPage() {
        console.log("Called DisplayServicesPage()");
    }
    function DisplayTeamPage() {
        console.log("Called DisplayTeamPage()");
    }
    function DisplayBlogPage() {
        console.log("Called DisplayBlogPage()");
        const searchButton = document.getElementById("search-button");
        searchButton?.addEventListener("click", () => {
            const searchInput = document.getElementById("search-input");
            const searchTerm = searchInput.value.trim();
            loadBlogs(searchTerm);
        });
        loadBlogs("");
    }
    loadBlogs("search term");
    function loadBlogs(search) {
        console.log(`load blogs called with ${search}`);
        const jsonFilePath = 'data/blog.json';
        const container = $('#blog-posts-container');
        container.empty();
        $.ajax({
            url: jsonFilePath,
            dataType: 'json',
            success: function (data) {
                $.each(data, function (index, post) {
                    if (!search ||
                        post.title.toLowerCase().includes(search.toLowerCase()) ||
                        post.author.toLowerCase().includes(search.toLowerCase())) {
                        const postHtml = `
                        <article class="blog-post">
                            <h2 class="display-5 link-body-emphasis mb-1">${post.title}</h2>
                            <p class="blog-post-meta">${post.date} by <a href="#">${post.author}</a></p>
                            ${post.content}
                            <hr>
                        </article>
                    `;
                        container.append(postHtml);
                    }
                });
            },
            error: function (error) {
                console.error('Error loading blog posts:', error);
            }
        });
    }
    function DisplayRegisterPage() {
        console.log("Called DisplayRegisterPage()");
        const anchor = document.getElementById('login-form');
        if (anchor) {
            anchor.addEventListener("click", () => {
                LoadLink('login');
            });
        }
        const registrationForm = document.getElementById("registration-form");
        if (registrationForm) {
            registrationForm.addEventListener("submit", function (event) {
                event.preventDefault();
                const usernameInput = document.getElementById("reg-username");
                const passwordInput = document.getElementById("reg-password");
                const confirmPasswordInput = document.getElementById("confirm-password");
                const username = usernameInput.value.trim();
                const password = passwordInput.value.trim();
                const confirmPassword = confirmPasswordInput.value.trim();
                if (password !== confirmPassword) {
                    showRegistrationError("Passwords do not match. Please try again.");
                    return;
                }
                const userInfo = { username, password };
                localStorage.setItem('login', JSON.stringify(userInfo));
                showRegistrationSuccess(username);
            });
        }
    }
    function DisplayEventsPage() {
        console.log("Called DisplayEventsPage()");
        loadEvents();
    }
    function loadEvents() {
        let jsonFilePath = 'data/events.json';
        console.log(jsonFilePath);
        $.ajax({
            url: jsonFilePath, dataType: 'json', success: function (data) {
                let container = $('#events-posts-container');
                $.each(data, function (index, event) {
                    let eventHtml = `
                        <div class="events-post">
                            <h2 class="display-5 link-body-emphasis mb-1">${event.title}</h2>
                            <p class="events-post-meta">${event.date} at ${event.time}</p>
                            ${event.description}
                            <hr>
                        </div>
                    `;
                    container.append(eventHtml);
                });
            }, error: function (error) {
                console.error('Error loading events posts:', error);
            }
        });
    }
    function DisplayGalleryPage() {
        console.log("Called DisplayGalleryPage()");
        LoadGalleryImages();
    }
    function DisplayContactPage() {
        console.log("Called DisplayContactPage()");
        loadContactForm();
    }
    function DisplayLoginPage() {
        console.log("Called DisplayLoginPage()");
        const anchor = document.getElementById('register-link');
        if (anchor) {
            anchor.addEventListener("click", () => {
                LoadLink('register');
            });
        }
        const loginForm = document.getElementById("login-form");
        if (loginForm) {
            loginForm.addEventListener("submit", function (event) {
                event.preventDefault();
                const usernameInput = document.getElementById("username");
                const passwordInput = document.getElementById("password");
                const username = usernameInput.value.trim();
                const password = passwordInput.value.trim();
                if (!username || !password) {
                    showLoginError("Please enter both username and password.");
                    return;
                }
                const userInfoString = localStorage.getItem('login');
                console.log(userInfoString);
                if (userInfoString) {
                    const userInfo = JSON.parse(userInfoString);
                    console.log(userInfo);
                    console.log(password);
                    if (userInfo.password === password) {
                        showWelcomeMessage(username);
                        setAuthenticated(true);
                    }
                    else {
                        showLoginError("Invalid username or password. Please try again.");
                    }
                }
                else {
                    showLoginError("User not found. Please register before logging in.");
                }
            });
            checkAuthenticated();
        }
    }
    function DisplayLogoutPage() {
        setAuthenticated(false);
        LoadLink('home');
        LoadHeaderLinks('Home');
    }
    function Display404Page() {
        console.log("Called Display404Page()");
    }
    function ActiveLinkCallBack() {
        switch (router.ActiveLink) {
            case "home":
                return DisplayHomePage;
            case "portfolio":
                return DisplayPortfolioPage;
            case "service":
                return DisplayServicesPage;
            case "team":
                return DisplayTeamPage;
            case "blog":
                return DisplayBlogPage;
            case "events":
                return DisplayEventsPage;
            case "events-planning":
                return DisplayEventsPage;
            case "gallery":
                return DisplayGalleryPage;
            case "register":
                return DisplayRegisterPage;
            case "login":
                return DisplayLoginPage;
            case "contact":
                return DisplayContactPage;
            case "statistics":
                return DisplayStatisticsPage;
            case "404":
                return Display404Page;
            default:
                console.error("ERROR callback does not exist " + router.ActiveLink);
                return new Function();
        }
    }
    function capitalizeFirstCharacter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function LoadHeader() {
        $.get("./views/components/header.html", (html_data) => {
            console.log(router.ActiveLink);
            $("#header-container").html(html_data);
            document.title = capitalizeFirstCharacter(router.ActiveLink);
            LoadHeaderLinks(document.title);
        });
    }
    function LoadHeaderLinks(selected) {
        const navigationLinks = document.getElementById("navigation-links");
        if (navigationLinks) {
            navigationLinks.innerHTML = '';
            navigationLinks.appendChild(LoadNavigationLink("home", "Home", selected === "Home", "home-nav"));
            navigationLinks.appendChild(LoadNavigationLink("portfolio", "Portfolio", selected === "Portfolio", "portfolio-nav"));
            navigationLinks.appendChild(LoadNavigationLink("services", "Services", selected === "Services", "services-nav"));
            navigationLinks.appendChild(LoadNavigationLink("team", "Team", selected === "Team", "team-nav"));
            navigationLinks.appendChild(LoadNavigationLink("blog", "Blog", selected === "Blog", "blog-nav"));
            navigationLinks.appendChild(LoadNavigationLink("events", "Events", selected === "Events", "events-nav"));
            if (isAuthenticated()) {
                navigationLinks.appendChild(LoadNavigationLink("events-planning", "Events Planning", selected === "Events Planning", "events-nav"));
            }
            navigationLinks.appendChild(LoadNavigationLink("gallery", "Gallery", selected === "Gallery", "gallery-nav"));
            if (isAuthenticated()) {
                navigationLinks.appendChild(LoadNavigationLink("statistics", "Statistics", selected === "Statistics", "statistics-nav"));
                navigationLinks.appendChild(LoadLogoutLink("Logout", "logout-btn"));
            }
            else {
                navigationLinks.appendChild(LoadNavigationLink("login", "Login", false, "login-btn"));
            }
        }
    }
    function LoadFooterLinks() {
        const footerLinks = document.getElementById("footer-links");
        if (footerLinks) {
            footerLinks.innerHTML = "";
            footerLinks.appendChild(LoadFooterLink("privacy-policy", "Privacy Policy"));
            footerLinks.appendChild(LoadFooterLink("terms", "Terms of Service"));
            footerLinks.appendChild(LoadFooterLink("contact", "Contact Us"));
        }
    }
    function LoadProjects() {
        const projectsContainer = document.getElementById("projects-container");
        const projects = [new Project("Tech for All", "image/project-1.jpg", "This inclusive initiative is designed to bridge " +
                "the digital divide, offering a range of technology resources and training for community members. From basic digital literacy classes to advanced tech workshops."),
            new Project("Green Harmony Garden", "image/project-2.jpg", "A serene haven where nature and sustainability intertwine seamlessly. " +
                "This eco-conscious oasis is a living testament to our commitment to environmental stewardship."),
            new Project("Code Connect", "image/project-3.jpg", "\"Code Connect\" Is a dynamic initiative aimed at making coding accessible to individuals of all ages and backgrounds. " +
                "Whether you're a curious beginner or looking to enhance your programming skills."),];
        projects.forEach((project) => projectsContainer?.appendChild(project.toCard()));
    }
    function LoadGalleryImages() {
        const galleryContainer = document.getElementById("gallery-container");
        const galleryImages = [
            new GalleryImage("Description 1", "image/gallery-1.jpg", "description after"),
            new GalleryImage("Description 2", "image/gallery-2.jpg", "description after"),
            new GalleryImage("Description 3", "image/gallery-3.jpg", "description after"),
        ];
        console.log(galleryImages);
        galleryImages.forEach((GalleryImage) => galleryContainer?.appendChild(GalleryImage.toCard()));
    }
    function LoadNavigationLink(href, text, selected, id) {
        const listItem = document.createElement("li");
        listItem.classList.add("nav-item");
        const anchor = document.createElement("a");
        anchor.id = id;
        anchor.classList.add("nav-link");
        anchor.setAttribute('data', href);
        anchor.addEventListener("click", () => {
            LoadLink(anchor.getAttribute('data') ?? "home");
        });
        anchor.addEventListener("mouseover", () => {
            $(anchor).css("cursor", "pointer");
        });
        if (selected) {
            anchor.classList.add("active");
            anchor.setAttribute("aria-current", "page");
        }
        const anchorText = document.createTextNode(text);
        anchor.appendChild(anchorText);
        listItem.appendChild(anchor);
        return listItem;
    }
    function LoadLogoutLink(text, id) {
        const listItem = document.createElement("li");
        listItem.classList.add("nav-item");
        const anchor = document.createElement("a");
        anchor.id = id;
        anchor.classList.add("nav-link");
        anchor.addEventListener("click", () => {
            DisplayLogoutPage();
        });
        anchor.addEventListener("mouseover", () => {
            $(anchor).css("cursor", "pointer");
        });
        const anchorText = document.createTextNode(text);
        anchor.appendChild(anchorText);
        listItem.appendChild(anchor);
        return listItem;
    }
    function LoadContent() {
        let page_name = router.ActiveLink;
        let callback = ActiveLinkCallBack();
        $.get(`./views/content/${page_name}.html`, function (html_data) {
            $("main").html(html_data);
            callback();
        });
    }
    function LoadFooter() {
        $.get("./views/components/footer.html", function (html_data) {
            $("#footer-container").html(html_data);
            LoadFooterLinks();
        });
    }
    function LoadFooterLink(href, text) {
        const listItem = document.createElement("li");
        listItem.classList.add("nav-item");
        const anchor = document.createElement("a");
        anchor.classList.add("nav-link", "px-2", "text-body-secondary");
        anchor.setAttribute('data', href);
        anchor.addEventListener("click", () => {
            LoadLink(anchor.getAttribute('data') ?? "home");
        });
        anchor.addEventListener("mouseover", () => {
            $(anchor).css("cursor", "pointer");
        });
        const anchorText = document.createTextNode(text);
        anchor.appendChild(anchorText);
        listItem.appendChild(anchor);
        return listItem;
    }
    function Start() {
        console.log("App Started");
        LoadHeader();
        LoadLink("home");
        LoadFooter();
        fetchNews();
    }
    window.addEventListener("load", Start);
})();
//# sourceMappingURL=app.js.map