
var $background = document.querySelector('.background-config');
var $dataView = document.querySelectorAll('div[data-view]');

var $homePageServantRoster = document.querySelector('.servant-roster-button');

var $openNewRosterModalButton = document.querySelector('.new-roster-button');
var $newRosterModalForm = document.querySelector('.new-roster-modal');
var $createNewRosterForm = document.querySelector('.modal-form > form');
var $rosterModalInput = document.querySelector('.roster-name');
var $listDisplay = document.querySelector('.list-display-container');

var $openServantInsertModalButton = document.querySelector('.open-servant-insert-modal-button');
var $servantInsertModal = document.querySelector('.insert-servant-modal');
var $insertServantForm = document.querySelector('.servant-form-modal > form');
var $returnedServantListModal = document.querySelector('.servant-list-modal');

var $listContentDisplayContainer = document.querySelector('.list-content-display-container');
var $returnedServantOptions = document.querySelector('.player-choices > form');

var $menuButton = document.querySelectorAll('.menu-button-icon');
var $rosterListsBackButton = document.querySelector('.roster-lists-back-button');
var $servantListBackButotn = document.querySelector('.servant-list-back-button');
var $servantInfoBackButton = document.querySelector('.servant-information-back-button');

var $openEditServantInfoModalButton = document.querySelector('.open-servant-edit-info-modal-button');
var $openEditServantInfoModal = document.querySelector('.edit-servant-information-modal');
var $editServantInfoForm = document.querySelector('.edit-servant-form-container-modal > form');

var $loadMessage = document.querySelector('.message-container');

var currentRoster = null;
var currentServantInfo = null;

$homePageServantRoster.addEventListener('click', function (e) {
  viewSwap('servant-lists');
  appendRosterList();
  $background.className = 'list-bg background-config';
});

$openNewRosterModalButton.addEventListener('click', function (e) {
  $newRosterModalForm.className = 'new-roster-modal';
});

var $closeRosterModal = document.querySelector('.close-new-roster-modal > .fa-times');
$closeRosterModal.addEventListener('click', function (e) {
  $newRosterModalForm.className = 'new-roster-modal hide';
  $createNewRosterForm.reset();
});

var existingRosterList = localStorage.getItem('fgo-rosters');
if (existingRosterList) {
  data = JSON.parse(existingRosterList);
}

window.addEventListener('beforeunload', function (e) {
  var dataJson = JSON.stringify(data);
  localStorage.setItem('fgo-rosters', dataJson);
});

$createNewRosterForm.addEventListener('submit', function (e) {

  e.preventDefault();
  var roster = new Roster($rosterModalInput.value);
  data.rosterLists.push(roster);
  $newRosterModalForm.className += ' hide';

  $createNewRosterForm.reset();

  appendRosterList();
});

for (var j = 0; j < $menuButton.length; j++) {
  $menuButton[j].addEventListener('click', returnToHomepage);
}

$rosterListsBackButton.addEventListener('click', returnToHomepage);

$servantListBackButotn.addEventListener('click', function (e) {
  viewSwap('servant-lists');
  appendRosterList();
});

$servantInfoBackButton.addEventListener('click', function (e) {
  viewSwap('servant-list-content');
  appendServantListContent();
});

function appendRosterList() {
  $listDisplay = document.querySelector('.list-display-container');
  if ($listDisplay.hasChildNodes()) {
    var $childNode = document.querySelector('.list-container');
    $listDisplay.removeChild($childNode);
  }

  buildRosterListView(data.rosterLists);

  var $viewListContentButton = document.querySelectorAll('.view-list-content-button');
  var $deleteListButtons = document.querySelectorAll('.delete-list-button');
  for (var i = 0; i < $deleteListButtons.length; i++) {
    $deleteListButtons[i].addEventListener('click', function (e) {
      data.rosterLists.splice(e.target.parentNode.getAttribute('id'), 1);
      appendRosterList();
    });

    $viewListContentButton[i].addEventListener('click', function (e) {

      viewSwap('servant-list-content');

      $listDisplay = document.querySelector('.list-display-container');
      var $listDisplayChild = document.querySelector('.list-container');
      $listDisplay.removeChild($listDisplayChild);

      currentRoster = data.rosterLists[e.target.parentNode.getAttribute('id')];
      $listContentDisplayContainer = document.querySelector('.list-content-display-container');
      if ($listContentDisplayContainer.hasChildNodes()) {
        var $listContentView = document.querySelector('.display');
        $listContentDisplayContainer.removeChild($listContentView);
      }
      appendServantListContent();
    });
  }
}

$openServantInsertModalButton.addEventListener('click', function (e) {
  $servantInsertModal.className = 'insert-servant-modal';
});

