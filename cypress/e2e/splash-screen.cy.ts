describe("Splash Screen spec", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("renders splash screen", () => {
    // Check that the title is rendered to assert the page is loaded
    cy.get(".splashscreen-body-title")
      .contains("Coastal Resilience")
      .should("be.visible");
    cy.get(".splashscreen-body-title")
      .contains("Explorer")
      .should("be.visible");

    // Check that all buttons rendered
    cy.get("div.navigation-button").should("have.length", 3);
  });

  it("renders disclaimer", () => {
    // Navigate past splash screen
    cy.get(".navigation-button").contains("Explore").click();

    // Make sure disclaimer is visible
    // cy.contains("Disclaimer:").wait(1000).should("be.visible");

    // Click close disclaimer button
    cy.get('[data-test-id="disclaimer-close-button"]').click();

    // Make sure disclaimer is not visible
    cy.contains("Disclaimer:").should("not.be.visible");
  });
});
