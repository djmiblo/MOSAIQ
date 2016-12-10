$(document).ready(function() {
  $('a.donga').click(function(event) {
    window.location.href = './donga.html';
  })
  $('a.jeonja').click(function(event) {
    window.location.href = './jeonja.html';
  })
  $('a.asia').click(function(event) {
    window.location.href = './asia.html';
  })
  $('a.seoul-shinmun').click(function(event) {
    window.location.href = './seoul-shinmun.html';
  })
  $('a.moonwha').click(function(event) {
    window.location.href = './moonwha.html';
  })
  $('a.jungang').click(function(event) {
    window.location.href = './jungang.html';
  })
  $('a.korean-herald').click(function(event) {
    window.location.href = './korean-herald.html';
  })
  $('a.digital').click(function(event) {
    window.location.href = './digital.html';
  })
  $('a.hangyorae').click(function(event) {
    window.location.href = './hangyorae.html';
  })
  $('a.money').click(function(event) {
    window.location.href = './money.html';
  })
  $('a.gyeonghyang').click(function(event) {
    window.location.href = './gyeonghyang.html';
  })
  $('a.korea-times').click(function(event) {
    window.location.href = './korea-times.html';
  })
  $('a.hankook-finance').click(function(event) {
    window.location.href = './hankook-finance.html';
  })
  $('a.kookmin').click(function(event) {
    window.location.href = './kookmin.html';
  })
  $('a.hanguk-ilbo').click(function(event) {
    window.location.href = './hanguk-ilbo.html';
  })
  $('a.financial').click(function(event) {
    window.location.href = './financial.html';
  })
  $('a.maeil').click(function(event) {
    window.location.href = './maeil.html';
  })
  $('a.seoul').click(function(event) {
    window.location.href = './seoul.html';
  })
  $('a.chosun').click(function(event) {
    window.location.href = './chosun.html';
  })
  $('a.saegye').click(function(event) {
    window.location.href = './saegye.html';
  })
  $('a.herald').click(function(event) {
    window.location.href = './herald.html';
  })
  $('div.news_ls > div').each(function() {
    var publisher = $(this).attr('class');

    $(this).append('<br/>');
    for (var i = 0; i < 40; i++) {
      $(this).append('<a>[' + (i+1) + ']</a>');
    }
  })
  $('div.news_ls > div').each(function() {
    var publisher = $(this).attr('class');
    $(this).children('a').each(function(index) {
      $(this).click(function(event) {
        $.ajax({
          url: './'+publisher+'?'+'idx='+index,
          type: 'GET',
          dataType: 'html',
          success: function(data) {
            $('body').html(data);
          }
        })
      })
    })
  })
})
