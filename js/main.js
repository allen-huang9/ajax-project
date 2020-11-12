
var $background = document.querySelector('.background-config');
var $dataView = document.querySelectorAll('div[data-view]');
var $homePageServantRoster = document.querySelector('.servant-roster-button');
var $homePageDmgCalculator = document.querySelector('.np-dmg-button');

var $openNewRosterModalButton = document.querySelector('.new-roster-button');
var $newRosterModalForm = document.querySelector('.new-roster-modal');
var $createNewRosterForm = document.querySelector('.modal-form > form');
var $rosterModalInput = document.querySelector('.roster-name');
var $listDisplay = document.querySelector('.list-display-container');

$homePageServantRoster.addEventListener('click', function (e) {
  viewSwap('servant-lists');
  appendRosterList();

  $background.className = 'list-bg background-config';
});

$homePageDmgCalculator.addEventListener('click', function (e) {
  viewSwap('calculator');
});

$openNewRosterModalButton.addEventListener('click', function (e) {
  $newRosterModalForm.className = 'new-roster-modal';
});

var existingRosterList = localStorage.getItem('fgo-rosters');
if (existingRosterList) {
  data = JSON.parse(existingRosterList);
}

window.addEventListener('beforeunload', function (e) {
  var dataJson = JSON.stringify(data);
  localStorage.setItem('fgo-rosters', dataJson);
  // localStorage.clear();
});

$createNewRosterForm.addEventListener('submit', function (e) {

  e.preventDefault();
  var roster = new Roster($rosterModalInput.value);
  data.rosterLists.push(roster);
  $newRosterModalForm.className += ' hide';

  $createNewRosterForm.reset();

  appendRosterList();
});

function appendRosterList() {
  $listDisplay = document.querySelector('.list-display-container');
  if ($listDisplay.hasChildNodes()) {
    var $childNode = document.querySelector('.list-container');
    $listDisplay.removeChild($childNode);
  }

  buildRosterListView(data.rosterLists);

  var $deleteListButtons = document.querySelectorAll('.delete-list-button');
  for (var i = 0; i < $deleteListButtons.length; i++) {
    $deleteListButtons[i].addEventListener('click', function (e) {
      data.rosterLists.splice(e.target.getAttribute('id'), 1);
      appendRosterList();
    });
  }
}

function buildRosterListView(array) {

  var $containerDiv = document.createElement('div');
  $containerDiv.setAttribute('class', 'list-container');

  for (var i = 0; i < array.length; i++) {

    var $rosterListRow = document.createElement('div');
    $rosterListRow.setAttribute('class', 'roster-list-row');

    var $rowColumn1 = document.createElement('div');
    $rowColumn1.setAttribute('class', 'column-half');

    var $rCol1P = document.createElement('p');
    $rCol1P.setAttribute('class', 'character-list');
    $rCol1P.textContent = array[i].name;

    var $rowColumn2 = document.createElement('div');
    $rowColumn2.setAttribute('class', 'column-half display-flex flex-jf-center flex-ai-center');

    var $rowCol2ViewButton = document.createElement('div');
    $rowCol2ViewButton.setAttribute('class', 'view-list-content-button');
    $rowCol2ViewButton.textContent = 'View';

    var $rowCol2DeleteButton = document.createElement('div');
    $rowCol2DeleteButton.setAttribute('class', 'delete-list-button');
    $rowCol2DeleteButton.setAttribute('id', '' + i);
    $rowCol2DeleteButton.textContent = 'Delete';

    $rowColumn1.appendChild($rCol1P);

    $rowColumn2.appendChild($rowCol2ViewButton);
    $rowColumn2.appendChild($rowCol2DeleteButton);

    $rosterListRow.appendChild($rowColumn1);
    $rosterListRow.appendChild($rowColumn2);

    $containerDiv.appendChild($rosterListRow);

  }

  $listDisplay.appendChild($containerDiv);
}

function viewSwap(view) {
  for (var i = 0; i < $dataView.length; i++) {
    if ($dataView[i].getAttribute('data-view') !== view) {
      $dataView[i].className = 'hide';
    } else {
      $dataView[i].className = 'show';
    }
  }
}

function Roster(name) {
  this.name = name;
  this.list = [];
}