var $failConnectMessage = document.querySelector('.failed-message-container');
var $failConnectMessageButton = document.querySelector('.close-failed-message-button');
$failConnectMessageButton.addEventListener('click', function (e) {
  $failConnectMessage.className = 'failed-message-container hide';

  $returnedServantListModal.className = 'servant-list-modal hide';
  $servantInsertModal.className = 'insert-servant-modal';
});

var $noDataMessage = document.querySelector('.no-data-message-container');
var $noDataMessageButton = document.querySelector('.close-no-data-message-button');
$noDataMessageButton.addEventListener('click', function (e) {
  $noDataMessage.className = 'no-data-message-container hide';
  $returnedServantListModal.className = 'servant-list-modal hide';
  $servantInsertModal.className = 'insert-servant-modal';
});
var tempServantsArray = null;

var xhr = new XMLHttpRequest();
xhr.addEventListener('load', function () {
  tempServantsArray = xhr.response;

  if (tempServantsArray.length !== 0) {
    buildServantChoice(xhr.response);
  } else {
    $noDataMessage.className = 'no-data-message-container';
  }
});

xhr.addEventListener('error', function (e) {
  $failConnectMessage.className = 'failed-message-container';
  $insertServantForm.reset();
});
xhr.onreadystatechange = function () {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    $loadMessage.className = 'message-container hide';
    var status = xhr.status;
    if (status === 0 || (status >= 200 && status < 400)) {
      $returnedServantListModal.className = 'servant-list-modal';
    }
  } else {
    $loadMessage.className = 'message-container';
  }
};

$insertServantForm.addEventListener('submit', function (e) {

  e.preventDefault();
  xhr.open('GET', 'https://api.atlasacademy.io/nice/' + $insertServantForm.elements.region.value + '/servant/search/?name=' + $insertServantForm.elements['servant-name'].value + '&lang=en');
  xhr.responseType = 'json';

  $returnedServantOptions = document.querySelector('.player-choices > form');
  if ($returnedServantOptions.hasChildNodes()) {
    var $formChildNode = document.querySelector('.returned-servants');
    $returnedServantOptions.removeChild($formChildNode);
  }

  xhr.send();

  $insertServantForm.reset();
  $servantInsertModal.className = 'insert-servant-modal hide';
});

$returnedServantOptions.addEventListener('submit', function (e) {
  e.preventDefault();

  var servantIndexFromList = $returnedServantOptions.elements['correct-servant'].value;
  tempServantsArray[servantIndexFromList].playerEditInfo = {};
  tempServantsArray[servantIndexFromList].playerEditInfo.level = 1;
  tempServantsArray[servantIndexFromList].playerEditInfo.atkFou = 0;
  tempServantsArray[servantIndexFromList].playerEditInfo.hpFou = 0;
  tempServantsArray[servantIndexFromList].playerEditInfo.skillOne = 1;
  tempServantsArray[servantIndexFromList].playerEditInfo.skillTwo = 1;
  tempServantsArray[servantIndexFromList].playerEditInfo.skillThree = 1;

  currentRoster.list.push(tempServantsArray[servantIndexFromList]);

  appendServantListContent();
  $returnedServantListModal.className = 'servant-list-modal hide';
});

$openEditServantInfoModalButton.addEventListener('click', function (e) {
  $openEditServantInfoModal.className = 'edit-servant-information-modal';

  $editServantInfoForm.elements['servant-level'].value = currentServantInfo.playerEditInfo.level;
  $editServantInfoForm.elements['servant-s1-level'].value = currentServantInfo.playerEditInfo.skillOne;
  $editServantInfoForm.elements['servant-s2-level'].value = currentServantInfo.playerEditInfo.skillTwo;
  $editServantInfoForm.elements['servant-s3-level'].value = currentServantInfo.playerEditInfo.skillThree;
  $editServantInfoForm.elements['servant-atk-fou'].value = currentServantInfo.playerEditInfo.atkFou;
  $editServantInfoForm.elements['servant-hp-fou'].value = currentServantInfo.playerEditInfo.hpFou;
});

$editServantInfoForm.addEventListener('submit', function (e) {
  e.preventDefault();
  currentServantInfo.playerEditInfo.level = $editServantInfoForm.elements['servant-level'].value;
  currentServantInfo.playerEditInfo.skillOne = $editServantInfoForm.elements['servant-s1-level'].value;
  currentServantInfo.playerEditInfo.skillTwo = $editServantInfoForm.elements['servant-s2-level'].value;
  currentServantInfo.playerEditInfo.skillThree = $editServantInfoForm.elements['servant-s3-level'].value;
  currentServantInfo.playerEditInfo.atkFou = $editServantInfoForm.elements['servant-atk-fou'].value;
  currentServantInfo.playerEditInfo.hpFou = $editServantInfoForm.elements['servant-hp-fou'].value;

  $openEditServantInfoModal.className = 'edit-servant-information-modal hide';
  displayServantInfo(currentServantInfo);
});

