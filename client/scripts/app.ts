"use strict";


(function () {
    function DisplayEventsPlanningPage() {
        console.log("Called DisplayEventsPlanningPage()");
    }

    function DisplayStatisticsPage() {
        console.log("Called DisplayStatisticsPage()");

    }



    // function handleLogin() {
    //     LoadHeaderLinks(document.title);
    // }


    // function handleLogout() {
    //     // Remove user information from local storage
    //     localStorage.removeItem("userInfo");
    //     LoadHeaderLinks(document.title);
    //     // Redirect to the login page
    //     window.location.href = "login";
    // }

    // const logoutBtn = document.getElementById("logout-btn");
    // if (logoutBtn) {
    //     logoutBtn.addEventListener("click", handleLogout);
    // }

    function showRegistrationSuccess(username: string) {

        alert(`Registration successful! Welcome, ${username}!`);
        LoadLink("login")
    }

    function showRegistrationError(errorMessage: string) {
        // Display registration error message
        alert(errorMessage);
        // You can add more handling here based on your application's needs
    }

    function showWelcomeMessage(username: string) {
        const loginFeedback = document.getElementById("login-feedback");
        if (loginFeedback) {
            loginFeedback.textContent = `Welcome, ${username}!`;
            loginFeedback.classList.remove("text-danger");
            loginFeedback.classList.add("text-success");
        }

        window.location.href = "index";

        // handleLogin();
    }

    function showLoginError(errorMessage: string) {
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

    function setAuthenticated(authenticated: boolean) {
        if (authenticated) {
            localStorage.setItem("authenticated", 'true');
        } else {
            localStorage.removeItem('authenticated');
        }
    }

    function checkAuthenticated() {
        const userInfo = localStorage.getItem("userInfo");

        if (userInfo) {
            const {username} = JSON.parse(userInfo);
            showWelcomeMessage(username);
        }
    }

    function loadContactForm(): void {
        const form = document.getElementById("contact-form") as HTMLFormElement;

        form.addEventListener('submit', event => {
            event.preventDefault();

            if (!form.checkValidity()) {
                event.stopPropagation();
                form.classList.add('was-validated');
                return;
            }

            console.log('Form is valid. Proceeding with submission.');

            const firstNameInput = document.getElementById('firstName') as HTMLInputElement;
            const lastNameInput = document.getElementById('lastName') as HTMLInputElement;
            const emailInput = document.getElementById('email') as HTMLInputElement;
            const subjectInput = document.getElementById('subject') as HTMLInputElement;
            const messageInput = document.getElementById('message') as HTMLInputElement;
            const addressInput = document.getElementById("address") as HTMLInputElement;
            const phoneInput = document.getElementById("phone") as HTMLInputElement;

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

            // Additional validation for phone number
            // const phoneRegex = /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/;
            // if (!phoneRegex.test(phoneInput.value)) {
            //     setCustomValidityAndDisplayError(phoneInput, 'Please enter a valid phone number.');
            //     return;
            // }

            clearCustomValidity(firstNameInput);

            const element = document.getElementById('form-modal');
            const modalBody = document.getElementById("form-modal-body");
            const contact = new Contact(
                firstNameInput.value.trim(),
                lastNameInput.value.trim(),
                emailInput.value.trim(),
                subjectInput.value.trim(),
                messageInput.value.trim(),
                addressInput.value.trim(),
                phoneInput.value.trim()
            );


            contact.toFormModalBody().forEach((element: HTMLElement) => modalBody?.appendChild(element));
            if (element) {
                const modal = new bootstrap.Modal(element, {});
                modal.show();
            }
        });
    }

    /**
     * Set custom validity and display error message for the input field
     * @param {HTMLInputElement} inputElement
     * @param {string} message
     */
    function setCustomValidityAndDisplayError(inputElement: HTMLInputElement, message: string): void {
        inputElement.setCustomValidity(message);
        const feedbackElement = inputElement.parentElement?.querySelector('.invalid-feedback') as HTMLElement;
        feedbackElement.textContent = message;
    }

    /**
     * Clear custom validity messages for the input field
     * @param {HTMLInputElement} inputElement
     */
    function clearCustomValidity(inputElement: HTMLInputElement): void {
        inputElement.setCustomValidity('');
        const feedbackElement = inputElement.parentElement?.querySelector('.invalid-feedback') as HTMLElement;
        feedbackElement.textContent = '';
    }


    const apiKey = '627ed0f3b2e8432b8670d2b8d7d2f6a5';
    const newsEndpoint = 'https://newsapi.org/v2/top-headlines';

    async function fetchNews(): Promise<void> {
        try {
            const response = await fetch(`${newsEndpoint}?country=us&apiKey=${apiKey}`);

            if (!response.ok) {
                throw new Error(`Error fetching news: ${response.statusText}`);
            }

            const data = await response.json();

            const newsContainer = document.getElementById('news-container');
            if (newsContainer) {
                newsContainer.innerHTML = '';

                data.articles.slice(0, 3).forEach((article: any) => {
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
        } catch (error) {
            console.error(error);
        }
    }

// Fetch news when the page loads
    document.addEventListener('DOMContentLoaded', async () => {
        await fetchNews();
    });


    /**
     * Update the application current active link, manages authentication and updates the browser history and page
     * it else updates navigation UI to reflect the current active link and loads the corresponding content
     * @param link
     * @param data
     * @returns {void}
     */
    function LoadLink(link: string, data: string = ""): void {
        router.ActiveLink = link;
        router.LinkData = data;

        history.pushState({}, "", router.ActiveLink);

        document.title = capitalizeFirstCharacter(router.ActiveLink);

        $("ul>li>a").each(function () {
            $(this).removeClass("active");
        });

        $(`li > a:contains(${document.title})`).addClass("active");

    }


    function DisplayHomePage() {
        console.log("Called DisplayHomePage()");

    }

    function DisplayPortfolioPage() {
        console.log("Called DisplayPortfolioPage()");
        const element = document.getElementById("projects-load-more-btn")
        element?.addEventListener("click", () => {
           // LoadProjects();
        });
       // LoadProjects();
    }

    function DisplayServicesPage() {
        console.log("Called DisplayServicesPage()");
    }

    function DisplayTeamPage() {
        console.log("Called DisplayTeamPage()");
    }

    function DisplayBlogPage(): void {
        console.log("Called DisplayBlogPage()");

        const searchButton: HTMLElement | null = document.getElementById("search-button");
        searchButton?.addEventListener("click", () => {
            const searchInput: HTMLInputElement | null = document.getElementById("search-input") as HTMLInputElement;
            const searchTerm: string = searchInput.value.trim();
            loadBlogs(searchTerm);
        });

        // Load blogs initially without any search term
        loadBlogs("");
    }




    function loadBlogs(search: string): void {
        console.log(`load blogs called with ${search}`);

        const jsonFilePath = 'data/blog.json';
        const container = $('#blog-posts-container');

        container.empty();

        // Perform AJAX request to load blog posts
        $.ajax({
            url: jsonFilePath,
            dataType: 'json',
            success: function (data) {
                // Iterate through the blog posts and append them to the container
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

                const usernameInput = document.getElementById("reg-username") as HTMLInputElement;
                const passwordInput = document.getElementById("reg-password") as HTMLInputElement;
                const confirmPasswordInput = document.getElementById("confirm-password") as HTMLInputElement;

                const username = usernameInput.value.trim();
                const password = passwordInput.value.trim();
                const confirmPassword = confirmPasswordInput.value.trim();

                // Check if passwords match
                if (password !== confirmPassword) {
                    showRegistrationError("Passwords do not match. Please try again.");
                    return;
                }

                const userInfo = {username, password};
                localStorage.setItem('login', JSON.stringify(userInfo));

                showRegistrationSuccess(username);
            });
        }
    }

    function DisplayEventsPage() {
        console.log("Called DisplayEventsPage()");

    }



    function DisplayGalleryPage() {
        console.log("Called DisplayGalleryPage()");
      //  LoadGalleryImages();
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

        const loginForm = document.getElementById("login-form") as HTMLFormElement;

        if (loginForm) {
            loginForm.addEventListener("submit", function (event) {
                event.preventDefault();

                const usernameInput = document.getElementById("username") as HTMLInputElement;
                const passwordInput = document.getElementById("password") as HTMLInputElement;

                const username = usernameInput.value.trim();
                const password = passwordInput.value.trim();

                // Check if username and password are provided
                if (!username || !password) {
                    showLoginError("Please enter both username and password.");
                    return;
                }

                const userInfoString = localStorage.getItem('login');
                console.log(userInfoString)

                if (userInfoString) {
                    const userInfo = JSON.parse(userInfoString);
                    console.log(userInfo)
                    console.log(password)

                    // Check if the entered password matches the stored password
                    if (userInfo.password === password) {
                        showWelcomeMessage(username);
                        setAuthenticated(true);
                    } else {
                        showLoginError("Invalid username or password. Please try again.");
                    }
                } else {
                    showLoginError("User not found. Please register before logging in.");
                }
            });

            // Check if the user is already logged in, if so redirect them back to index.html
            checkAuthenticated();
        }
    }

    function DisplayLogoutPage() {
        setAuthenticated(false);
        LoadLink('home');

    }

    function Display404Page() {
        console.log("Called Display404Page()");
    }

    //function ActiveLinkCallBack(): Function {

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

   /// }

    function capitalizeFirstCharacter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Gets navigation links for the top bar.
     * @param selected the document title of the current page to ensure the appropriate link is selected
     */
    // function LoadHeaderLinks(selected: string): void {
    //     const navigationLinks = document.getElementById("navigation-links");
    //     if (navigationLinks) {
    //         navigationLinks.innerHTML = '';
    //         navigationLinks.appendChild(LoadNavigationLink("home", "Home", selected === "Home", "home-nav"));
    //         navigationLinks.appendChild(LoadNavigationLink("portfolio", "Portfolio", selected === "Portfolio", "portfolio-nav"));
    //         navigationLinks.appendChild(LoadNavigationLink("services", "Services", selected === "Services", "services-nav"));
    //         navigationLinks.appendChild(LoadNavigationLink("team", "Team", selected === "Team", "team-nav"));
    //         navigationLinks.appendChild(LoadNavigationLink("blog", "Blog", selected === "Blog", "blog-nav"));
    //         navigationLinks.appendChild(LoadNavigationLink("events", "Events", selected === "Events", "events-nav"));
    //         if (isAuthenticated()) {
    //             navigationLinks.appendChild(LoadNavigationLink("events-planning", "Events Planning", selected === "Events Planning", "events-nav"));
    //         }
    //         navigationLinks.appendChild(LoadNavigationLink("gallery", "Gallery", selected === "Gallery", "gallery-nav"));
    //
    //         if (isAuthenticated())  {
    //             navigationLinks.appendChild(LoadNavigationLink("statistics", "Statistics", selected === "Statistics", "statistics-nav"));
    //             navigationLinks.appendChild(LoadLogoutLink("Logout", "logout-btn"));
    //         } else {
    //             navigationLinks.appendChild(LoadNavigationLink("login", "Login", false, "login-btn"));
    //         }
    //     }
    // }
    //
    // function LoadFooterLinks() {
    //     const footerLinks = document.getElementById("footer-links");
    //     if (footerLinks) {
    //         footerLinks.innerHTML = "";
    //         footerLinks.appendChild(LoadFooterLink("privacy-policy", "Privacy Policy"));
    //         footerLinks.appendChild(LoadFooterLink("terms", "Terms of Service"));
    //         footerLinks.appendChild(LoadFooterLink("contact", "Contact Us"));
    //     }
    // }

    /**
     * Gets portfolios to be used in projects page. This method will return
     * 3 projects at a time.
     */


    /**
     * Get a single navigation link with appropriate CSS classes
     * @param href hypertext reference
     * @param text the text to be displayed
     * @param selected true or false if to render the link as selected
     * @param id
     * @returns {HTMLLIElement}
     */
    function LoadNavigationLink(href: string, text: string, selected: boolean, id: string): HTMLLIElement {
        const listItem = document.createElement("li");
        listItem.classList.add("nav-item");
        const anchor = document.createElement("a");
        anchor.id = id;
        anchor.classList.add("nav-link");
        anchor.setAttribute('data', href);
        anchor.addEventListener("click", () => {
            LoadLink(anchor.getAttribute('data') ?? "home");
        })
        anchor.addEventListener("mouseover", () => {
            $(anchor).css("cursor", "pointer");
        })
        if (selected) {
            anchor.classList.add("active");
            anchor.setAttribute("aria-current", "page");
        }
        const anchorText = document.createTextNode(text);
        anchor.appendChild(anchorText);
        listItem.appendChild(anchor);
        return listItem;
    }


    /**
     * Get a single navigation link with appropriate CSS classes
     * @param href hypertext reference
     * @param text the text to be displayed
     * @param selected true or false if to render the link as selected
     * @param id
     * @returns {HTMLLIElement}
     */
    function LoadLogoutLink(text: string,  id: string): HTMLLIElement {
        const listItem = document.createElement("li");
        listItem.classList.add("nav-item");
        const anchor = document.createElement("a");
        anchor.id = id;
        anchor.classList.add("nav-link");
        anchor.addEventListener("click", () => {
            DisplayLogoutPage();
        })
        anchor.addEventListener("mouseover", () => {
            $(anchor).css("cursor", "pointer");
        })
        const anchorText = document.createTextNode(text);
        anchor.appendChild(anchorText);
        listItem.appendChild(anchor);
        return listItem;
    }

    function LoadFooterLink(href: string, text: string) {
        const listItem = document.createElement("li");
        listItem.classList.add("nav-item");
        const anchor = document.createElement("a");
        anchor.classList.add("nav-link", "px-2", "text-body-secondary");
        anchor.setAttribute('data', href);
        anchor.addEventListener("click", () => {
            LoadLink(anchor.getAttribute('data') ?? "home");
        })
        anchor.addEventListener("mouseover", () => {
            $(anchor).css("cursor", "pointer");
        })
        const anchorText = document.createTextNode(text);
        anchor.appendChild(anchorText);
        listItem.appendChild(anchor);
        return listItem;
    }

//
//     return {
//         start: start, handleLogout: handleLogout, loadLoginForm: loadLoginForm,
//     };
// })()


    function Start() {
        console.log("App Started");
        // LoadHeaderLinks('home');
        //LoadLink("home");
        fetchNews();

    }

    window.addEventListener("load", Start);
})()