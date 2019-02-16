const rightArrowText = ">";
const leftArrowText = "<";
const RIGHT = 1;
const LEFT = 0;

class Carousel42 {
    constructor() {
        this.carouselElement = document.querySelector(".carousel42");

        //this.images = this.carouselElement.querySelectorAll("img");

        this.importTween();
        this.addNavigation()
        this.addDivs();
        this.setupImages();

    }

    importTween() {
        const tweenLite = document.createElement("script");
        const tweenMax = document.createElement("script");
        const cssPlugin = document.createElement("script");
        tweenLite.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.2/TweenLite.min.js";
        tweenMax.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.2/TweenMax.min.js";
        cssPlugin.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.2/plugins/CSSPlugin.min.js";


        document.head.appendChild(tweenLite);
        document.head.appendChild(cssPlugin);
        document.head.appendChild(tweenMax);
    }

    addNavigation() {
        // Create arrow elements
        this.leftArrow = document.createElement("div");
        this.rightArrow = document.createElement("div");

        // add arrow symbol
        this.leftArrow.innerText = leftArrowText;
        this.rightArrow.innerText = rightArrowText;

        // add arrow classes and data
        this.leftArrow.classList.add("c42-arrow");
        this.leftArrow.dataset.arrowType = "left-arrow";
        this.rightArrow.classList.add("c42-arrow");
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

        this.leftDiv.classList.add("c42-left-div");
        this.activeDiv.classList.add("c42-active-div");
        this.rightDiv.classList.add("c42-right-div");
        this.storageDiv.classList.add("c42-storage-div");

        this.activeX = this.activeDiv.getBoundingClientRect().x;
        this.leftX = this.leftDiv.getBoundingClientRect().x;
        this.rightX = this.rightDiv.getBoundingClientRect().x;

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
                images[i].classList.add("c42-left-img", "c42-flank-img");
                this.leftDiv.appendChild(images[i]);
            } else if (i === 1) {
                images[i].classList.add("c42-active-img");
                this.activeDiv.appendChild(images[i]);
            } else if (i === 2) {
                images[i].classList.add("c42-right-img", "c42-flank-img");
                this.rightDiv.appendChild(images[i]);
            } else {
                images[i].classList.add("c42-hidden-img");
                this.storageDiv.appendChild(images[i]);
            }
        }
    }
    changeImage(arrow) {
        let nextIndex, rightImage, leftImage, leftCoord, rightCoord, activeCoord, nextImage;
        const whichArrow = arrow.dataset.arrowType;
        const currentImage = document.querySelector(".c42-active-img");
        const currentIndex = Number(currentImage.dataset.cimage);

        nextIndex = this.findNextIndex(currentIndex, RIGHT);
        rightImage = document.querySelector(`img[data-cimage="${nextIndex}"]`);
        nextIndex = this.findNextIndex(currentIndex, LEFT);
        leftImage = document.querySelector(`img[data-cimage="${nextIndex}"]`);

        leftCoord = this.leftDiv.getBoundingClientRect();
        rightCoord = this.rightDiv.getBoundingClientRect();
        activeCoord = this.activeDiv.getBoundingClientRect();

        switch(whichArrow) {
            case "left-arrow":
                const rightIndex = rightImage.dataset.cimage;
                nextIndex = this.findNextIndex(rightIndex, RIGHT);
                nextImage =
                    this.storageDiv.querySelector(`img[data-cimage="${nextIndex}"]`);

                this.storageDiv.appendChild(leftImage);
                leftImage.classList.remove("c42-left-img", "c42-flank-img");
                leftImage.classList.add("c42-hidden-img");

                TweenMax.to(currentImage, .2, {
                    x: -(activeCoord.x - leftCoord.x),
                    //rotationY: "-45deg",
                    onComplete: () => {
                        //
                        //TweenMax.set(currentImage, { clearProps:"all"});
                        this.leftDiv.appendChild(currentImage);
                        TweenMax.set(currentImage, { clearProps: "all" });
                        TweenMax.to(currentImage, .4, {
                            className: "c42-left-img c42-flank-img",
                            onComplete: () => {
                                currentImage.classList.remove("c42-active-img");
                            }
                        })
                    }
                });

                TweenMax.to(rightImage, .3, {
                    x: -(rightCoord.x - activeCoord.x),
                    onComplete: () => {
                        //
                        //TweenMax.set(currentImage, { clearProps:"all"});
                        this.activeDiv.appendChild(rightImage);
                        TweenMax.set(rightImage, { clearProps: "all" });
                        TweenMax.to(rightImage, .2, {
                            className: "c42-active-img",
                        })
                    }
                });

                TweenMax.to(nextImage, .1, {
                    x: -(rightCoord.x),
                    //rotationY: "-45deg",
                    onComplete: () => {
                        //
                        //TweenMax.set(currentImage, { clearProps:"all"});
                        this.rightDiv.appendChild(nextImage);
                        TweenMax.set(nextImage, { clearProps: "all" });
                        TweenMax.to(nextImage, .5, {
                            className: "c42-right-img c42-flank-img",
                        })
                    }
                });
                break;
            case "right-arrow":
                const leftIndex = leftImage.dataset.cimage;
                nextIndex = this.findNextIndex(leftIndex, LEFT);
                nextImage =
                    this.storageDiv.querySelector(`img[data-cimage="${nextIndex}"]`);
                ////////////////////////
                this.leftDiv.appendChild(nextImage);

                this.storageDiv.appendChild(rightImage);
                rightImage.classList.remove("c42-left-img", "c42-flank-img");
                rightImage.classList.add("c42-hidden-img");

                TweenMax.to(currentImage, .2, {
                    x: (rightCoord.x - activeCoord.x),
                    //rotationY: "-45deg",
                    onComplete: () => {
                        //
                        //TweenMax.set(currentImage, { clearProps:"all"});
                        this.rightDiv.appendChild(currentImage);
                        TweenMax.set(currentImage, { clearProps: "all" });
                        TweenMax.to(currentImage, .4, {
                            className: "c42-right-img c42-flank-img",
                            onComplete: () => {
                                currentImage.classList.remove("c42-active-img");
                            }
                        })
                        //currentImage.classList.remove("active-img");
                        //currentImage.classList.add("left-img", "flank-img");
                    }
                });

                TweenMax.to(leftImage, .3, {
                    x: (activeCoord.x - leftCoord.x),
                    //rotationY: "-45deg",
                    onComplete: () => {
                        //
                        //TweenMax.set(currentImage, { clearProps:"all"});
                        this.activeDiv.appendChild(leftImage);
                        TweenMax.set(leftImage, { clearProps: "all" });
                        TweenMax.to(leftImage, .2, {
                            className: "c42-active-img",
                        })
                    }
                });

                //nextImage.classList.remove("hidden-img");
                TweenMax.to(nextImage, .1, {
                    x: (rightCoord.x),
                    //rotationY: "-45deg",
                    onComplete: () => {
                        //
                        //TweenMax.set(currentImage, { clearProps:"all"});
                        //this.leftDiv.appendChild(nextImage);
                        //nextImage.classList.remove("hidden-img");
                        TweenMax.set(nextImage, { clearProps: "all" });
                        TweenMax.to(nextImage, .5, {
                            className: "c42-left-img c42-flank-img",
                        })
                    }
                });
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

const carousel42 = new Carousel42();