const rightArrowText = ">";
const leftArrowText = "<";
const RIGHT = 1;
const LEFT = 0;

class Carousel {
    constructor() {
        this.carouselElement = document.querySelector(".carousel");

        //this.images = this.carouselElement.querySelectorAll("img");

        this.addNavigation()
        this.addDivs();
        this.setupImages();

    }

    addNavigation() {
        // Create arrow elements
        this.leftArrow = document.createElement("div");
        this.rightArrow = document.createElement("div");

        // add arrow symbol
        this.leftArrow.innerText = leftArrowText;
        this.rightArrow.innerText = rightArrowText;

        // add arrow classes and data
        this.leftArrow.classList.add("carousel-arrow");
        this.leftArrow.dataset.arrowType = "left-arrow";
        this.rightArrow.classList.add("carousel-arrow");
        this.rightArrow.dataset.arrowType = "right-arrow";

        this.carouselElement.appendChild(this.leftArrow);
        this.carouselElement.appendChild(this.rightArrow);

        this.leftArrow.addEventListener("click", e => {
            this.changeImage(e.target);
        });
        this.rightArrow.addEventListener("click", e => {
            this.changeImage(e.target);
        });

    }
    addDivs() {
        //const rightArrow = this.carouselElement.querySelector(`div[data-arrowType=`)
        this.leftDiv = document.createElement("div");
        this.activeDiv = document.createElement("div");
        this.rightDiv = document.createElement("div");
        this.storageDiv = document.createElement("div");

        this.leftDiv.classList.add("left-div");
        this.activeDiv.classList.add("active-div");
        this.rightDiv.classList.add("right-div");
        this.storageDiv.classList.add("storage-div");

        this.carouselElement.insertBefore(this.leftDiv, this.rightArrow);
        this.carouselElement.insertBefore(this.activeDiv, this.rightArrow);
        this.carouselElement.insertBefore(this.rightDiv, this.rightArrow);
        document.querySelector("body").appendChild(this.storageDiv);
    }
    setupImages() {
        const images = this.carouselElement.querySelectorAll("img");

        this.totalImages = images.length;

        for(let i = 0; i < images.length; i++){
            images[i].dataset.cimage = `${i}`;
            if (i === 0) {
                images[i].classList.add("left-img", "flank-img");
                this.leftDiv.appendChild(images[i]);
            } else if (i === 1) {
                images[i].classList.add("active-img");
                this.activeDiv.appendChild(images[i]);
            } else if (i === 2) {
                images[i].classList.add("right-img", "flank-img");
                this.rightDiv.appendChild(images[i]);
            } else {
                images[i].classList.add("hidden-img");
                this.storageDiv.appendChild(images[i]);
            }
        }
    }
    changeImage(arrow) {
        let nextIndex, rightImage, leftImage;
        //const storage = document.querySelectorAll(".storage-div");
        const whichArrow = arrow.dataset.arrowType;
        const currentImage = document.querySelector(".active-img");
        const currentIndex = Number(currentImage.dataset.cimage);

        //console.log(this.carouselElement.querySelector(`img[data-cimage="1"]`));
        nextIndex = this.findNextIndex(currentIndex, RIGHT);
        rightImage = document.querySelector(`img[data-cimage="${nextIndex}"]`);
        nextIndex = this.findNextIndex(currentIndex, LEFT);
        leftImage = document.querySelector(`img[data-cimage="${nextIndex}"]`);

        console.log("-------------");
        console.log("left image", leftImage.dataset.cimage, leftImage);
        console.log("current image", currentImage.dataset.cimage, currentImage);
        console.log("right image", rightImage.dataset.cimage, rightImage);

        //console.log(currentImage.dataset.cimage);
        switch(whichArrow) {
            case "left-arrow":
                this.storageDiv.appendChild(leftImage);
                leftImage.classList.remove("left-img", "flank-img");
                leftImage.classList.add("hidden-img");

                currentImage.classList.remove("active-img");
                currentImage.classList.add("left-img", "flank-img");
                this.leftDiv.appendChild(currentImage);

                rightImage.classList.remove("right-img", "flank-img");
                rightImage.classList.add("active-img");
                this.activeDiv.appendChild(rightImage);

                const rightIndex = rightImage.dataset.cimage;
                nextIndex = this.findNextIndex(rightIndex, RIGHT);
                const nextImage =
                    this.storageDiv.querySelector(`img[data-cimage="${nextIndex}"]`);
                nextImage.classList.remove("hidden-img")
                nextImage.classList.add("right-img", "flank-img");
                this.rightDiv.appendChild(nextImage);
                console.log("nextImage", nextImage.dataset.cimage, nextImage)

                break;
            case "right-arrow":
                console.log("right");
                break;
        }
    }
    findNextIndex(curIndex, direction) {
        // direction = 1 for right, 0 for left

        const lastIndex = this.totalImages - 1;
        const firstIndex = 0;
        let nextIndex;
        curIndex = Number(curIndex);

        switch(direction) {
            case RIGHT:
                if ((curIndex + 1) > lastIndex) {
                    nextIndex = firstIndex;
                }
                else {
                    nextIndex = curIndex + 1;
                }
                break;
            case LEFT:
                if (curIndex - 1 < firstIndex)
                    nextIndex = lastIndex;
                else
                    nextIndex = curIndex - 1;
                break;
        }

        return nextIndex;
    }
}

const carousel = new Carousel();