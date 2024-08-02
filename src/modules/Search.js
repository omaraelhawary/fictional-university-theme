class Search {
    //1. describe our object
    constructor() {
        this.addSearchHtml();
        this.resultDiv = document.getElementById("search-overlay__results");
        this.openButton = document.querySelectorAll('.js-search-trigger');
        this.closeButton = document.querySelector('.search-overlay__close');
        this.searchOverlay = document.querySelector('.search-overlay');
        this.searchField = document.getElementById('search-term');
        this.events();
        this.isOverlayOpen = false;
        this.isSpinnerVisible = false;
        this.preValue = "";
        this.typingTimer;
    }

    //2. all events
    events() {
        this.openButton.forEach(button => button.addEventListener('click', this.openOverlay.bind(this)));
        this.closeButton.addEventListener('click', this.closeOverlay.bind(this));
        document.addEventListener('keydown', this.keyPressDispatcher.bind(this));
        this.searchField.addEventListener('keyup', this.typingLogic.bind(this));
    }

    //3. methods functions or methods
    openOverlay() {
        this.searchOverlay.classList.add("search-overlay--active");
        document.body.classList.add('body-no-scroll');
        setTimeout(() => {
            this.searchField.focus();
        }, 301);
        this.isOverlayOpen = true;
        this.searchField.value = '';
    }

    closeOverlay() {
        this.searchOverlay.classList.remove('search-overlay--active');
        document.body.classList.remove('body-no-scroll');
        this.isOverlayOpen = false;
        this.resultDiv.innerHTML = '';
    }

    keyPressDispatcher(e) {
        if (e.keyCode === 83 && !this.isOverlayOpen && !document.querySelector("input:focus, textarea:focus")) {
            this.openOverlay();
        }
        if (e.keyCode === 27 && this.isOverlayOpen) {
            this.closeOverlay();
        }
    }

    typingLogic() {
        if (this.searchField.value !== this.preValue) {
            clearTimeout(this.typingTimer);
            if (this.searchField.value) {
                if (!this.isSpinnerVisible) {
                    this.resultDiv.innerHTML = '<div class="spinner-loader"></div>';
                    this.isSpinnerVisible = true;
                }
                this.typingTimer = setTimeout(this.getResults.bind(this), 750);
            } else {
                this.resultDiv.innerHTML = '';
                this.isSpinnerVisible = false;
            }
        }
        this.preValue = this.searchField.value;
    }

    getResults() {
        Promise.all([
            fetch(uniData.root_url + '/wp-json/wp/v2/posts?search=' + this.searchField.value).then(res => res.json()),
            fetch(uniData.root_url + '/wp-json/wp/v2/pages?search=' + this.searchField.value).then(res => res.json())
        ]).then(([posts, pages]) => {
            const combineResults = posts.concat(pages);
            this.resultDiv.innerHTML = `
                <h2 class="search-overlay__section-title">Search Results</h2>
                ${combineResults.length ? '<ul class="link-list min-list">' : '<p>No results</p>'}
                    ${combineResults.map(item => `<li><a href="${item.link}">${item.title.rendered}</a></li>`).join('')}
                ${combineResults.length ? '</ul>' : ''}
            `;
            this.isSpinnerVisible = false;
        }).catch(() => {
            this.resultDiv.innerHTML = "<p>No results</p>";
        });
    }

    addSearchHtml() {
        document.body.insertAdjacentHTML('beforeend', `
            <div class="search-overlay">
                <div class="search-overlay__top">
                    <div class="container">
                        <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
                        <input class="search-term" id="search-term" type="text" placeholder="What are you looking for?">
                        <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
                    </div>
                </div>
                <div class="container">
                    <div id="search-overlay__results"></div>
                </div>
            </div>
        `);
    }
}

export default Search;