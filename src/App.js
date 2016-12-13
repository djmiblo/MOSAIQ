import React, { Component } from 'react';
import {Button, Modal} from 'react-bootstrap';
import './App.css';
import Navbar from './Navbar';
import Board from './Board';
import Remote from './Remote';

class App extends Component {
  constructor() {
    super();
    this.handleClickTitle = this.handleClickTitle.bind(this);
    this.handleClickPrev = this.handleClickPrev.bind(this);
    this.handleClickNext = this.handleClickNext.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.closeSetting = this.closeSetting.bind(this);
    // this.handleEvent = this.handleEvent.bind(this);
    this.state = {
      articles: [],
      currentArticles: [],
      history: [],
      page: 1,
      showModal: false,
      showSetting: false,
      current: null
    };
    this.getArticlesFromServer();
    this.addRemoteHandler();
    this.startReceiveCast();
  }

  addRemoteHandler() {
    // handler for the 'ready' event
    window.castReceiverManager.onReady = function(event) {
      console.log('Received Ready event: ' + JSON.stringify(event.data));
      window.castReceiverManager.setApplicationState("Application status is ready...");
    };

    // handler for 'senderconnected' event
    window.castReceiverManager.onSenderConnected = function(event) {
      console.log('Received Sender Connected event: ' + event.data);
      console.log(window.castReceiverManager.getSender(event.data).userAgent);
    };

    // handler for 'senderdisconnected' event
    window.castReceiverManager.onSenderDisconnected = function(event) {
      console.log('Received Sender Disconnected event: ' + event.data);
      if (window.castReceiverManager.getSenders().length == 0) {
        window.close();
      }
    };

    // create a CastMessageBus to handle messages for a custom namespace
    window.messageBus =
      window.castReceiverManager.getCastMessageBus(
        'urn:x-cast:com.text.caster');
    // handler for the CastMessageBus message event
    window.handlePrev = this.handleClickPrev;
    window.handleNext = this.handleClickNext;
    window.messageBus.onMessage = function(event) {
      if (event.data === 'next') {
        console.log('receiving chromecast message App');
        window.handleNext();
      } else if (event.data == 'prev') {
        window.handlePrev();
      }
    };
  }

  startReceiveCast() {
    /* CastReceiver 실행하는 부분 */
    window.castReceiverManager.start({statusText: "Application is starting"});
  }

  getArticlesFromServer() {
    const app = this;
    fetch('http://shinia.net/gisa?date=20161212', {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(function (response) {
      console.log('got response');
      return response.json();
    }).then(function (json) {
      app.setState({
        articles: json,
        currentArticles: app.getCurrentArticles(json.slice())
      });
    }).catch(function (err) {
      console.log('fetch error');
      console.log(err);
    });
  }

  render() {
    const article = this.state.current;
    // handler for the CastMessageBus message event
    window.handleClick = this.handleClickNext;
    window.messageBus.onMessage = function(event) {
      if (event.data == 'next') {
        console.log('receiving chromecast message App');
        window.handleClick();
      }
    };
    window.castReceiverManager.start({statusText: "Application is starting"});
    console.log('Receiver Manager started');
    return (
      <div className="App">
        <Navbar onPrev={this.handleClickPrev} onNext={this.handleClickNext}/>
        <Board articles={this.state.currentArticles} onClick={this.open}/>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title><p>{article ? article.headline : null}</p></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {article? (<img style={{width: '100%'}} src={article.img}/>) : null}
            {article? (article.img? <hr />:null): null}
            <p>{article ? article.text : null}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
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

  close() {
    this.setState({ showModal: false, current: null });
  }

  open(article) {
    this.setState({showModal: true, current: article});
  }

  handleClickPrev() {
    let nextArticles = this.getCurrentArticles(this.articles);
    this.setState({
      currentArticles: nextArticles,
      page: this.state.page + 1
    });
  }

  handleClickNext() {
    let nextArticles = this.getCurrentArticles(this.articles);
    this.setState({
      currentArticles: nextArticles,
      page: this.state.page + 1
    });
  }

  closeSetting() {
    this.setState({ showSetting: false });
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
          <Navbar onTitle={this.handleClickTitle} onPrev={this.handleClickPrev} onNext={this.handleClickNext}/>
          <Board articles={this.state.currentArticles} onClick={this.open}/>

          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title style={{fontSize: '25px', textAlign: 'center'}}>
                <p style={{ margin: '0px' }}>{article ? article.headline : null}</p>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {article? (article.img != "" ? (<img style={{width: '100%'}} src={article.img} alt="article img"/>):null) : null}
              {article? (article.img != "" ? <hr />:null): null}
              <div>{article ? articleBodyComponent : null}</div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>Close</Button>
            </Modal.Footer>
          </Modal>

          <Modal show={this.state.showSetting} onHide={this.closeSetting}>
            <Modal.Header closeButton>
              <Modal.Title style={{fontSize: '25px', textAlign: 'center'}}>
                Setting
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Remote/>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeSetting}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
  }

  handleClickPrev() {
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

  handleClickNext() {
    let nextArticles = this.getCurrentArticles(this.state.articles);
    let history = this.state.history.slice();
    history.push(this.state.currentArticles);
    this.setState({
      currentArticles: nextArticles,
      history: history,
      page: this.state.page + 1
    });
  }

  handleClickTitle() {
    this.setState({
      showSetting: true
    });
  }
}

export default App;
