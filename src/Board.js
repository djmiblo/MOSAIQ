/**
 * Created by edchoi on 12/9/16.
 */
import React, { Component } from 'react';
import Row from './Row';

class Board extends Component {
  constructor() {
    super();
  }

  render() {
    let articles = this.getArticlesFromSever();
    let articleRows = this.divideArticles(articles);
    let totalAvailHeight = window.innerHeight;
    let totalArticleLength = articles.reduce((a,b) => a + b.length, 0);
    let articleHeights = articleRows.map((item) => {
      return (item.reduce((a,b) => a + b.length, 0) / totalArticleLength) * totalAvailHeight;
    });

    return (
      <table className="table table-bordered">
          <Row articles = {articleRows[0]} height = {articleHeights[0]}/>
          <Row articles = {articleRows[1]} height = {articleHeights[1]}/>
      </table>
    );
  }

  divideArticles(articles) {
    return [[articles[articles.length - 1], articles[0]], [articles[3], articles[2], articles[1]]];
  }

  getArticlesFromSever() {
    let sample_short = {
      headline: "Short Sample",
      length: 15,
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
      length: 35,
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
      )
    };

    let sample_long = {
      headline: "long Sample",
      length: 55,
      body: (<div>
        <div>
          <b>憲政사상 2번째… 대통령 권한정지, 黃총리가 대행<p>與도 최소 62명 찬성… 헌법재판소 탄핵심판 착수</p>
            <p>朴대통령 "국민께 송구, 憲裁 심판에 담담히 대응"</p><p>野 "黃대행 체제 일단 지켜볼 것"</p></b>
          <p><b></b></p>
          <p>국회는 이날 오후 3시 본회의를 열고 재적 의원 300명 중 299명이 참석한 가운데 찬성 234표, 반대 56표, 무효 7표, 기권 2표로 탄핵안을 가결했다. 야당과 무소속 의원 172명이 탄핵 찬성 의사를 밝힌 점을 감안하면 새누리당에서 최소 62명이 찬성표를 던진 셈이다. 유일하게 투표에 불참한 새누리당 친박계 최경환 의원은 본회의장에 입장했다가 투표 시작 전 퇴장했다. 박 대통령 탄핵소추안에는 '최순실 게이트'와 관련한 헌법 위반 및 직권남용·뇌물죄 등이 적시됐다. 박 대통령은 탄핵안 가결 직후인 오후 5시 국무위원 간담회를 갖고 "저의 부덕과 불찰로 국가적 혼란을 겪게 돼 국민 여러분께 송구하다"며 "헌법재판소의 탄핵 심판과 특검의 수사에 차분하고 담담한 마음가짐으로 대응해나갈 것"이라고 말했다.</p>
          <p></p><p></p><p></p><p><span></span></p>
          <p>정세균 국회의장은 이날 박 대통령 탄핵안 가결 이후 탄핵소추의결서를 새누리당 소속 권성동 국회 법제사법위원장에게 전달했다. 권 위원장은 탄핵소추의결서 정본과 사본을 각각 헌법재판소와 청와대로 보냈다. 이에 따라 박 대통령은 사본이 청와대에 전달된 오후 7시 3분부터 대통령 직무가 정지됐고, 헌재는 탄핵 심판 절차에 착수했다. 헌재는 헌법에 따라 180일 이내인 내년 6월 초까지 대통령 탄핵 여부를 결정해야 한다. 헌법재판관 9명 중 6명이 찬성해야 탄핵이 최종 결정된다. 헌재가 국회의 탄핵소추 청구를 인용하면 1948년 정부 수립 이후 처음으로 대통령이 임기 중에 파면되게 된다. 박 대통령이 파면되면 헌법에 따라 60일 내에 대선을 치러야 한다.</p>
        </div></div>
      )
    };
    return [sample_short, sample_short, sample_middle, sample_middle, sample_long];
  }

  getPreference() {

  }
}

export default Board;