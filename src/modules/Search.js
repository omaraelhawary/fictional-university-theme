import $ from 'jquery';

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
        $.getJSON(uniData.root_url + '/wp-json/wp/v2/posts?search=' + this.searchField.val(), posts => {
            this.resultDiv.html(`
                <h2 class="search-overlay__section-title">Search Results</h2>
                ${posts.length ? '<ul class="link-list min-list">' : '<p>No results</p>'}
                        ${posts.map(item => `<li><a href=${item.link}>${item.title.rendered}</a></li>`).join('')}
                ${posts.length ? '</ul">' : ''}
                `);
            this.isSpinnerVisible = false;
        });
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

export default Search