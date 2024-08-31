import $ from "jquery";

class Like {

    constructor() {
        this.events();
    }

    events() {
        $(".like-box").on("click", this.clickHandler.bind(this))
    }

    clickHandler(e) {
        var clickedElement = $(e.target).closest(".like-box");

        if (clickedElement.data('exists') == 'yes') {
            this.deleteLike();
        } else {
            this.createLike();
        }
    }


    createLike() {

    }

    deleteLike() {

    }

}

export default Like;