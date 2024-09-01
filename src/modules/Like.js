import axios from "axios";

class Like {

    constructor() {
        if (document.querySelector(".like-box")) {
            axios.defaults.headers.common["X-WP-Nonce"] = uniData.nonce
            this.events()
        }
    }

    events() {
        document.querySelector(".like-box").addEventListener("click", e => this.clickHandler(e))
    }

    clickHandler(e) {
        let clickedElement = e.target

        while (!clickedElement.classList.contains("like-box")) {
            clickedElement = clickedElement.parentElement
        }

        if (clickedElement.getAttribute("data-exists") == "yes") {
            this.deleteLike(clickedElement)
        } else {
            this.createLike(clickedElement)
        }
    }


    async createLike(clickedElement) {
        try {
            const response = await axios.post(uniData.root_url + "/wp-json/university/v1/manageLike", { "professorID": clickedElement.getAttribute("data-professor") })
            if (response.data != "Invalid Professor ID") {
                clickedElement.setAttribute("data-exists", "yes")
                var likeCount = parseInt(clickedElement.querySelector(".like-count").innerHTML, 10)
                likeCount++
                clickedElement.querySelector(".like-count").innerHTML = likeCount
                clickedElement.setAttribute("data-like", response.data)
            }
            console.log(response.data)
        } catch (e) {
            console.log(response.data)
            console.log(e);
            console.log("Sorry")
        }
    }

    async deleteLike(clickedElement) {
        try {
            const response = await axios({
                url: uniData.root_url + "/wp-json/university/v1/manageLike",
                method: 'delete',
                data: { "like": clickedElement.getAttribute("data-like") },
            })
            clickedElement.setAttribute("data-exists", "no")
            var likeCount = parseInt(clickedElement.querySelector(".like-count").innerHTML, 10)
            likeCount--
            clickedElement.querySelector(".like-count").innerHTML = likeCount
            clickedElement.setAttribute("data-like", "")
            console.log(response.data)
        } catch (e) {
            console.log(e)
        }
    }
}

export default Like;
