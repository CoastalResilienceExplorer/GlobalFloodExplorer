describe("Splash Screen spec", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("renders splash screen", () => {
    // Check that the title is rendered to assert the page is loaded
    cy.get(`[data-cy="splashscreen-body-title"]`)
      .contains("Coastal Resilience")
      .should("be.visible");
    cy.get(`[data-cy="splashscreen-body-title"]`)
      .contains("Explorer")
      .should("be.visible");

    // Check that cta buttons rendered
    cy.get(`[data-cy="splashscreen-cta"]`).should("have.length", 1);
  });

  it("renders disclaimer", () => {
    // Navigate past splash screen
    cy.get(`[data-cy="splashscreen-cta"]`)
      .contains("Enter the Explorer")
      .click();

    // Make sure disclaimer is visible
    // cy.contains("Disclaimer:").wait(1000).should("be.visible");

    // Click close disclaimer button
    cy.get(`[data-cy="disclaimer-close-button"]`).click();

    // Make sure disclaimer is not visible
    cy.contains("Disclaimer:").should("not.be.visible");
  });
});
