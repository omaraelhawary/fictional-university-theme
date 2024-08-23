import axios from "axios"
class Search {
    constructor() {
        this.addSearchHtml();
        this.resultDiv = document.getElementById('search-overlay__results');
        this.openButton = document.querySelectorAll('.js-search-trigger');
        this.closeButton = document.querySelectorAll('.search-overlay__close');
        this.searchOverlay = document.querySelector('.search-overlay');
        this.searchField = document.getElementById('search-term');
        this.isOverlayOpen = false;
        this.isSpinnerVisible = false;
        this.preValue
        this.typingTimer
        this.events();
    }

    events() {
        this.openButton.forEach(el => {
            el.addEventListener("click", e => {
                e.preventDefault()
                this.openOverlay()
            })
        })

        this.closeButton.forEach(el => {
            el.addEventListener("click", () => this.closeOverlay())
        })
        document.addEventListener("keydown", e => this.keyPressDispatcher(e))
        this.searchField.addEventListener("keyup", () => this.typingLogic())
    }

    openOverlay() {
        this.searchOverlay.classList.add("search-overlay--active")
        document.body.classList.add('body-no-scroll')
        setTimeout(() => {
            this.searchField.focus()
        }, 301);
        this.isOverlayOpen = true
        this.searchField.value = ''
        return false;
    }

    closeOverlay() {
        this.searchOverlay.classList.remove('search-overlay--active');
        document.body.classList.remove('body-no-scroll');
        this.isOverlayOpen = false;
        this.resultDiv.innerHTML = '';
    }

    keyPressDispatcher(e) {
        if (e.keyCode === 83 && !this.isOverlayOpen && !document.querySelector('input:focus, textarea:focus')) {
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

    async getResults() {
        try {
            const response = await axios.get(`${uniData.root_url}/wp-json/university/v1/search?keyword=${this.searchField.value}`);

            const results = await response.data;

            this.resultDiv.innerHTML = `
                <div class="row">
                    <div class="one-third">
                        <h2 class="search-overlay__section-title">General Information</h2>
                        ${results.universityPosts.length ? '<ul class="link-list min-list">' : '<p>No results</p>'}
                            ${results.universityPosts.map(item => `<li><a href="${item.link}">${item.title}</a> ${item.postType === 'post' ? `by ${item.authorName}` : ''}</li>`).join('')}
                        ${results.universityPosts.length ? '</ul>' : ''}
                    </div>
                    <div class="one-third">
                        <h2 class="search-overlay__section-title">Programs</h2>
                        ${results.universityProg.length ? '<ul class="link-list min-list">' : `<p>No results. <a href="${uniData.root_url}/programs"> View all programs </a></p>`}
                            ${results.universityProg.map(item => `<li><a href="${item.link}">${item.title}</a></li>`).join('')}
                        ${results.universityProg.length ? '</ul>' : ''}
                        
                        <h2 class="search-overlay__section-title">Professors</h2>
                        ${results.universityProf.length ? '<ul class="professor-cards">' : `<p>No results.</p>`}
                            ${results.universityProf.map(item => `<li class="professor-card__list-item">
                                <a class="professor-card" href="${item.link}">
                                    <img class="professor-card__image" src="${item.professorImage}">
                                    <span class="professor-card__name">${item.title}</span>
                                </a>
                            </li>`).join('')}
                        ${results.universityProf.length ? '</ul>' : ''}
                    </div>
                    <div class="one-third">
                        <h2 class="search-overlay__section-title">Campuses</h2>
                        ${results.universityCamp.length ? '' : `<p>No results. <a href="${uniData.root_url}/campuses"> View all Campuses </a></p>`}
                            ${results.universityCamp.map(item => `<a href="${item.link}">${item.title}</a> <br>`).join('')}
                        
                        <h2 class="search-overlay__section-title">Events</h2>
                        ${results.universityEvent.length ? '' : `<p>No results. <a href="${uniData.root_url}/events"> View all Events</a></p>`}
                        ${results.universityEvent.map(item => `
                            <div class="event-summary">
                                <a class="event-summary__date t-center" href="${item.link}">
                                    <span class="event-summary__month">${item.month}</span>
                                    <span class="event-summary__day">${item.day}</span>
                                </a>
                                <div class="event-summary__content">
                                    <h5 class="event-summary__title headline headline--tiny">
                                        <a href="${item.link}">${item.title}</a>
                                    </h5>
                                    <p>${item.desc} <a href="${item.link}" class="nu gray">Learn more</a></p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            this.isSpinnerVisible = false;
        } catch (error) {
            console.error('Error fetching results:', error);
            this.resultDiv.innerHTML = '<p>An error occurred while fetching results.</p>';
            this.isSpinnerVisible = false;
        }
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