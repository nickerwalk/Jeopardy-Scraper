var request = require('request');
var cheerio = require('cheerio');

request('http://www.j-archive.com/showgame.php?game_id=6274', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    $('td.clue').each(function(){
      let clue = $(this).find('.clue_text').text();
      let value = $(this).find('table.clue_header td.clue_value').text();
      let div = $(this).find('div').attr('onmouseover');
      let answer = "";
      if(div !== undefined){
        let answerStart = div.indexOf('<em class="correct_response">') + 29;
        let answerEnd = div.indexOf('</em>');
        answer = div.substr(answerStart, (answerEnd - answerStart));
      }
      let isDailyDouble = answer !== "" && value === "";
      let isFinalJeopardy = answer === "" && value === "";
      let json = {
        "clue": clue, 
        "answer": answer, 
        "value": value, 
        "dailydouble": isDailyDouble,
        "finaljeopardy": isFinalJeopardy
      };
      console.log(json);
    });
  }
});