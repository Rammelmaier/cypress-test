import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import NotePage from '../pages/note.page';
import * as randomString from '../utils/randomString';

let noteText;

Given(/^I open "Note" application$/, () => {
  cy.visit('/');
});

Then(/^I expect application page is opened$/, () => {
  NotePage.verifyApplicationIsOpened();
});

Then(/^I expect "(.*)" element is( not)? visible$/, (pageElement, isNotVisible) => {
  const elements = NotePage.elements;
  let targetElement;
  switch (pageElement) {
    case 'Empty note image':
      targetElement = elements.defaultImage();
      break;
    case 'No notes label':
      targetElement = elements.noNotesLabel();
      break;
    case 'Add notes label':
      targetElement = elements.addNoteLabel();
      break;
    case 'Text input':
      targetElement = elements.textInput();
      break;
  }

  if (isNotVisible) {
    NotePage.verifyApplicationElementIsNotVisible(targetElement);
  } else {
    NotePage.verifyApplicationElementIsVisible(targetElement);
  }
});

Given(/^I expect "error message": "(maximum word length exceeded)" is( not)? displayed$/, (message, notDisplayed) => {
  NotePage.verifyTextContentForElement(NotePage.elements.errorMessage(), message, !notDisplayed);
});

Then(/^I expect "(.*)" for note record "#(\d+)" is( not)? visible$/, (pageElement, noteNumber, isNotVisible) => {
  const elements = NotePage.elements;
  let targetElement;
  switch (pageElement) {
    case 'Note text':
      targetElement = elements.noteText(noteNumber);
      break;
    case 'Remove button':
      targetElement = elements.removeButton(noteNumber);
      break;
    case 'Weather icon':
      targetElement = elements.weatherIcon(noteNumber);
      break;
    case 'Weather temperature':
      targetElement = elements.weatherTemp(noteNumber);
      break;
    case 'Creation date':
      targetElement = elements.date(noteNumber);
      break;
    case 'Creation time':
      targetElement = elements.time(noteNumber);
      break;
  }

  if (isNotVisible) {
    NotePage.verifyApplicationElementIsNotVisible(targetElement);
  } else {
    NotePage.verifyApplicationElementIsVisible(targetElement);
  }
});

Then(/^I expect application have (\d+|no) record(s)?$/, (expectedRecordQuantity, s) => {
  if (expectedRecordQuantity === 'no') {
    NotePage.verifyApplicationElementIsNotVisible(NotePage.record());
  } else {
    NotePage.record().should('have.length', expectedRecordQuantity);
  }
});

When(/^I type "(.*)" text in input field$/, (text) => {
  let testMessage;
  switch (text) {
    case '<numeric 30>':
      testMessage = randomString.randomNumericString(30);
      break;
    case '<alphabetic 30>':
      testMessage = randomString.randomAlphabeticString(30);
      break;
    case '<symbolic 30>':
      testMessage = randomString.randomSymbolicString(30);
      break;
    case '<emoji 30>':
      testMessage = randomString.randomEmoji(30);
      break;
    case '<string 31>':
      testMessage = randomString.randomString(31);
      break;
    case '<string 32>':
      testMessage = randomString.randomString(32);
      break;

    default:
      testMessage = text;
      break;
  }
  noteText = testMessage;
  NotePage.sendTextToTheInput(noteText);
});

When(/^I( not)? press "(Enter|Backspace)" key on keyboard$/, (notPress, button) => {
  const keyAction = button == 'Enter' ? '{enter}' : button == 'Backspace' ? '{backspace}' : '{enter}';
  if (!notPress) {
    NotePage.sendTextToTheInput(keyAction);
    cy.wait(150);
  }
});

Then(/^I verify "(note text|weather icon|temperature|date|time)" for record "#(\d+)"$/, (block, recordNumber, value) => {
  const noteElements = NotePage.elements;
  let assertion, condition;
  if (block === 'note text') {
    assertion = value ? value : noteText;
    condition = true;
  } else {
    assertion = value;
  }

  switch (block) {
    case 'note text':
      NotePage.verifyTextContentForElement(noteElements.noteText(recordNumber), assertion, condition);
      break;
    case 'weather icon':
      NotePage.verifyWeatherIcon(recordNumber, assertion);
      break;
    case 'temperature':
      NotePage.verifyTextContentForElement(noteElements.weatherTemp(recordNumber), assertion);
      break;
    case 'date':
      NotePage.verifyTextContentForElement(noteElements.date(recordNumber), assertion);
      break;
    case 'time':
      NotePage.verifyTextContentForElement(noteElements.time(recordNumber), assertion);
      break;
  }
});

Then(/^I expect "record note text" is empty for record "#(\d+)"$/, (recordNumber) => {
  NotePage.verifyRecordTextContainerEmpty(recordNumber);
});

Then(/^I click on "Remove button" for note record "#(\d+)"$/, (recordNumber) => {
  NotePage.removeNoteWithPosition(recordNumber);
  cy.wait(150);
});

Then(/^I expect note text "(.*)" is not present in record "#(\d+)"$/, (noteText, recordNumber) => {
  NotePage.verifyTextContentForElement(NotePage.elements.noteText(recordNumber), noteText, false);
});

/**
 * Browser clock
 */
Given(/^I set browser system time as "(\d{4})"-"(\d{1,2})"-"(\d{1,2})" "(\d{1,2})":"(\d{1,2})"$/, (year, month, day, hour, minute) => {
  const now = new Date(Number(year), Number(month - 1), Number(day), Number(hour), Number(minute));
  cy.clock(now);
});

Then(/^I add "(\d+)" seconds to current "cy.clock" time$/, (seconds) => {
  cy.tick(seconds * 1000);
});

Then(/^I reset configured browser time to current$/, () => {
  cy.clock().then((clock) => {
    clock.restore()
  })
});

/**
 * API interceptor
 */
Given(/^I prepare to intercept "(.*)" request on "(.*)" as "(.*)" and set "(\d+)" response status$/,
  (reqMethod, reqUrl, alias, status, modRes) => {
    cy.intercept({ method: reqMethod, url: reqUrl }, (req) => {
      req.reply({
        body: JSON.parse(modRes),
        statusCode: Number(status),
      });
    }).as(alias);
  });
