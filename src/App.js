import React, { Component } from 'react';
import {Button, Modal} from 'react-bootstrap';
import './App.css';
import Navbar from './Navbar';
import Board from './Board';
import Remote from './Remote';
import Setting from './Setting';
import $ from 'jquery';
import Loading from './Loading.gif';
// import SampleNews from './sample';
// const sampleNews = SampleNews;
const sampleNews = [];
const server = "http://52.79.104.225:41212/";
// const server = "http://localhost:41212";
const predictionApi = "https://www.googleapis.com/prediction/v1.6/projects/the-option-102712/trainedmodels/news-identifier-2/predict?key=";
const predictionKey = "AIzaSyCuZJgBL5oe5hhj_bjXu1KK0HYcAma9e5w";
let date = "?date=20161214";
const categories = ['정치', '사회', '경제', '국제', '문화', '기술', '스포츠'];

class App extends Component {
  constructor() {
    super();
    this.handleClickTitle = this.handleClickTitle.bind(this);
    this.handleClickPrev = this.handleClickPrev.bind(this);
    this.handleClickNext = this.handleClickNext.bind(this);
    this.handleRight = this.handleRight.bind(this);
    this.handleLeft = this.handleLeft.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.closeSetting = this.closeSetting.bind(this);
    this.addRemoteHandler = this.addRemoteHandler.bind(this);
    // this.handleEvent = this.handleEvent.bind(this);
    this.state = {
      articles: [],
      currentArticles: [],
      history: [],
      future: [],
      page: 0,
      showModal: false,
      showSetting: false,
      current: null,
      isReceivingRemote: false,
      remoteSelect: null,
      selectIndex: 0,
      isSettingMode: true,
      articlesByCategory: {},
      publishers: []
    };
    this.addRemoteHandler();
    this.startReceiveCast();
    this.testRemote = this.testRemote.bind(this);
    this.toggleSetting = this.toggleSetting.bind(this);
  }

  componentWillMount() {
    // this.getLocalArticles();
    this.getArticlesFromServer();
  }

  getLocalArticles() {
    this.setState({
      articles: sampleNews,
      currentArticles: this.getCurrentArticles(sampleNews.slice())
    });
  }

