// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("generateFixtureTodo", () => {
  const faker = require("faker");

  cy.writeFile("cypress/fixtures/todo-dynamic.json", {
    hits: Cypress._.times(1, () => {
      return {
        userId: `${faker.datatype.number()}`,
        id: `${faker.datatype.number()}`,
        title: `${faker.name.firstName()} ${faker.name.lastName()}`,
        completed: true,
      };
    }),
  });
});

Cypress.Commands.add("generateFixture", () => {
  const faker = require("faker");

  cy.writeFile("cypress/fixtures/stories.json", {
    hits: Cypress._.times(20, () => {
      return {
        title: `${faker.lorem.words(3)}`,
        url: `${faker.internet.url()}`,
        author: `${faker.name.firstName()} ${faker.name.lastName()}`,
        num_comments: `${faker.datatype.number()}`,
        points: `${faker.datatype.number()}`,
        objectID: `${faker.datatype.uuid()}`,
      };
    }),
  });
});
