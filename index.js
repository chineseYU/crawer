var axios = require('axios');
var cheerio = require('cheerio');
var fs = require('fs');
var siteUrl = 'https://segmentfault.com';
var baseUrl = 'https://segmentfault.com/questions/hottest';
var questions = [];
questionFun(baseUrl);
function questionFun(url) {
  axios.get(url)
  .then(function (response) {
    var $ = cheerio.load(response.data);
    $('.question-stream .stream-list__item').each(function () {
      var elem = $(this);
      questions.push({
        "title": elem.find('.summary .title a').text().trim(),
        "url": siteUrl + elem.find('.summary .title a').attr('href').trim()
      });
    });
    var next = $('.text-center .pagination .next a').attr('href');
    if(next) {
      questionFun(siteUrl + next);
    } else {
      // console.log(questions);
      var newQuestions = JSON.stringify(questions);
      fs.writeFile('data.js', newQuestions, function (err) {
        if(err) {
          console.log('文件写入失败');
        } else {
          console.log('文件写入成功');
        }
      });
      fs.appendFileSync('data1.js', newQuestions);
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}
