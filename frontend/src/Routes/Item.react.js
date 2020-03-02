import React from 'react';
import { UserContext } from '../Contexts/UserContext';
import { loadDataIfNeeded } from '../Utils/loadDataIfNeeded.utils';
import front from '../Utils/front.utils';
import Slider from "react-slick";
import { Link } from "react-router-dom";

export default class Item extends React.Component {
    constructor(props) {
        super (props);
        this.state = {
            item: {},
            error: '',
            lang: 'en',
            typeImg: false,
            selectedType: ''
        }
        this.changeImg = this.changeImg.bind(this);
        this.LeftRightImage = this.LeftRightImage.bind(this);
        this.handleColorClick = this.handleColorClick.bind(this);
        this.checkSlides = this.checkSlides.bind(this);
    }
    
    changeImg(e) {
        if (!this.state.typeImg) {
            if (this.state.cursorState === 'prev') {
                this.slider.slickPrev();
            } else if (this.state.cursorState === 'next') {
                this.slider.slickNext();
            }
        } else this.checkSlides()
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

    handleColorClick(e, type) {
        let img = {
            itemId: type.itemId,
            large: type.large,
            medium: type.medium,
            small: type.small,
            _id: type._id
        }
        if (this.state.item.images !== undefined) {
            this.state.item.images.unshift(img)
        }
        this.setState({typeImg: true, selectedType: type._id})
        this.slider.slickGoTo(0, true)
    }

    checkSlides() {
        if (this.state.typeImg) {
            this.state.item.images.shift();
            this.setState({typeImg: false, selectedType: ''});
        }
    }

    render() {
        
        loadDataIfNeeded(this, `/item/${this.props.match.params.itemId}`, { lang: this.context.lang }, 'item');

        let colorBoxes = null;
        let colors = null;
        if (this.state.item.types !== undefined && this.state.item.types.length > 0) {
            colors = <p>{this.context.lang === 'fr' ? "Couleurs" : "Colors"}</p>
            colorBoxes = this.state.item.types.map((type) => {
                return <div key={type.color} className="color-box w3-show-inline-block" style={{backgroundColor: type.color}} onClick={e => this.handleColorClick(e, type)}></div>
            })
        }

        const settings = {
            className: "slider",
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
            afterChange: current => this.checkSlides(current)
        };

        let slides = null;
        if (this.state.item.images !== undefined && this.state.item.images.length > 0){

            slides = this.state.item.images.map((img, index) => {
                return <div key={img.large+index} className="slide">
                        <img
                            className="w3-image"
                            alt={img.large+index}
                            src={process.env.REACT_APP_S3_BUCKET_BASE_URL + img.large.replace(' ', '%20')}
                            sizes="(max-width: 720px) 96vw, (max-width: 1280px) 63vw, 62vw"
                            srcSet={process.env.REACT_APP_S3_BUCKET_BASE_URL + img.small.replace(' ', '%20') + " 680w," +
                                    process.env.REACT_APP_S3_BUCKET_BASE_URL + img.medium.replace(' ', '%20') + " 952w," +
                                    process.env.REACT_APP_S3_BUCKET_BASE_URL + img.large.replace(' ', '%20') + " 1597w"}
                            />
                </div>
            })
        }

        let status = null;
        let buyButton = null;
        if (this.state.item.stock < 0){
            status = (this.context.lang === 'fr') ? 'Précommander' : 'Pre-order'
            buyButton = <Link to="/cart" onClick={(e) => this.context.addToBasket('item', this.props.match.params.itemId, null, this.state.selectedType)}>{status}</Link>
        // eslint-disable-next-line
        } else if (this.state.item.stock == 0) {
            status = (this.context.lang === 'fr') ? 'Épuisé' : 'Sold out'
            buyButton = <p className="disabled">{status}</p>
        } else {
            status = (this.context.lang === 'fr') ? 'Acheter' : 'Purchase'
            buyButton = <Link to="/cart" onClick={(e) => this.context.addToBasket('item', this.props.match.params.itemId, null, this.state.selectedType)}>{status}</Link>
        }
        
        return <main id="Item" >
            <section className="w3-row">
                
                <div className="item-slideshow w3-col xl8 l9">
                    <div
                        className={this.state.cursorState}
                        onMouseMove={e => this.LeftRightImage(e)}
                        onClick={e => this.changeImg(e)}
                        >
                        <Slider ref={c => (this.slider = c)} {...settings}>
                            {slides}
                        </Slider>
                    </div>
                </div>

                <article className="item-description w3-col xl4 l4">
                    <h1 className="w3-show-inline-block"><i>{this.state.item['name']}</i>{this.state.item['caption']}</h1>
                    <p className="">{front.renderText(this.state.item['description'])}</p>
                    <p className="underhover">{front.renderText(this.state.item['shop_description'])} <u><a href={this.state.item['producer_website']} target="_blank" rel="noopener noreferrer">{front.renderText(this.state.item['producer'])}</a></u></p>

                    <div className="color-boxes w3-hide-medium w3-hide-small">
                        {colors}
                        {colorBoxes}
                    </div>

                    <div className="item-price w3-show-inline-block">
                        <p className="">{front.renderText(this.state.item['price'])} €</p>
                        {buyButton}
                    </div>

                    <div className="color-boxes w3-hide-xlarge w3-hide-large w3-show-inline-block">
                        {colors}
                        {colorBoxes}
                    </div>
                </article>
            </section>
        </main>
    }
}

Item.contextType = UserContext;
