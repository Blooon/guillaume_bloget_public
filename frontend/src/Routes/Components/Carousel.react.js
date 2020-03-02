import React from 'react';
import { UserContext } from '../../Contexts/UserContext';
import Slider from "react-slick";

export default class Carousel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            images: {},
            item: {},
            imgId: 0,
            lang: 'en'
        }
        this.changeImg = this.changeImg.bind(this);
        this.LeftRightImage = this.LeftRightImage.bind(this);
    }
    
    changeImg(e) {
        if (this.state.cursorState === 'prev') {
            this.slider.slickPrev();
        } else if (this.state.cursorState === 'next') {
            this.slider.slickNext();
        }
    }

    LeftRightImage(e) {
        let currentTargetRect = e.currentTarget.getBoundingClientRect();
        if (e.clientY >= currentTargetRect.top && e.clientY <= currentTargetRect.top + currentTargetRect.height) {
            if (e.clientX >= currentTargetRect.left && e.clientX <= currentTargetRect.left + currentTargetRect.width/2) {
                this.setState({ cursorState: 'prev' })
            }
            else if (e.clientX >= currentTargetRect.left && e.clientX <= currentTargetRect.left + currentTargetRect.width) {
                this.setState({ cursorState: 'next' })                
            }
        }
    }

    render() {
        const settings = {
            className: "slider variable-width",
            dots: false,
            infinite: true,
            centerMode: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 0,
            variableWidth: false,
            autoplay: false,
            swipeToSlide: true,
            centerPadding: '0px',
        };

        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var h;
        if (w > 1920) {
            h = w * 0.4 + "px";
        } else if (w > 992) {
            h = w * 0.375 + "px";
        } else {
            h = w * 0.612 + "px";   
        }

        let slides = null;
        if (this.props.images !== undefined && this.props.images.length > 0){

            slides = this.props.images.map((img, index) => {

                return <div key={img.large+index} className="slide">
                        <img
                            className="w3-image"
                            alt={img.large+index}
                            style={{height: h}}
                            src={process.env.REACT_APP_S3_BUCKET_BASE_URL + img.large.replace(' ', '%20')}
                            sizes="(max-width: 720px) 96vw, (max-width: 1280px) 58vw, 62vw"
                            srcSet={process.env.REACT_APP_S3_BUCKET_BASE_URL + img.small.replace(' ', '%20') + " 680w," +
                                    process.env.REACT_APP_S3_BUCKET_BASE_URL + img.medium.replace(' ', '%20') + " 952w," +
                                    process.env.REACT_APP_S3_BUCKET_BASE_URL + img.large.replace(' ', '%20') + " 1587w"}
                            />
                    </div>
            })
        }

        return <div
            className={"project-slideshow w3-col xl8 " + this.state.cursorState}
            onMouseMove={e => this.LeftRightImage(e)}
            onClick={e => this.changeImg(e)}
            style={{height: h}}
            >
            <Slider ref={c => (this.slider = c)} {...settings}>
                {slides}
            </Slider>
        </div>
    }
}

Carousel.contextType = UserContext;
