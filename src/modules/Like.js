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

        if (clickedElement.attr('data-exists') == 'yes') {
            this.deleteLike(clickedElement);
        } else {
            this.createLike(clickedElement);
        }
    }


    createLike(clickedElement) {
        $.ajax({
            beforeSend: (xhr) => {
                xhr.setRequestHeader("X-WP-Nonce", uniData.nonce);
            },
            url: uniData.root_url + "/wp-json/university/v1/manageLike",
            type: "POST",
            data: {
                'professorID': clickedElement.data('professor')
            },
            success: (response) => {
                clickedElement.attr("data-exists", "yes");
                var likeCount = parseInt(clickedElement.find(".like-count").html(), 10);
                likeCount++;
                clickedElement.find(".like-count").html(likeCount);
                clickedElement.attr("data-like", response);
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
            beforeSend: (xhr) => {
                xhr.setRequestHeader("X-WP-Nonce", uniData.nonce);
            },
            data: {
                'like': clickedElement.attr('data-like'),
            },
            url: uniData.root_url + "/wp-json/university/v1/manageLike",
            type: "DELETE",
            success: (response) => {
                clickedElement.attr("data-exists", "no");
                var likeCount = parseInt(clickedElement.find(".like-count").html(), 10);
                likeCount--;
                clickedElement.find(".like-count").html(likeCount);
                clickedElement.attr("data-like", "");
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
