$(function() {
  var $button = $('.gamebutton');
  var $input = $('input');
  var $artwork = $('.artwork');
  var $trackName = $('.track-name');
  var $artistName = $('.artist-name');
  var $album = $('.album');
  var $genre = $('.genre');
  var $score = $('#score');
  var $streak = $('#streak');
  var $round = $('#round');
  var $body = $('body');
  var $scoreboard = $('.scoreboard');
  var randonSongID;
  var streak = 0;
  var round = 0;
  var ko = 0;
  var score = 0;
  var songIds = ["995535015", "966411602", "823593456", "956689796", "943946671",
                 "982388023", "907242704", "201281527", "656801339", "910038357",
                 "250038575", "878000348",  "794095205",  "1645339",  "400835962",
                 "325618", "169003415",  "51958108",
                 "76532142", "192688540", "684811768", "344799464", "217633921",
                 "192811017", "640047583", "517438248" ];

  var songData = {
    artistName : null,
    artworkUrl100 : null,
    trackName: null,
    previewUrl: null,
    trackViewUrl: null,
    primaryGenreName: null,
    collectionName: null
  };


  function randomButtonCreator(answer) {
    var random =  _.sample(songIds, 3);
    var randomtracknames = [answer];

    for (i = 0; i < 3; i++) {
      $.ajax({
         url: "https://itunes.apple.com/lookup?id=" + random[i],
         jsonp: "callback",
         dataType: "jsonp"
      }).done(function(data) {
          console.log(data.results[0].trackName);
          randomtracknames.push(data.results[0].trackName);
          if (randomtracknames.length === 4) {
            randomtracknames = _.shuffle(randomtracknames);
            console.log(randomtracknames);
            for (i = 0; i < 4; i++){
              $($button[i]).html(randomtracknames[i]);
            }
          }
        });
    }
  }

  function randomSong() {
    var random = _.sample(songIds, 1);
    console.log(random + "   |    " + randonSongID);
    while(randonSongID === random){
      random = _.sample(songIds, 1);
      console.log(random + "===" + randonSongID);
    }
    console.log(random + "!===" + randonSongID);
    randonSongID = random;
    // console.log(randonSongID);
    //Pull correct data
    $.ajax({
       url: "https://itunes.apple.com/lookup?id=" + randonSongID,
       jsonp: "callback",
       dataType: "jsonp"
    }).done(function(data) {
      for (item in songData) {
        songData[item] = data.results[0][item];
      }
       $('#audio-preview').attr('src', songData.previewUrl);
       $('.preview-artwork').attr('src', songData.artworkUrl100);
       $('.preview-track-name').html(songData.trackName);
       $('.preview-artist-name').html(songData.artistName);
       randomButtonCreator(songData.trackName);
       console.log(songData);
      });
  }
  function checker(guess) {
    if (guess === songData.trackName) {
      return true;
    }
  }

  function guessSong() {

    $button.on ('click', function(event){


      // var scoreMinus = parseInt($score.html()) -1;
      if (checker($(event.target).html())) {
        console.log(score);
        score++;
        if (score === 10) {
          score = 0;
          round++;
          $round.html(round);
        }
        $score.html(score);
        streak++;
         $streak.html(streak);
      }
      else {
        console.log(score);
        streak = 0;
        $streak.html(0);
        ko += .30;
        $body.css('background', "linear-gradient(rgba(255, 0, 0, " + ko +"), rgba(255, 0, 0, " + ko + ")) repeat scroll 0% 0% / auto padding-box border-box, rgba(0, 0, 0, 0) url(bg.jpg) repeat scroll 0% 0% / auto padding-box border-box");

        //Need to add reset and css reset
        if (ko >= .90) {
          $scoreboard.prepend("<img id='gameover' src='boxing.gif'>")
          // $scoreboard.prepend("<img id='gameover' src='gameover.png'>");
          $scoreboard.append("<button class='btn btn-default resetbutton' >RESET</button>");
          $scoreboard.addClass('end-game');
          $('.boxscore').removeClass('boxP');
          /*
          -webkit-box-shadow: 10px 10px 173px 86px rgba(0,0,0,0.75);
          -moz-box-shadow: 10px 10px 173px 86px rgba(0,0,0,0.75);
          box-shadow: 10px 10px 173px 86px rgba(0,0,0,0.75);
          */

          gameReset();
        }

      }
      $input.val('');
      songPrint();
      randomSong();
    });



  }

  function songPrint (datafile) {
    //Displat played song all pretty like
    $(".answer:first").clone().insertAfter($(".answer:first"));
    $artwork.attr('src', songData.artworkUrl100);
    $trackName.html(songData.trackName);
    $artistName.html(songData.artistName);
    $genre.html(songData.primaryGenreName);
    $album.html(songData.collectionName);

  }

  function gameReset() {
    console.log('ran reset');
    $scoreboard.on('click', function() {
      $('#gameover').remove();
      $('.resetbutton').remove();
      streak = 0;
      round = 0;
      ko = 0;
      score = 0;
      $round.html(round);
      $score.html(score);
      $body.css('background', "linear-gradient(rgba(255, 0, 0, " + ko +"), rgba(255, 0, 0, " + ko + ")) repeat scroll 0% 0% / auto padding-box border-box, rgba(0, 0, 0, 0) url(bg.jpg) repeat scroll 0% 0% / auto padding-box border-box");
      $scoreboard.removeClass('end-game');
      $('.boxscore').addClass('boxP');
      console.log('gameReset');
    });
  }



  //Action
  randomSong();
  guessSong();
});
