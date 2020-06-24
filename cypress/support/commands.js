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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
Cypress.Commands.add("ariaLabel", { prevSubject: 'optional'}, (subject, label) => {
  return (subject ? subject : cy).get(`[aria-label="${label}"`)
})

Cypress.Commands.add("cyId", { prevSubject: 'optional'}, (subject, id) => {
  return (subject ? subject : cy).get(`[data-cy="${id}"`)
  // return subject.get(`[data-cy="${id}"`)
})

//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
