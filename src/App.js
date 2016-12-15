import React, { Component } from 'react';
import {Button, Modal} from 'react-bootstrap';
import './App.css';
import Navbar from './Navbar';
import Board from './Board';
import Remote from './Remote';
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
      selectIndex: 0
    };
    this.addRemoteHandler();
    this.startReceiveCast();
    this.testRemote = this.testRemote.bind(this);
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
      app.setState({
        articles: json,
        currentArticles: app.getCurrentArticles(json.slice())
      });
    }).catch(function (err) {
      console.log('fetch error');
      console.log(err);
      let json = app.getArticlesOffline();
      app.setState({
        articles: json,
        currentArticles: app.getCurrentArticles(json.slice())
      });
    });
  }

  getArticleTypes() {
    const app = this;
    fetch(predictionApi + predictionKey, {
      method: 'post',
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
      let json = app.getArticlesOffline();
      app.setState({
        articles: json,
        currentArticles: app.getCurrentArticles(json.slice())
      });
    });
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

  render() {
    if (this.state.articles.length === 0) {
      return (
        <div className="App">
          <Navbar onPrev={this.handleClickPrev} onNext={this.handleClickNext}/>
          <img src={Loading} style={{height: window.innerHeight - 50}} />
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
              <div>{article ? articleBodyComponent : null}</div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>Close</Button>
            </Modal.Footer>
          </Modal>

          <Modal show={this.state.showSetting} onHide={this.closeSetting}>
            <Modal.Header closeButton>
              <Modal.Title style={{fontSize: '25px', textAlign: 'center'}}>
                Remote
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

  getArticlesOffline() {
    let sample_short = {
      headline: "Short Sample",
      text: "국회는 이날 오후 3시 본회의를 열고 재적 의원 300명 중 299명이 참석한 가운데 찬성 234표, 반대 56표, 무효 7표, 기권 2표로 탄핵안을 가결했다. 야당과 무소속 의원 \
      172명이 탄핵 찬성 의사를 밝힌 점을 감안하면 새누리당에서 최소 62명이 찬성표를 던진 셈이다. 유일하게 ",
      body: (<div>
          <div>
            <b>憲政사상 2번째… 대통령 권한정지, 黃총리가 대행<p>與도 최소 62명 찬성… 헌법재판소 탄핵심판 착수</p>
              <p>朴대통령 "국민께 송구, 憲裁 심판에 담담히 대응"</p><p>野 "黃대행 체제 일단 지켜볼 것"</p></b>
            <p><b></b></p>
            <p></p><p></p><p></p><p><span class="end_photo_org"></span></p>
          </div></div>
      )
    };

    let sample_short_img = {
      headline: "Short Sample",
      img: "http://img.insight.co.kr/static/2016/01/22/300/106cd37od93vqy68ps3a.jpg",
      text: "국회는 이날 오후 3시 본회의를 열고 재적 의원 300명 중 299명이 참석한 가운데 찬성 234표, 반대 56표, 무효 7표, 기권 2표로 탄핵안을 가결했다. 야당과 무소속 의원 \
      172명이 탄핵 찬성 의사를 밝힌 점을 감안하면 새누리당에서 최소 62명이 찬성표를 던진 셈이다. 유일하게 ",
      body: (<div>
          <div>
            <b>憲政사상 2번째… 대통령 권한정지, 黃총리가 대행<p>與도 최소 62명 찬성… 헌법재판소 탄핵심판 착수</p>
              <p>朴대통령 "국민께 송구, 憲裁 심판에 담담히 대응"</p><p>野 "黃대행 체제 일단 지켜볼 것"</p></b>
            <p><b></b></p>
            <p></p><p></p><p></p><p><span class="end_photo_org"></span></p>
          </div></div>
      )
    };

    let sample_middle = {
      headline: "Middle Sample",
      body: (<div>
          <div>
            <b>憲政사상 2번째… 대통령 권한정지, 黃총리가 대행<p>與도 최소 62명 찬성… 헌법재판소 탄핵심판 착수</p>
              <p>朴대통령 "국민께 송구, 憲裁 심판에 담담히 대응"</p><p>野 "黃대행 체제 일단 지켜볼 것"</p></b>
            <p><b></b></p>
            <p>국회는 이날 오후 3시 본회의를 열고 재적 의원 300명 중 299명이 참석한 가운데 찬성 234표, 반대 56표, 무효 7표, 기권 2표로 탄핵안을 가결했다. 야당과 무소속 의원
              172명이 탄핵 찬성 의사를 밝힌 점을 감안하면 새누리당에서 최소 62명이 찬성표를 던진 셈이다. 유일하게 투표에 불참한 새누리당 친박계 최경환 의원은 본회의장에 입장했다가 투표 시작 전
              퇴장했다. 박 대통령 탄핵소추안에는 '최순실 게이트'와 관련한 헌법 위반 및 직권남용·뇌물죄 등이 적시됐다. 박 대통령은 탄핵안 가결 직후인 오후 5시 국무위원 간담회를 갖고 "저의 부덕과
              불찰로 국가적 혼란을 겪게 돼 국민 여러분께 송구하다"며 "헌법재판소의 탄핵 심판과 특검의 수사에 차분하고 담담한 마음가짐으로 대응해나갈 것"이라고 말했다.</p>
            <p></p><p></p><p></p><p><span></span></p>
          </div>
        </div>
      ),
      text: "국회는 이날 오후 3시 본회의를 열고 재적 의원 300명 중 299명이 참석한 가운데 찬성 234표, 반대 56표, 무효 7표, 기권 2표로 탄핵안을 가결했다. 야당과 무소속 의원 \
      172명이 탄핵 찬성 의사를 밝힌 점을 감안하면 새누리당에서 최소 62명이 찬성표를 던진 셈이다. 유일하게 투표에 불참한 새누리당 친박계 최경환 의원은 본회의장에 입장했다가 투표 시작 전\
    퇴장했다. 박 대통령 탄핵소추안에는 '최순실 게이트'와 관련한 헌법 위반 및 직권남용·뇌물죄 등이 적시됐다. 박 대통령은 탄핵안 가결 직후인 오후 5시 국무위원 간담회를 갖고 '저의 부덕과\
    불찰로 국가적 혼란을 겪게 돼 국민 여러분께 송구하다'며 '헌법재판소의 탄핵 심판과 특검의 수사에 차분하고 담담한 마음가짐으로 대응해나갈 것'이라고 말했다.",
    };

    let sample_middle_img = {
      headline: "Middle Sample",
      img: "http://m.jobnjoy.com/files/editor/1455847733073_1.png",
      body: (<div>
          <div>
            <b>憲政사상 2번째… 대통령 권한정지, 黃총리가 대행<p>與도 최소 62명 찬성… 헌법재판소 탄핵심판 착수</p>
              <p>朴대통령 "국민께 송구, 憲裁 심판에 담담히 대응"</p><p>野 "黃대행 체제 일단 지켜볼 것"</p></b>
            <p><b></b></p>
            <p>국회는 이날 오후 3시 본회의를 열고 재적 의원 300명 중 299명이 참석한 가운데 찬성 234표, 반대 56표, 무효 7표, 기권 2표로 탄핵안을 가결했다. 야당과 무소속 의원
              172명이 탄핵 찬성 의사를 밝힌 점을 감안하면 새누리당에서 최소 62명이 찬성표를 던진 셈이다. 유일하게 투표에 불참한 새누리당 친박계 최경환 의원은 본회의장에 입장했다가 투표 시작 전
              퇴장했다. 박 대통령 탄핵소추안에는 '최순실 게이트'와 관련한 헌법 위반 및 직권남용·뇌물죄 등이 적시됐다. 박 대통령은 탄핵안 가결 직후인 오후 5시 국무위원 간담회를 갖고 "저의 부덕과
              불찰로 국가적 혼란을 겪게 돼 국민 여러분께 송구하다"며 "헌법재판소의 탄핵 심판과 특검의 수사에 차분하고 담담한 마음가짐으로 대응해나갈 것"이라고 말했다.</p>
            <p></p><p></p><p></p><p><span></span></p>
          </div>
        </div>
      ),
      text: "국회는 이날 오후 3시 본회의를 열고 재적 의원 300명 중 299명이 참석한 가운데 찬성 234표, 반대 56표, 무효 7표, 기권 2표로 탄핵안을 가결했다. 야당과 무소속 의원 \
      172명이 탄핵 찬성 의사를 밝힌 점을 감안하면 새누리당에서 최소 62명이 찬성표를 던진 셈이다. 유일하게 투표에 불참한 새누리당 친박계 최경환 의원은 본회의장에 입장했다가 투표 시작 전\
    퇴장했다. 박 대통령 탄핵소추안에는 '최순실 게이트'와 관련한 헌법 위반 및 직권남용·뇌물죄 등이 적시됐다. 박 대통령은 탄핵안 가결 직후인 오후 5시 국무위원 간담회를 갖고 '저의 부덕과\
    불찰로 국가적 혼란을 겪게 돼 국민 여러분께 송구하다'며 '헌법재판소의 탄핵 심판과 특검의 수사에 차분하고 담담한 마음가짐으로 대응해나갈 것'이라고 말했다.",
    };

    let sample_long = {
      headline: "long Sample",
      img: "http://imgnews.naver.net/image/021/2016/12/09/2016120901070112054001_b_99_20161209115709.jpg?type=w430",
      body: (<div>
          <div>
            <b>憲政사상 2번째… 대통령 권한정지, 黃총리가 대행<p>與도 최소 62명 찬성… 헌법재판소 탄핵심판 착수</p>
              <p>朴대통령 "국민께 송구, 憲裁 심판에 담담히 대응"</p><p>野 "黃대행 체제 일단 지켜볼 것"</p></b>
            <p><b></b></p>
            <p>국회는 이날 오후 3시 본회의를 열고 재적 의원 300명 중 299명이 참석한 가운데 찬성 234표, 반대 56표, 무효 7표, 기권 2표로 탄핵안을 가결했다. 야당과 무소속 의원 172명이 탄핵 찬성 의사를 밝힌 점을 감안하면 새누리당에서 최소 62명이 찬성표를 던진 셈이다. 유일하게 투표에 불참한 새누리당 친박계 최경환 의원은 본회의장에 입장했다가 투표 시작 전 퇴장했다. 박 대통령 탄핵소추안에는 '최순실 게이트'와 관련한 헌법 위반 및 직권남용·뇌물죄 등이 적시됐다. 박 대통령은 탄핵안 가결 직후인 오후 5시 국무위원 간담회를 갖고 "저의 부덕과 불찰로 국가적 혼란을 겪게 돼 국민 여러분께 송구하다"며 "헌법재판소의 탄핵 심판과 특검의 수사에 차분하고 담담한 마음가짐으로 대응해나갈 것"이라고 말했다.</p>
            <p></p><p></p><p></p><p><span></span></p>
            <p>정세균 국회의장은 이날 박 대통령 탄핵안 가결 이후 탄핵소추의결서를 새누리당 소속 권성동 국회 법제사법위원장에게 전달했다. 권 위원장은 탄핵소추의결서 정본과 사본을 각각 헌법재판소와 청와대로 보냈다. 이에 따라 박 대통령은 사본이 청와대에 전달된 오후 7시 3분부터 대통령 직무가 정지됐고, 헌재는 탄핵 심판 절차에 착수했다. 헌재는 헌법에 따라 180일 이내인 내년 6월 초까지 대통령 탄핵 여부를 결정해야 한다. 헌법재판관 9명 중 6명이 찬성해야 탄핵이 최종 결정된다. 헌재가 국회의 탄핵소추 청구를 인용하면 1948년 정부 수립 이후 처음으로 대통령이 임기 중에 파면되게 된다. 박 대통령이 파면되면 헌법에 따라 60일 내에 대선을 치러야 한다.</p>
          </div></div>
      ),
      text: "국회는 이날 오후 3시 본회의를 열고 재적 의원 300명 중 299명이 참석한 가운데 찬성 234표, 반대 56표, 무효 7표, 기권 2표로 탄핵안을 가결했다. 야당과 무소속 의원 \
      172명이 탄핵 찬성 의사를 밝힌 점을 감안하면 새누리당에서 최소 62명이 찬성표를 던진 셈이다. 유일하게 투표에 불참한 새누리당 친박계 최경환 의원은 본회의장에 입장했다가 투표 시작 전\
    퇴장했다. 박 대통령 탄핵소추안에는 '최순실 게이트'와 관련한 헌법 위반 및 직권남용·뇌물죄 등이 적시됐다. 박 대통령은 탄핵안 가결 직후인 오후 5시 국무위원 간담회를 갖고 '저의 부덕과\
    불찰로 국가적 혼란을 겪게 돼 국민 여러분께 송구하다'며 '헌법재판소의 탄핵 심판과 특검의 수사에 차분하고 담담한 마음가짐으로 대응해나갈 것'이라고 말했다. 국회는 이날 오후 3시 본회의를 열고 재적 의원 300명 중 299명이 참석한 가운데 찬성 234표, 반대 56표, 무효 7표, 기권 2표로 탄핵안을 가결했다. 야당과 무소속 의원 \
      172명이 탄핵 찬성 의사를 밝힌 점을 감안하면 새누리당에서 최소 62명이 찬성표를 던진 셈이다. 유일하게 투표에 불참한 새누리당 친박계 최경환 의원은 본회의장에 입장했다가 투표 시작 전\
    퇴장했다. 박 대통령 탄핵소추안에는 '최순실 게이트'와 관련한 헌법 위반 및 직권남용·뇌물죄 등이 적시됐다. 박 대통령은 탄핵안 가결 직후인 오후 5시 국무위원 간담회를 갖고 '저의 부덕과\
    불찰로 국가적 혼란을 겪게 돼 국민 여러분께 송구하다'며 '헌법재판소의 탄핵 심판과 특검의 수사에 차분하고 담담한 마음가짐으로 대응해나갈 것'이라고 말했다.",
    };

    sample_short = Object.assign({}, sample_short, {headline:"sample 1", length: sample_short.text.length});
    sample_short_img = Object.assign({}, sample_short_img, {headline:"sample 2", length: sample_short.text.length + 5});
    sample_middle = Object.assign({}, sample_middle, {headline:"sample 3", length: sample_middle.text.length - 1});
    let sample_middle_img1 = Object.assign({}, sample_middle_img, {headline:"sample 4", length: sample_middle.text.length});
    let sample_middle_img2 = Object.assign({}, sample_middle_img, {headline:"sample 5", length: sample_middle.text.length + 10});
    sample_long = Object.assign({}, sample_long, {headline:"sample 6", length: sample_long.text.length});
    let sample_long2 = Object.assign({}, sample_long, {headline:"sample 7", length: sample_long.text.length + 10});

    return [sample_short, sample_short_img, sample_middle, sample_middle_img1, sample_middle_img2, sample_long, sample_long2];
  }
}

export default App;
