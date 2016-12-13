import React, { Component } from 'react';
import './App.css';
import Navbar from './Navbar.js';
import Board from './Board.js';
import {Button, Modal} from 'react-bootstrap';

class App extends Component {
  constructor() {
    super();
    this.handleClickPrev = this.handleClickPrev.bind(this);
    this.handleClickNext = this.handleClickNext.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.state = {
      articles: [],
      currentArticles: [],
      history: [],
      page: 1,
      showModal: false,
      current: null
    };
    this.getArticlesFromServer();
    this.addRemoteHandler();
    // this.startReceiveCast();
  }

  addRemoteHandler() {
    // handler for the CastMessageBus message event
    window.handleClick = this.handleClickNext;
    window.messageBus.onMessage = function(event) {
      if (event.data === 'next') {
        console.log('receiving chromecast message App');
        window.handleClick();
      }
    };
  }

  startReceiveCast() {
    /* CastReceiver 실행하는 부분 */
    window.castReceiverManager.start({statusText: "Application is starting"});
    console.log('Receiver Manager started');
  }

  getArticlesFromServer() {
    const app = this;
    fetch('http://shinia.net/gisa?date=20161212', {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(function(response) {
      console.log('got response');
      return response.json();
    }).then(function(json){
      app.setState({
        articles: json,
        currentArticles: app.getCurrentArticles(json.slice())
      });
      console.log(json);
    }).catch(function(err) {
      console.log('fetch error');
      console.log(err);
    });
  }

  componentWillMount() {
  }

  close() {
    this.setState({ showModal: false, current: null });
  }

  open(article) {
    console.log(article);
    this.setState({ showModal: true, current: article});
  }

  render() {
    if (this.state.articles.length === 0) {
      return (
        <div className="App">
          <Navbar onPrev={this.handleClickPrev} onNext={this.handleClickNext}/>
          <h1>로딩중!</h1>
        </div>
      );
    } else {
      const article = this.state.current;
      let articleBody, articleBodyComponent;
      if (article) {
        articleBody = {__html: article.body};
        articleBodyComponent = (<div dangerouslySetInnerHTML={articleBody}/> );
      }
      return (
        <div className="App">
          <Navbar onPrev={this.handleClickPrev} onNext={this.handleClickNext}/>
          <Board articles={this.state.currentArticles} onClick={this.open}/>

          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title style={{textAlign: 'center'}}>
                <p style={{ margin: '0px' }}>{article ? article.headline : null}</p>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {article? (article.img != "" ? (<img style={{width: '100%'}} src={article.img} alt="article img"/>):null) : null}
              {article? (article.img != "" ? <hr />:null): null}
              <p>{article ? articleBodyComponent : null}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
  }

  getCurrentArticles(articles) {
    if (articles.length < 6)
      return articles;
    else {
      let newCurrent = [];
      while(newCurrent.length < 7) {
        let item = articles[Math.floor(Math.random()*articles.length)];
        newCurrent.push(item);
      }
      return newCurrent;
    }
  }

  handleClickPrev(e) {
    if (this.state.page === 1)
      return;

    let history = this.state.history.slice();
    let prevArticles = history.pop();
    this.setState({
      history: history,
      currentArticles: prevArticles,
      page: this.state.page - 1
    });
  }

  handleClickNext(e) {
    let nextArticles = this.getCurrentArticles(this.state.articles);
    let history = this.state.history.slice();
    history.push(this.state.currentArticles);
    this.setState({
      currentArticles: nextArticles,
      history: history,
      page: this.state.page + 1
    });
  }
}

export default App;
