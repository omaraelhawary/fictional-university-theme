//import $ from "jquery";

class myNotes {
    constructor() {
        this.deletebtn = document.querySelector(".delete-note");
        this.events();
    }

    events() {
        this.deletebtn.addEventListener("click", this.deleteNote);
    }

    deleteNote() {
        alert("you clicked Delete")
    }
}

export default myNotes