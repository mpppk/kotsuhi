// @ts-ignore
describe('', () => {
  const id = (cyId: string) => `[data-cy="${cyId}"]`

  it('Update template title', () => {
    const newTemplateTitle = 'new-template-title'
    cy.visit('http://localhost:3000')
    cy.cyId('template-list-item').first().click()
    cy.get('button[aria-label="Edit template title"]').click()
    cy.get('[data-cy="template-title-form"] input').clear().type(newTemplateTitle)
    cy.get('button[data-cy="save-template-title-button"]').click()
    cy.cyId('template-title').should('have.text', newTemplateTitle)
  })

  it('Edit config', () => {
    const [newEmployeeId, newCode, newVersion] = ['N99999', 'BD02', 'v9.99']
    cy.ariaLabel('Edit config').click()
    cy.get(id('config-employee-id-form') + ' input')
      .clear().type(newEmployeeId)
    cy.get(id('config-code-form') + ' input')
      .clear().type(newCode)
    cy.get(id('config-version-form') + ' input')
      .clear().type(newVersion)
    cy.contains('Save').click();
    cy.contains(`${newEmployeeId} - ${newCode}`)
    cy.contains(newVersion)
  })

  it('Update transportation', () => {
    cy.ariaLabel('Edit transportation').first().click()
    cy.get('[data-cy="transportation-departure-form"] input').clear().type('test-departure')
    cy.cyId('save-transportation-button').click()
    cy.contains('test-departure')
  })

  it('Delete transportation', () => {
    cy.ariaLabel('Delete transportation').first().click()
    cy.cyId('transportation-detail').should('have.length', 1)
  })

  it('Delete template', () => {
    cy.ariaLabel('Delete template').first().click() // FIXME
    cy.contains('OK').click()
    cy.cyId('template-list-item').should('have.length', 1) // FIXME
  })

  it('Add template', () => {
    const newTemplateTitle = 'new-template-title'
    cy.contains('Add').click()
    cy.focused().type(newTemplateTitle)
    cy.contains('Save').click()
    cy.get('nav').contains(newTemplateTitle)
    cy.get('nav [data-cy="template-list-item"]').should('have.length', 2)
    cy.cyId('template-title').contains(newTemplateTitle)
  })

  it('Cancel to import template', () => {
    cy.contains('Import').click()
    cy.contains('Cancel').click()
  })

  // it('Import template from file', () => {
  // })

  // it('Import template from URL', () => {
  // })

  // it('Export templates', () => {
  // })

  it('Export csv', () => {
    const selectDayNum = 8;
    cy.cyId('template-list-item').first().click()
    for (let i = 0; i < selectDayNum; i++) {
      cy.get('.DayPicker-Day[aria-disabled=false]').eq(i).click()
    }
    cy.get(`${id('template-list-item')} .MuiBadge-badge`).should('have.text', selectDayNum)
    cy.get(`button${id('export-csv-button')}+.MuiBadge-badge`).should('have.text', "2")
  })
})

