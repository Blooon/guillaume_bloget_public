import React, { Component } from "react";
import Navbar from "./Navbar/Navbar.react";
import Items from "./Routes/Items.react";
import Item from "./Routes/Item.react";
import Projects from "./Routes/Projects.react";
import About from "./Routes/About.react";
import Index from "./Routes/Index.react";
import Admin from "./Admin/Admin.react";
import Payments from "./Payements/Payement.react";
import Legal from "./Routes/Legal.react";
import { UserContext } from "./Contexts/UserContext";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { loadDataIfNeeded } from "./Utils/loadDataIfNeeded.utils";
import requestUtils from "./Utils/request.utils";
import Cookies from "./Routes/Components/Cookies.react";

import "./static/stylesheet.css";
import "./static/w3.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: "fr",
      user: {},
      basket: [],
      changeState: this.changeState,
      changeLang: this.changeLang,
      addToBasket: this.addToBasket,
      removeFromBasket: this.removeFromBasket,
      updateBasket: this.removeFromBasket,
      error: null
    };
    this.changeLang = this.changeLang.bind(this);
  }

  changeLang() {
    this.setState({ lang: this.state.lang === "fr" ? "en" : "fr" });
  }

  changeState = newParams => {
    this.setState(newParams);
  };

  addToBasket = async (table, itemId, amount, typeId) => {
    try {
      const body = await requestUtils.post(`/basket/${table}/${itemId}`, {
        amount: amount ? amount : null,
        typeId
      });
      this.setState({ basket: body.data });
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  removeFromBasket = async (table, itemId, typeId) => {
    try {
      const body = await requestUtils.delete(`/basket/${table}/${itemId}`, {
        typeId
      });
      this.setState({ basket: body.data });
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  updateBasket = async () => {
    try {
      loadDataIfNeeded(this, "/basket", {}, "basket");
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  render() {
    loadDataIfNeeded(this, "/basket", {}, "basket");

    return (
      <>
        <UserContext.Provider value={this.state}>
          <Router>
            <>
              <>
                <Navbar changeLang={this.changeLang} lang={this.state.lang} />
                <Route exact path="/" component={Projects} />
                <Route exact path="/about" component={About} />
                <Route exact path="/items/:itemId" component={Item} />
                <Route exact path="/index" component={Index} />
                <Route path="/admin" component={Admin} />
                <Route exact path="/shop" component={Items} />
                <Route exact path="/cart" component={Payments} />
                <Route exact path="/legalnotices" component={Legal} />

                <Cookies changeLang={this.changeLang} lang={this.state.lang} />
              </>
            </>
          </Router>
        </UserContext.Provider>
      </>
    );
  }
}

export default App;
