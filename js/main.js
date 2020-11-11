
var $dataView = document.querySelectorAll('div[data-view]');
var $homePageServantRoster = document.querySelector('.servant-roster-button');
var $homePageDmgCalculator = document.querySelector('.np-dmg-button');

$homePageServantRoster.addEventListener('click', function (e) {
  viewSwap('servant-lists');
});

$homePageDmgCalculator.addEventListener('click', function (e) {
  viewSwap('calculator');
});

function viewSwap(view) {
  for (var i = 0; i < $dataView.length; i++) {
    if ($dataView[i].getAttribute('data-view') !== view) {
      $dataView[i].className = 'hide';
    } else {
      $dataView[i].className = 'show';
    }
  }
}
