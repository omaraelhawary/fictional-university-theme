import $ from "jquery"

class myNotes {
    constructor() {
        this.deleteBtn = document.querySelector(".delete-note");
        this.editeBtn = document.querySelector(".edit-note");
        this.events();
    }

    events() {
        $(".delete-note").on("click", this.deleteNote);
        $(".edit-note").on("click", this.editNote.bind(this));
        $(".update-note").on("click", this.saveNote.bind(this));
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

    editNote(e) {
        var thisNote = $(e.target).parents("li");

        if (thisNote.data('state') == "editable") {
            this.makeNoteReadonly(thisNote);
        } else {
            this.makeNoteEditable(thisNote);
        }
    }

    makeNoteEditable(thisNote) {
        thisNote.find(".edit-note").html('<i class="fa fa-times" aria-hidden="true"></i> Cancel')
        thisNote.find('.note-title-field, .note-body-field').removeAttr('readonly').addClass("note-active-field");
        thisNote.find(".update-note").addClass("update-note--visible");
        thisNote.data("state", "editable");

    }

    makeNoteReadonly(thisNote) {
        thisNote.find(".edit-note").html('<i class="fa fa-pencil" aria-hidden="true"></i> Edit')
        thisNote.find('.note-title-field, .note-body-field').attr('readonly', 'readyonly').removeClass("note-active-field");
        thisNote.find(".update-note").removeClass("update-note--visible");
        thisNote.data("state", "cancel");
    }

    saveNote(e) {
        var thisNote = $(e.target).parents("li");
        var ourUpdateData = {
            'title': thisNote.find(".note-title-field").val(),
            'content': thisNote.find(".note-body-field").val()
        }
        $.ajax({
            beforeSend: (xhr) => {
                xhr.setRequestHeader("X-WP-Nonce", uniData.nonce);
            },
            url: uniData.root_url + "/wp-json/wp/v2/note/" + thisNote.data('id'),
            type: 'POST',
            data: ourUpdateData,
            success: (response) => {
                this.makeNoteReadonly(thisNote);
                console.log("updated");
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