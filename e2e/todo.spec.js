const fs = require('fs');

const writeScreenshot = ( data, filename ) => {
  const stream = fs.createWriteStream(filename);
  stream.write(new Buffer(data, 'base64'));
  stream.end();
};


describe('angularjs homepage todo list', () => {
  it('(595:) should add a todo', async () => {
    await browser.get('https://angularjs.org');
    const png = await browser.takeScreenshot();
    writeScreenshot(png, 'screen1.png');
    await element(by.model('todoList.todoText')).sendKeys('write first protractor test');
    await element(by.css('[value="add"]')).click();

    const todoList = element.all(by.repeater('todo in todoList.todos'));
    expect(todoList.count()).toEqual(3);
    expect(await todoList.get(2).getText()).toEqual('write first protractor test');

    // You wrote your first test, cross it off the list
    await todoList.get(2).element(by.css('input')).click();
    const completedAmount = element.all(by.css('.done-true'));
    expect(await completedAmount.count()).toEqual(2);
  });
});