  addRemoteHandler() {
    const articles = this.state.currentArticles;
    // handler for the 'ready' event
    window.castReceiverManager.onReady = function(event) {
      console.log('Received Ready event: ' + JSON.stringify(event.data));
      window.castReceiverManager.setApplicationState("Application status is ready...");
    };
    const app = this;
    // handler for 'senderconnected' event
    window.castReceiverManager.onSenderConnected = function(event) {
      console.log('Received Sender Connected event: ' + event.data);
      console.log(window.castReceiverManager.getSender(event.data).userAgent);
      app.setState({
        isReceivingRemote: true,
        remoteSelect: articles[0]
      });
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
    window.handleRight = this.handleRight;
    window.handleLeft = this.handleLeft;
    window.handleOk = this.handleOk;
    window.handleClose = this.handleClose;
    window.messageBus.onMessage = function(event) {
      if (event.data === 'next') {
        console.log('receiving chromecast message App');
        window.handleNext();
      } else if (event.data == 'prev') {
        window.handlePrev();
      } else if (event.data == 'right') {
        window.handleRight();
      } else if (event.data == 'left') {
        window.handleLeft();
      } else if (event.data == 'ok') {
        window.handleOk();
      } else if (event.data == 'close') {
        window.handleClose();
      } else if (event.data == 'up') {
        console.log('scroll up');
        $('#articleModal').animate({ scrollTop: -300 }, 'slow');
      } else if (event.data == 'down') {
        console.log('scroll down');
        $('#articleModal').animate({ scrollTop: 300 }, 'slow');
      }
    };
  }

  startReceiveCast() {
    /* CastReceiver 실행하는 부분 */
    window.castReceiverManager.start({statusText: "Application is starting"});
  }

  getArticlesFromServer() {
    const app = this;
    fetch(server + date, {
      method: 'get',
      headers: new Headers({
        'Content-Type': 'application/json',
      })
    }).then(function (response) {
      console.log('got response');
      return response.json();
    }).then(function (json) {
      let publishers = app.getPublishers(json.slice());
      let articlesByCategory = app.getArticlesByCategory(json.slice());
      app.setState({
        articles: json,
        currentArticles: app.getCurrentArticles(json.slice()),
        articlesByCategory: articlesByCategory,
        publishers: publishers
      });
    }).catch(function (err) {
      console.log('fetch error');
      console.log(err);
      let json = app.getLocalArticles();
      app.setState({
        articles: json,
        currentArticles: app.getCurrentArticles(json)
      });
    });
  }
  getPublishers(articles) {
    let publishers = [];
    for (let item of articles) {
      if (!publishers.includes(item.publisher)) {
        publishers.push(item.publisher);
      }
    }
    console.log(publishers);
    return publishers;
  }

  getArticlesByCategory(articles) {
    let articlesByCategory = {};
    for (let category of categories) {
      for (let article of articles) {
        if (article.type == category) {
          if(!articlesByCategory[category])
            articlesByCategory[category] = Object.assign({});
          if (!articlesByCategory[category][article.publisher])
            articlesByCategory[category][article.publisher] = [];
          articlesByCategory[category][article.publisher].push(article);
        }
      }
    }
    return articlesByCategory;
  }

  getCurrentArticles(articles) {
    if (articles.length < 6)
      return articles;
    else {
      let newCurrent = [];
      let lastIndex = [];

      while(newCurrent.length < 7) {
        let index = Math.floor(Math.random()*articles.length);
        let item = articles[index];
        let exist = false;
        for (let i=0;i<lastIndex.length;i++){
          if (lastIndex[i] == index)
            exist = true;
        }
        if (!exist) {
          newCurrent.push(item);
          lastIndex.push(index);
        }
      }
      newCurrent.sort((a, b) => b.length - a.length);
      return newCurrent;
    }
  }

  close() {
    this.setState({ showModal: false, current: null });
  }

  open(article) {
    this.setState({showModal: true, current: article});
  }

  handleRight() {
    let selectIndex = this.state.selectIndex;
    if (selectIndex < this.state.currentArticles.length - 1) {
      this.setState({
        selectIndex: selectIndex + 1,
        remoteSelect: this.state.currentArticles[selectIndex + 1]
      });
    }
  }

  handleLeft() {
    let selectIndex = this.state.selectIndex;
    if (selectIndex > 0) {
      this.setState({
        selectIndex: selectIndex - 1,
        remoteSelect: this.state.currentArticles[selectIndex - 1]
      });
    }
  }

  handleOk() {
    this.setState({
      showModal: true, current: this.state.remoteSelect
    });
  }

  handleClose() {
    this.setState({
      showModal: false, current: null
    });
  }

  closeSetting() {
    this.setState({ showSetting: false });
  }

  testRemote() {
    const articles = this.state.currentArticles;
    this.setState({
      isReceivingRemote: true,
      remoteSelect: articles[0],
      selectIndex: 0
    });
  }

  renderSetting() {
    if (this.state.isSettingMode) {
      return (
        <div className="btn-group btn-group-lg" role="group">
          <button onClick={this.toggleSetting} type="button" className="btn btn-default page-con active">Setting</button>
          <button onClick={this.toggleSetting} type="button" className="btn btn-default page-con ">Remote</button>
        </div>);
    } else {
      return (
        <div className="btn-group btn-group-lg" role="group">
          <button onClick={this.toggleSetting} type="button" className="btn btn-default page-con">Setting</button>
          <button onClick={this.toggleSetting} type="button" className="btn btn-default page-con active">Remote</button>
        </div>);
    }
  }

  toggleSetting() {
    this.setState({
      isSettingMode: !this.state.isSettingMode
    });
  }

  render() {
    if (this.state.articles.length === 0) {
      return (
        <div className="App">
          <Navbar onPrev={this.handleClickPrev} onNext={this.handleClickNext}/>
          <div style={{width:'100%'}}>
            <img src={Loading} style={{width: 'auto', height: window.innerHeight - 50}} />
          </div>
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
          <Navbar ok={this.handleOk} left={this.handleLeft} right={this.handleRight} testRemote={this.testRemote} onTitle={this.handleClickTitle} onPrev={this.handleClickPrev} onNext={this.handleClickNext}/>
          <Board isRemote={this.state.isReceivingRemote} remoteSelect={this.state.remoteSelect} articles={this.state.currentArticles} onClick={this.open}/>

          <Modal id="articleModal" show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title style={{fontSize: '25px', textAlign: 'center'}}>
                <p style={{ margin: '0px' }}>{article ? article.headline : null}</p>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {article? (article.img != "" ? (<img style={{width: '100%'}} src={article.img} alt="article img"/>):null) : null}
              {article? (article.img != "" ? <hr />:null): null}
              <div style={{fontSize:'15px'}}>{article ? articleBodyComponent : null}</div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>Close</Button>
            </Modal.Footer>
          </Modal>

          <Modal show={this.state.showSetting} onHide={this.closeSetting}>
            <Modal.Header>
              <Modal.Title>
                  { this.renderSetting() }
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              { this.state.isSettingMode? <Setting publishers={this.state.publishers} />:<Remote/>}
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
    if (this.state.page === 0)
      return;

    console.log(this.state.future.length);
    const currentArticles = this.state.currentArticles.slice();
    let history = this.state.history.slice();
    const newCurrentArticles = history.pop();
    let future = this.state.future.slice();
    future.push(currentArticles);
    this.setState({
      future: future,
      history: history,
      currentArticles: newCurrentArticles,
      page: this.state.page - 1
    });

    if (this.state.remoteSelect) {
      this.setState({
        remoteSelect: newCurrentArticles[0],
        selectIndex: 0,
      });
    }
  }

  handleClickNext() {
    let nextArticles = [];
    let future = this.state.future.slice();
    let history = this.state.history.slice();
    history.push(this.state.currentArticles);

    if (future.length != 0) {
      nextArticles = future.pop();
    } else {
      nextArticles = this.getCurrentArticles(this.state.articles);
    }
    this.setState({
      currentArticles: nextArticles,
      history: history,
      page: this.state.page + 1,
      future: future,
    });

    if (this.state.remoteSelect) {
      this.setState({
        remoteSelect: nextArticles[0],
        selectIndex: 0,
      });
    }
  }

  handleClickTitle() {
    this.setState({
      showSetting: true
    });
  }
}

export default App;
