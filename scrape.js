var request = require('request');
var cheerio = require('cheerio');

request('http://www.j-archive.com/showgame.php?game_id=6274', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    $('td.clue').each(function(){
      let clue = $(this).find('.clue_text').text();
      let div = $(this).find('div');
      let answer = "";
      if(div){
        let answerStart = div.attr('onmouseover').indexOf('<em class="correct_response">') + 29;
        let answerEnd = div.attr('onmouseover').indexOf('</em>');
        answer = div.attr('onmouseover').substr(answerStart, (answerEnd - answerStart));
      }
      let json = {"clue": clue, "answer": answer};
      console.log(json);
    });
  }
});