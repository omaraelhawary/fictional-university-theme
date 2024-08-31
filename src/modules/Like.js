import $ from "jquery";

class Like {

    constructor() {
        this.events();
    }

    events() {
        $(".like-box").on("click", this.clickHandler.bind(this));
    }

    clickHandler(e) {
        var clickedElement = $(e.target).closest(".like-box");

        if (clickedElement.data('exists') == 'yes') {
            this.deleteLike(clickedElement);
        } else {
            this.createLike(clickedElement);
        }
    }


    createLike(clickedElement) {
        $.ajax({
            url: uniData.root_url + "/wp-json/university/v1/manageLike",
            type: "POST",
            data: {
                'professorID': clickedElement.data('professor')
            },
            success: (response) => {
                console.log('success')
                console.log(response)
            },
            error: (response) => {
                console.log('fail')
                console.log(response)
            }
        });
    }

    deleteLike(clickedElement) {
        $.ajax({
            url: uniData.root_url + "/wp-json/university/v1/manageLike",
            type: "DELETE",
            success: (response) => {
                console.log('success')
                console.log(response)
            },
            error: (response) => {
                console.log('fail')
                console.log(response)
            }
        });
    }

}

export default Like;
