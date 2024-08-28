import $ from "jquery"

class myNotes {
    constructor() {
        this.deletebtn = document.querySelector(".delete-note");
        this.events();
    }

    events() {
        this.deletebtn.addEventListener("click", this.deleteNote);
    }

    deleteNote() {
        $.ajax({
            beforeSend: (xhr) => {
                xhr.setRequestHeader("X-WP-Nonce", uniData.nonce);
            },
            url: uniData.root_url + "/wp-json/wp/v2/note/178",
            type: 'DELETE',
            sucess: (response) => {
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