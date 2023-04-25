class NotePage {

  elements = {
    applicationContainer: () => cy.get('div.todo'),
    // application default
    defaultImage: () => cy.get('div.todo_empty_message img[src*=".gif"]'),
    noNotesLabel: () => cy.get('div.todo_empty_message h2'),
    addNoteLabel: () => cy.get('div.todo__input-block span:nth-child(1)'),
    textInput: () => cy.get('div.todo__input-block input'),
    errorMessage: () => cy.get('div.input-block span:nth-of-type(2)'),
    // note elements
    noteText: (positionNumber) => this.record(positionNumber).find('span'),
    removeButton: (positionNumber) => this.record(positionNumber).find('div.card__close-btn img'),
    weatherIcon: (positionNumber) => this.record(positionNumber).find('div[class*="weather-img"] img'),
    weatherTemp: (positionNumber) => this.record(positionNumber).find('div.card__right-side__weather'),
    date: (positionNumber) => this.record(positionNumber).find('div[class*="date"] div:nth-child(1) time'),
    time: (positionNumber) => this.record(positionNumber).find('div[class*="date"] div:nth-child(2) time'),
  }

  /**
   * Returns an array of note record elements when 'position' is not set
   * else returns particular record by it 'position'.
   */
  get record() {
    return (position = null) => cy.get(`div.todo__cards-block div.card${position ? `:nth-child(${position})` : ''}`);
  }

  verifyApplicationIsOpened() {
    this.verifyApplicationElementIsVisible(this.elements.applicationContainer());
  }

  verifyApplicationElementIsVisible(element) {
    element.should('be.visible');
  }

  verifyApplicationElementIsNotVisible(element) {
    element.should('not.exist');
  }

  sendTextToTheInput(noteText) {
    this.elements.textInput().type(noteText);
  }

  verifyTextContentForElement(element, text, contain = true) {
    element.should(contain ? 'contain.text' : 'not.contain.text', text);
  }

  verifyRecordTextContainerEmpty(recordNumber) {
    this.elements.noteText(recordNumber).should('be.empty');
  }

  verifyWeatherIcon(notePosition, iconName) {
    this.elements.weatherIcon(notePosition).should('have.attr', 'src').and('include', iconName);
  }

  removeNoteWithPosition(position = 1) {
    this.elements.removeButton(position).click();
  }
}

export default new NotePage();
