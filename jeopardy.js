let request = require('request');
let cheerio = require('cheerio');
let Clue = require('./database');


module.exports = {

  Start: function(){
    request('http://www.j-archive.com/listseasons.php', function (error, response, html) {
      if (!error && response.statusCode == 200) {
        let $ = cheerio.load(html);
          $('#content a').each(function(){
            let seasonLink = $(this).attr('href');
            module.exports.LoadSeason(seasonLink);
          });
      }
    });
  },



  LoadSeason: function(seasonLink){
      request('http://www.j-archive.com/' + seasonLink, function (error, response, html) {
          if (!error && response.statusCode == 200) {
              let $ = cheerio.load(html);
              $('#content table a').each(function(){
                  let episodeLink = $(this).attr('href');
                  module.exports.ScrapeEpisode(episodeLink);
              });
          };
      });
  },

  ScrapeEpisode: function(episodeLink){
    request(episodeLink, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        let $ = cheerio.load(html);
        $('table.round').each(function(roundIndex, roundElement){
          let categories = new Array();
          $(roundElement).find('.category_name').each(function(index,categoryElement){
            categories.push(categoryElement.firstChild.data);
          });
          $('td.clue').each(function(clueIndex, clueElement){
            let category = categories[clueIndex % categories.length];
            let clue = $(clueElement).find('.clue_text').text();
            let value = $(clueElement).find('table.clue_header td.clue_value').text();
            
            let div = $(clueElement).find('div').attr('onmouseover');
            
            let answer = "";
            let wrong = false;
            if(div !== undefined){
              let answerStart = div.indexOf('<em class="correct_response">') + 29;
              let answerEnd = div.indexOf('</em>');
              answer = div.substr(answerStart, (answerEnd - answerStart));

              wrong = div.indexOf('<td class="wrong">') !== -1;
            }
            let isDailyDouble = answer !== "" && value === "";
            let isFinalJeopardy = answer === "" && value === "";
            let json = new Clue({
              "round": isFinalJeopardy ? 3 : roundIndex + 1,
              "category": category,
              "clue": clue, 
              "answer": answer,
              "wrong": wrong,
              "value": value, 
              "dailydouble": isDailyDouble,
              "finaljeopardy": isFinalJeopardy
            });
            json.save().then(function(){
              
            });
          });

        });
      }
    });
  }
}

module.exports.Start();