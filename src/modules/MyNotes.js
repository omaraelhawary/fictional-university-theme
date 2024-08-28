import $ from "jquery"

class myNotes {
    constructor() {
        this.deletebtn = document.querySelector(".delete-note");
        this.updatebtn = document.querySelector(".update-note");
        this.events();
    }

    events() {
        if (this.deletebtn) {
            this.deletebtn.addEventListener("click", this.deleteNote.bind(this));
        }
        if (this.updatebtn) {
            this.updatebtn.addEventListener("click", this.deleteNote.bind(this));
        }
    }

    deleteNote(e) {
        var thisNote = $(e.target).parents("li");
        $.ajax({
            beforeSend: (xhr) => {
                xhr.setRequestHeader("X-WP-Nonce", uniData.nonce);
            },
            url: uniData.root_url + "/wp-json/wp/v2/note/" + thisNote.data('id'),
            type: 'DELETE',
            success: (response) => {
                thisNote.slideUp();
                console.log("deleted");
                console.log(response);
            },
            error: (response) => {
                console.log("error");
                console.log(response);
            }
        })
    }
}

export default myNotes