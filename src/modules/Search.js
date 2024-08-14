import $ from "jquery";

class Search {
    //1. describe our object
    constructor() {
        this.addSearchHtml();
        this.resultDiv = $("#search-overlay__results");
        this.openButton = $('.js-search-trigger');
        this.closeButton = $('.search-overlay__close');
        this.searchOverlay = $('.search-overlay');
        this.searchField = $('#search-term');
        this.events();
        this.isOverlayOpen = false;
        this.isSpinnerVisible = false;
        this.preValue;
        this.typingTimer;
    }

    //2. all events
    events() {
        this.openButton.on('click', this.openOverlay.bind(this));
        this.closeButton.on('click', this.closeOverlay.bind(this));
        $(document).on('keydown', this.keyPressDispatcher.bind(this));
        this.searchField.on('keyup', this.typingLogic.bind(this));
    }

    //3. methods functions or methods
    openOverlay() {
        this.searchOverlay.addClass("search-overlay--active");
        $("body").addClass('body-no-scroll');
        setTimeout(() => {
            this.searchField.focus();
        }, 301);
        this.isOverlayOpen = true;
        this.searchField.val('');
    }

    closeOverlay() {
        this.searchOverlay.removeClass('search-overlay--active');
        $("body").removeClass('body-no-scroll');
        this.isOverlayOpen = false;
        this.resultDiv.html('');
    }

    keyPressDispatcher(e) {
        if (e.keyCode == 83 && !this.isOverlayOpen && !$("input, textarea").is(':focus')) {
            this.openOverlay();
        }
        if (e.keyCode == 27 && this.isOverlayOpen) {
            this.closeOverlay();
        }
    }

    typingLogic() {
        if (this.searchField.val() != this.preValue) {
            clearTimeout(this.typingTimer);
            if (this.searchField.val()) {
                if (!this.isSpinnerVisible) {
                    this.resultDiv.html('<div class="spinner-loader"></div>');
                    this.isSpinnerVisible = true;
                }
                this.typingTimer = setTimeout(this.getResults.bind(this), 750);
            } else {
                this.resultDiv.html('');
                this.isSpinnerVisible = false;
            }

        }
        this.preValue = this.searchField.val();
    }

    getResults() {
        $.getJSON((uniData.root_url + '/wp-json/university/v1/search?keyword=' + this.searchField.val()), (results) => {
            console.log('Received results:', results);
            this.resultDiv.html(`
                <div class="row">
                    <div class="one-third">
                        <!-- Posts and Pages results -->
                        <h2 class="search-overlay__section-title">General Information</h2>
                        ${results.universityPosts.length ? '<ul class="link-list min-list">' : '<p>No results</p>'}

                            ${results.universityPosts.map(item => `<li><a href="${item.link}">${item.title}</a> ${item.postType == 'post' ? `by ${item.authorName}` : ''}</li>`).join('')}

                        ${results.universityPosts.length ? '</ul>' : ''}
                    </div>
                    <div class="one-third">
                        <!-- Programs results -->
                        <h2 class="search-overlay__section-title">Programs</h2>
                        ${results.universityProg.length ? '<ul class="link-list min-list">' : `<p>No results. <a href="${uniData.root_url}/programs"> View all programs </a></p>`}
                            ${results.universityProg.map(item => `<li><a href="${item.link}">${item.title}</a></li>`).join('')}
                        ${results.universityProg.length ? '</ul>' : ''}

                        <!-- Professors results -->
                        <h2 class="search-overlay__section-title">Professors</h2>

                        ${results.universityProf.length ? '<ul class="professor-cards">' : `<p>No results.</p>`}

                        ${results.universityProf.map(item => `<li class="professor-card__list-item">
                            <a class="professor-card" href="${item.link}">
                                <img class="professor-card__image" src="${item.professorImage}">
                                <span class="professor-card__name">
                                    ${item.title}
                                </span>
                            </a>
                        </li>`).join('')}

                        ${results.universityProf.length ? '</ul>' : ''}
                        
                        </div>
                    <div class="one-third">
                        <!-- Campuses results -->
                        <h2 class="search-overlay__section-title">Campuses</h2>
                        ${results.universityCamp.length ? '' : `<p>No results. <a href="${uniData.root_url}/campuses"> View all Campuses </a></p>`}
                            ${results.universityCamp.map(item => `<a href="${item.link}">${item.title}</a>`).join('')}
                        

                        <!-- Events results -->
                        <h2 class="search-overlay__section-title">Events</h2>  
                        ${results.universityEvent.length ? '' : `<p>No results. <a href="${uniData.root_url}/events"> View all Events</a></p>`}
                        ${results.universityEvent.map(item => `
                            <div class="event-summary">
                                <a class="event-summary__date t-center" href="${item.link}">
                                    <span class="event-summary__month">
                                        ${item.month}
                                    </span>
                                    <span class="event-summary__day">
                                        ${item.day}
                                    </span>
                                </a>
                                <div class="event-summary__content">
                                    <h5 class="event-summary__title headline headline--tiny">
                                        <a href="${item.link}"> ${item.title} </a>
                                    </h5>
                                    <p>
                                        ${item.desc} <a href="${item.link}" class="nu gray">Learn more</a>
                                    </p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                `)
            this.isSpinnerVisible = false
        })

    }

    addSearchHtml() {
        $('body').append(`
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
    `)
    }
}

export default Search;