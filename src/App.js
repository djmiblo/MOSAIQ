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

    /* CastReceiver 실행하는 부분 */
    // window.castReceiverManager.start({statusText: "Application is starting"});
    // console.log('Receiver Manager started');
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
    const article = this.state.current;
    // handler for the CastMessageBus message event
    window.handleClick = this.handleClickNext;
    window.messageBus.onMessage = function(event) {
      if (event.data === 'next') {
        console.log('receiving chromecast message App');
        window.handleClick();
      }
    };

    let test = "<h1>hello World</h1>";

    if (this.state.articles.length === 0) {
      return (
        <div className="App">
          <Navbar onPrev={this.handleClickPrev} onNext={this.handleClickNext}/>
          <h1>로딩중!</h1>
        </div>
      );
    } else {
      return (
        <div className="App">
          <Navbar onPrev={this.handleClickPrev} onNext={this.handleClickNext}/>
          <Board articles={this.state.currentArticles} onClick={this.open}/>

          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title><p>{article ? article.headline : null}</p></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {article? (article.img != "" ? (<img style={{width: '100%'}} src={article.img} alt="article img"/>):null) : null}
              {article? (article.img != "" ? <hr />:null): null}
              <p>{article ? article.body : null}</p>
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

//   getArticlesFromSever() {
//     let sample_short = {
//       headline: "Short Sample",
//       text: "국회는 이날 오후 3시 본회의를 열고 재적 의원 300명 중 299명이 참석한 가운데 찬성 234표, 반대 56표, 무효 7표, 기권 2표로 탄핵안을 가결했다. 야당과 무소속 의원 \
//       172명이 탄핵 찬성 의사를 밝힌 점을 감안하면 새누리당에서 최소 62명이 찬성표를 던진 셈이다. 유일하게 ",
//       body: (<div>
//           <div>
//             <b>憲政사상 2번째… 대통령 권한정지, 黃총리가 대행<p>與도 최소 62명 찬성… 헌법재판소 탄핵심판 착수</p>
//               <p>朴대통령 "국민께 송구, 憲裁 심판에 담담히 대응"</p><p>野 "黃대행 체제 일단 지켜볼 것"</p></b>
//             <p><b></b></p>
//             <p></p><p></p><p></p><p><span class="end_photo_org"></span></p>
//           </div></div>
//       )
//     };
//
//     let sample_short_img = {
//       headline: "Short Sample",
//       img: "http://img.insight.co.kr/static/2016/01/22/300/106cd37od93vqy68ps3a.jpg",
//       text: "국회는 이날 오후 3시 본회의를 열고 재적 의원 300명 중 299명이 참석한 가운데 찬성 234표, 반대 56표, 무효 7표, 기권 2표로 탄핵안을 가결했다. 야당과 무소속 의원 \
//       172명이 탄핵 찬성 의사를 밝힌 점을 감안하면 새누리당에서 최소 62명이 찬성표를 던진 셈이다. 유일하게 ",
//       body: (<div>
//           <div>
//             <b>憲政사상 2번째… 대통령 권한정지, 黃총리가 대행<p>與도 최소 62명 찬성… 헌법재판소 탄핵심판 착수</p>
//               <p>朴대통령 "국민께 송구, 憲裁 심판에 담담히 대응"</p><p>野 "黃대행 체제 일단 지켜볼 것"</p></b>
//             <p><b></b></p>
//             <p></p><p></p><p></p><p><span class="end_photo_org"></span></p>
//           </div></div>
//       )
//     };
//
//     let sample_middle = {
//       headline: "Middle Sample",
//       body: (<div>
//           <div>
//             <b>憲政사상 2번째… 대통령 권한정지, 黃총리가 대행<p>與도 최소 62명 찬성… 헌법재판소 탄핵심판 착수</p>
//               <p>朴대통령 "국민께 송구, 憲裁 심판에 담담히 대응"</p><p>野 "黃대행 체제 일단 지켜볼 것"</p></b>
//             <p><b></b></p>
//             <p>국회는 이날 오후 3시 본회의를 열고 재적 의원 300명 중 299명이 참석한 가운데 찬성 234표, 반대 56표, 무효 7표, 기권 2표로 탄핵안을 가결했다. 야당과 무소속 의원
//               172명이 탄핵 찬성 의사를 밝힌 점을 감안하면 새누리당에서 최소 62명이 찬성표를 던진 셈이다. 유일하게 투표에 불참한 새누리당 친박계 최경환 의원은 본회의장에 입장했다가 투표 시작 전
//               퇴장했다. 박 대통령 탄핵소추안에는 '최순실 게이트'와 관련한 헌법 위반 및 직권남용·뇌물죄 등이 적시됐다. 박 대통령은 탄핵안 가결 직후인 오후 5시 국무위원 간담회를 갖고 "저의 부덕과
//               불찰로 국가적 혼란을 겪게 돼 국민 여러분께 송구하다"며 "헌법재판소의 탄핵 심판과 특검의 수사에 차분하고 담담한 마음가짐으로 대응해나갈 것"이라고 말했다.</p>
//             <p></p><p></p><p></p><p><span></span></p>
//           </div>
//         </div>
//       ),
//       text: "국회는 이날 오후 3시 본회의를 열고 재적 의원 300명 중 299명이 참석한 가운데 찬성 234표, 반대 56표, 무효 7표, 기권 2표로 탄핵안을 가결했다. 야당과 무소속 의원 \
//       172명이 탄핵 찬성 의사를 밝힌 점을 감안하면 새누리당에서 최소 62명이 찬성표를 던진 셈이다. 유일하게 투표에 불참한 새누리당 친박계 최경환 의원은 본회의장에 입장했다가 투표 시작 전\
//     퇴장했다. 박 대통령 탄핵소추안에는 '최순실 게이트'와 관련한 헌법 위반 및 직권남용·뇌물죄 등이 적시됐다. 박 대통령은 탄핵안 가결 직후인 오후 5시 국무위원 간담회를 갖고 '저의 부덕과\
//     불찰로 국가적 혼란을 겪게 돼 국민 여러분께 송구하다'며 '헌법재판소의 탄핵 심판과 특검의 수사에 차분하고 담담한 마음가짐으로 대응해나갈 것'이라고 말했다.",
//     };
//
//     let sample_middle_img = {
//       headline: "Middle Sample",
//       img: "http://m.jobnjoy.com/files/editor/1455847733073_1.png",
//       body: (<div>
//           <div>
//             <b>憲政사상 2번째… 대통령 권한정지, 黃총리가 대행<p>與도 최소 62명 찬성… 헌법재판소 탄핵심판 착수</p>
//               <p>朴대통령 "국민께 송구, 憲裁 심판에 담담히 대응"</p><p>野 "黃대행 체제 일단 지켜볼 것"</p></b>
//             <p><b></b></p>
//             <p>국회는 이날 오후 3시 본회의를 열고 재적 의원 300명 중 299명이 참석한 가운데 찬성 234표, 반대 56표, 무효 7표, 기권 2표로 탄핵안을 가결했다. 야당과 무소속 의원
//               172명이 탄핵 찬성 의사를 밝힌 점을 감안하면 새누리당에서 최소 62명이 찬성표를 던진 셈이다. 유일하게 투표에 불참한 새누리당 친박계 최경환 의원은 본회의장에 입장했다가 투표 시작 전
//               퇴장했다. 박 대통령 탄핵소추안에는 '최순실 게이트'와 관련한 헌법 위반 및 직권남용·뇌물죄 등이 적시됐다. 박 대통령은 탄핵안 가결 직후인 오후 5시 국무위원 간담회를 갖고 "저의 부덕과
//               불찰로 국가적 혼란을 겪게 돼 국민 여러분께 송구하다"며 "헌법재판소의 탄핵 심판과 특검의 수사에 차분하고 담담한 마음가짐으로 대응해나갈 것"이라고 말했다.</p>
//             <p></p><p></p><p></p><p><span></span></p>
//           </div>
//         </div>
//       ),
//       text: "국회는 이날 오후 3시 본회의를 열고 재적 의원 300명 중 299명이 참석한 가운데 찬성 234표, 반대 56표, 무효 7표, 기권 2표로 탄핵안을 가결했다. 야당과 무소속 의원 \
//       172명이 탄핵 찬성 의사를 밝힌 점을 감안하면 새누리당에서 최소 62명이 찬성표를 던진 셈이다. 유일하게 투표에 불참한 새누리당 친박계 최경환 의원은 본회의장에 입장했다가 투표 시작 전\
//     퇴장했다. 박 대통령 탄핵소추안에는 '최순실 게이트'와 관련한 헌법 위반 및 직권남용·뇌물죄 등이 적시됐다. 박 대통령은 탄핵안 가결 직후인 오후 5시 국무위원 간담회를 갖고 '저의 부덕과\
//     불찰로 국가적 혼란을 겪게 돼 국민 여러분께 송구하다'며 '헌법재판소의 탄핵 심판과 특검의 수사에 차분하고 담담한 마음가짐으로 대응해나갈 것'이라고 말했다.",
//     };
//
//     let sample_long = {
//       headline: "long Sample",
//       img: "http://imgnews.naver.net/image/021/2016/12/09/2016120901070112054001_b_99_20161209115709.jpg?type=w430",
//       body: (<div>
//           <div>
//             <b>憲政사상 2번째… 대통령 권한정지, 黃총리가 대행<p>與도 최소 62명 찬성… 헌법재판소 탄핵심판 착수</p>
//               <p>朴대통령 "국민께 송구, 憲裁 심판에 담담히 대응"</p><p>野 "黃대행 체제 일단 지켜볼 것"</p></b>
//             <p><b></b></p>
//             <p>국회는 이날 오후 3시 본회의를 열고 재적 의원 300명 중 299명이 참석한 가운데 찬성 234표, 반대 56표, 무효 7표, 기권 2표로 탄핵안을 가결했다. 야당과 무소속 의원 172명이 탄핵 찬성 의사를 밝힌 점을 감안하면 새누리당에서 최소 62명이 찬성표를 던진 셈이다. 유일하게 투표에 불참한 새누리당 친박계 최경환 의원은 본회의장에 입장했다가 투표 시작 전 퇴장했다. 박 대통령 탄핵소추안에는 '최순실 게이트'와 관련한 헌법 위반 및 직권남용·뇌물죄 등이 적시됐다. 박 대통령은 탄핵안 가결 직후인 오후 5시 국무위원 간담회를 갖고 "저의 부덕과 불찰로 국가적 혼란을 겪게 돼 국민 여러분께 송구하다"며 "헌법재판소의 탄핵 심판과 특검의 수사에 차분하고 담담한 마음가짐으로 대응해나갈 것"이라고 말했다.</p>
//             <p></p><p></p><p></p><p><span></span></p>
//             <p>정세균 국회의장은 이날 박 대통령 탄핵안 가결 이후 탄핵소추의결서를 새누리당 소속 권성동 국회 법제사법위원장에게 전달했다. 권 위원장은 탄핵소추의결서 정본과 사본을 각각 헌법재판소와 청와대로 보냈다. 이에 따라 박 대통령은 사본이 청와대에 전달된 오후 7시 3분부터 대통령 직무가 정지됐고, 헌재는 탄핵 심판 절차에 착수했다. 헌재는 헌법에 따라 180일 이내인 내년 6월 초까지 대통령 탄핵 여부를 결정해야 한다. 헌법재판관 9명 중 6명이 찬성해야 탄핵이 최종 결정된다. 헌재가 국회의 탄핵소추 청구를 인용하면 1948년 정부 수립 이후 처음으로 대통령이 임기 중에 파면되게 된다. 박 대통령이 파면되면 헌법에 따라 60일 내에 대선을 치러야 한다.</p>
//           </div></div>
//       ),
//       text: "국회는 이날 오후 3시 본회의를 열고 재적 의원 300명 중 299명이 참석한 가운데 찬성 234표, 반대 56표, 무효 7표, 기권 2표로 탄핵안을 가결했다. 야당과 무소속 의원 \
//       172명이 탄핵 찬성 의사를 밝힌 점을 감안하면 새누리당에서 최소 62명이 찬성표를 던진 셈이다. 유일하게 투표에 불참한 새누리당 친박계 최경환 의원은 본회의장에 입장했다가 투표 시작 전\
//     퇴장했다. 박 대통령 탄핵소추안에는 '최순실 게이트'와 관련한 헌법 위반 및 직권남용·뇌물죄 등이 적시됐다. 박 대통령은 탄핵안 가결 직후인 오후 5시 국무위원 간담회를 갖고 '저의 부덕과\
//     불찰로 국가적 혼란을 겪게 돼 국민 여러분께 송구하다'며 '헌법재판소의 탄핵 심판과 특검의 수사에 차분하고 담담한 마음가짐으로 대응해나갈 것'이라고 말했다. 국회는 이날 오후 3시 본회의를 열고 재적 의원 300명 중 299명이 참석한 가운데 찬성 234표, 반대 56표, 무효 7표, 기권 2표로 탄핵안을 가결했다. 야당과 무소속 의원 \
//       172명이 탄핵 찬성 의사를 밝힌 점을 감안하면 새누리당에서 최소 62명이 찬성표를 던진 셈이다. 유일하게 투표에 불참한 새누리당 친박계 최경환 의원은 본회의장에 입장했다가 투표 시작 전\
//     퇴장했다. 박 대통령 탄핵소추안에는 '최순실 게이트'와 관련한 헌법 위반 및 직권남용·뇌물죄 등이 적시됐다. 박 대통령은 탄핵안 가결 직후인 오후 5시 국무위원 간담회를 갖고 '저의 부덕과\
//     불찰로 국가적 혼란을 겪게 돼 국민 여러분께 송구하다'며 '헌법재판소의 탄핵 심판과 특검의 수사에 차분하고 담담한 마음가짐으로 대응해나갈 것'이라고 말했다.",
//     };
//
//     sample_short = Object.assign({}, sample_short, {length: sample_short.text.length});
//     sample_short_img = Object.assign({}, sample_short_img, {length: sample_short.text.length});
//     sample_middle = Object.assign({}, sample_middle, {length: sample_middle.text.length});
//     sample_middle_img = Object.assign({}, sample_middle_img, {length: sample_middle.text.length});
//     sample_long = Object.assign({}, sample_long, {length: sample_long.text.length});
//
//     return [sample_short_img, sample_short, sample_short, sample_middle_img,sample_middle_img, sample_middle, sample_middle, sample_middle, sample_long];
//   }
}

export default App;