function appendServantListContent() {
  $listContentDisplayContainer = document.querySelector('.list-content-display-container');
  if ($listContentDisplayContainer.hasChildNodes()) {
    var $listContentView = document.querySelector('.display');
    $listContentDisplayContainer.removeChild($listContentView);
  }

  buildListContentView(currentRoster);

  var $allServantViewInfoButtons = document.querySelectorAll('.servant-info-button');
  var $allDeleteServantButtons = document.querySelectorAll('.delete-servant-button');
  for (var i = 0; i < $allDeleteServantButtons.length; i++) {
    $allServantViewInfoButtons[i].addEventListener('click', function (e) {

      currentServantInfo = currentRoster.list[e.target.parentNode.getAttribute('id')];
      displayServantInfo(currentServantInfo);
      viewSwap('servant-information');

    });

    $allDeleteServantButtons[i].addEventListener('click', function (e) {
      currentRoster.list.splice(e.target.parentNode.getAttribute('id'), 1);
      appendServantListContent();
    });
  }
}

function Roster(name) {
  this.name = name;
  this.list = [];
}

function buildRosterListView(array) {

  var $containerDiv = document.createElement('div');
  $containerDiv.setAttribute('class', 'list-container');

  for (var i = 0; i < array.length; i++) {

    var $rosterListRow = document.createElement('div');
    $rosterListRow.setAttribute('class', 'roster-list-row');

    var $rowColumn1 = document.createElement('div');
    $rowColumn1.setAttribute('class', 'column-half color-white');

    var $rCol1P = document.createElement('p');
    $rCol1P.setAttribute('class', 'character-list');
    $rCol1P.textContent = array[i].name;

    var $rowColumn2 = document.createElement('div');
    $rowColumn2.setAttribute('class', 'column-half display-flex flex-jc-center flex-ai-center');
    $rowColumn2.setAttribute('id', '' + i);

    var $rowCol2ViewButton = document.createElement('div');
    $rowCol2ViewButton.setAttribute('class', 'view-list-content-button');
    $rowCol2ViewButton.textContent = 'View';

    var $rowCol2DeleteButton = document.createElement('div');
    $rowCol2DeleteButton.setAttribute('class', 'delete-list-button');
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

function buildServantChoice(array) {

  var $returnedServants = document.createElement('div');
  $returnedServants.setAttribute('class', 'returned-servants');

  for (var i = 0; i < array.length; i++) {

    var $optionStyling = document.createElement('div');
    $optionStyling.setAttribute('class', 'display-flex flex-ai-center image-margin');

    var $servantImage = document.createElement('img');
    $servantImage.setAttribute('src', array[i].extraAssets.faces.ascension['4']);
    $servantImage.setAttribute('class', 'servant-image');

    var $servantLabel = document.createElement('label');
    var $servantLabelTextNode = document.createTextNode(array[i].name);

    var $servantRadioButton = document.createElement('input');
    $servantRadioButton.setAttribute('type', 'radio');
    $servantRadioButton.setAttribute('required', 'required');
    $servantRadioButton.setAttribute('name', 'correct-servant');
    $servantRadioButton.setAttribute('value', i);

    $servantLabel.appendChild($servantRadioButton);
    $servantLabel.appendChild($servantLabelTextNode);

    $optionStyling.appendChild($servantImage);
    $optionStyling.appendChild($servantLabel);

    $returnedServants.appendChild($optionStyling);
    $returnedServantOptions.appendChild($returnedServants);

  }

  var $servantSubmitButtonContainer = document.createElement('div');
  $servantSubmitButtonContainer.setAttribute('class', 'insert-servant-button-container');

  var $servantSubmitButton = document.createElement('input');
  $servantSubmitButton.setAttribute('type', 'submit');
  $servantSubmitButton.setAttribute('class', 'roster-button');
  $servantSubmitButton.setAttribute('value', 'Add');

  $servantSubmitButtonContainer.appendChild($servantSubmitButton);

  $returnedServants.appendChild($servantSubmitButtonContainer);
  $returnedServantOptions.appendChild($returnedServants);
}

function buildListContentView(rosterObject) {
  var $display = document.createElement('div');
  $display.setAttribute('class', 'display list-content-view-config');

  var $listNameStyling = document.createElement('div');
  $listNameStyling.setAttribute('class', 'list-content-row color-white flex-jc-center');

  var $listName = document.createElement('h2');
  $listName.textContent = rosterObject.name;

  $listNameStyling.appendChild($listName);

  $display.appendChild($listNameStyling);

  for (var i = 0; i < rosterObject.list.length; i++) {
    var $servantRow = document.createElement('div');
    $servantRow.setAttribute('class', 'list-content-row image-margin');

    var $servantName = document.createElement('div');
    $servantName.setAttribute('class', 'column-half');

    var $imageContainer = document.createElement('div');
    $imageContainer.setAttribute('class', 'color-white display-flex flex-jc-center flex-ai-center pad-left');

    var $servantImage = document.createElement('img');
    $servantImage.setAttribute('src', rosterObject.list[i].extraAssets.faces.ascension['4']);
    $servantImage.setAttribute('class', 'servant-image');

    var $servantNameTextContainer = document.createElement('div');
    $servantNameTextContainer.setAttribute('class', 'servant-name-width');
    var $servantNameText = document.createTextNode(rosterObject.list[i].name);

    var $servantViewDeleteButtons = document.createElement('div');
    $servantViewDeleteButtons.setAttribute('class', 'column-half display-flex flex-jc-center flex-ai-center');
    $servantViewDeleteButtons.setAttribute('id', i);

    var $servantViewButton = document.createElement('div');
    $servantViewButton.setAttribute('class', 'servant-info-button');
    $servantViewButton.textContent = 'View';

    var $servantDeleteButton = document.createElement('div');
    $servantDeleteButton.setAttribute('class', 'delete-servant-button');
    $servantDeleteButton.textContent = 'Delete';

    $servantViewDeleteButtons.appendChild($servantViewButton);
    $servantViewDeleteButtons.appendChild($servantDeleteButton);

    $imageContainer.appendChild($servantImage);
    $servantNameTextContainer.appendChild($servantNameText);

    $imageContainer.appendChild($servantNameTextContainer);

    $servantName.appendChild($imageContainer);

    $servantRow.appendChild($servantName);
    $servantRow.appendChild($servantViewDeleteButtons);

    $display.appendChild($servantRow);
  }

  $listContentDisplayContainer.appendChild($display);
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

function returnToHomepage() {
  viewSwap('homepage');
  $background.className = 'homepage-bg background-config';
}

function displayServantInfo(servantObject) {

  var skillOneArray = [];
  var skillTwoArray = [];
  var skillThreeArray = [];

  for (var s = 0; s < servantObject.skills.length; s++) {
    if (servantObject.skills[s].num === 1) {
      skillOneArray.push(servantObject.skills[s]);
    } else if (servantObject.skills[s].num === 2) {
      skillTwoArray.push(servantObject.skills[s]);
    } else if (servantObject.skills[s].num === 3) {
      skillThreeArray.push(servantObject.skills[s]);
    }
  }

  var $displayServantImage = document.querySelector('.servant-profile-image-container');
  $displayServantImage.setAttribute('src', servantObject.extraAssets.faces.ascension['4']);
  var $displayServantName = document.querySelector('.servant-profile-name');
  $displayServantName.textContent = servantObject.name + '\n(Lv. ' + servantObject.playerEditInfo.level + ')';

  var $displayServantATK = document.querySelector('.atk-stat-value-display');
  $displayServantATK.textContent = parseInt(servantObject.atkGrowth[servantObject.playerEditInfo.level - 1]) + parseInt(servantObject.playerEditInfo.atkFou);

  var $displayServantHP = document.querySelector('.hp-stat-value-display');
  $displayServantHP.textContent = parseInt(servantObject.hpGrowth[servantObject.playerEditInfo.level - 1]) + parseInt(servantObject.playerEditInfo.hpFou);

  var $displayServantFouATK = document.querySelector('.fou-atk-stat-value-display');
  $displayServantFouATK.textContent = servantObject.playerEditInfo.atkFou;

  var $displayServantFouHP = document.querySelector('.fou-hp-stat-value-display');
  $displayServantFouHP.textContent = servantObject.playerEditInfo.hpFou;

  var $displaySkillOneDescription = document.querySelector('.skill-1-description');
  $displaySkillOneDescription.textContent = createSkillDescriptions(skillOneArray, servantObject.playerEditInfo.skillOne, 1);

  var $displaySkillTwoDescription = document.querySelector('.skill-2-description');
  $displaySkillTwoDescription.textContent = createSkillDescriptions(skillTwoArray, servantObject.playerEditInfo.skillTwo, 2);

  var $displaySkillThreeDescription = document.querySelector('.skill-3-description');
  $displaySkillThreeDescription.textContent = createSkillDescriptions(skillThreeArray, servantObject.playerEditInfo.skillThree, 3);

}

function createSkillDescriptions(descriptionArray, skillLvl, skillOrder) {
  var skillDescriptions = 'Skill ' + skillOrder + ': ';
  for (var i = 0; i < descriptionArray.length; i++) {
    if (i > 0) {
      skillDescriptions += '(After interlude/rank up)\n';
    }
    skillDescriptions = skillDescriptions + descriptionArray[i].name + ' Lv. ' + skillLvl + '\n\n' + descriptionArray[i].detail + '\n\n';

  }

  return skillDescriptions;
}
