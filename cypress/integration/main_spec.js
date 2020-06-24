describe('', () => {
  it('Update template title', () => {
    cy.visit('http://localhost:3000')
    cy.get('[data-cy="template-list-item"]').first().click() // FIXME
    cy.get('button[aria-label="Edit template title"]').click()
    cy.get('[data-cy="template-title-form"] input').clear().type('aaa')
    cy.get('button[data-cy="save-template-title-button"]').click()
    cy.get('[data-cy="template-title"]').should('have.text', 'aaa')
  })

  it('Update transportation', () => {
    cy.get('[aria-label="Edit transportation"]').first().click()
    cy.get('[data-cy="transportation-departure-form"] input').clear().type('test-departure')
    cy.get('[data-cy="save-transportation-button"]').click()
    cy.contains('test-departure')
  })

  it('Delete transportation', () => {
    cy.get('[aria-label="Delete transportation"]').first().click()
    cy.get('[data-cy="transportation-detail"').should('have.length', 1)
  })

  it('Delete template', () => {
    cy.get('[aria-label="Delete template"]').first().click() // FIXME
    cy.contains('OK').click()
    cy.get('[data-cy="template-list-item"]').should('have.length', 1) // FIXME
  })

  it('Add template', () => {
    const newTemplateTitle = 'new-template-title'
    cy.contains('Add').click()
    cy.focused().type(newTemplateTitle)
    cy.contains('Save').click()
    cy.get('nav').contains(newTemplateTitle)
    cy.get('nav [data-cy="template-list-item"]').should('have.length', 2)
    cy.get('[data-cy="template-title"]').contains(newTemplateTitle)
  })
})

