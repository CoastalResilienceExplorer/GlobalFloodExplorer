describe("Map spec", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(".navigation-button")
      .should("be.visible")
      .contains("Explore")
      .click();
    cy.get('[data-test-id="disclaimer-close-button"]')
      .should("be.visible")
      .click();
  });

  it("renders various elements of the map page", () => {
    // Check that the map canvas is rendered
    cy.get(".mapboxgl-canvas").should("be.visible");

    // Check that the legend is rendered
    cy.get(".legend-container").should("be.visible");

    // Check that the basemap manager are rendered
    cy.get(".basemap-manager-container").should("be.visible");

    // Check that the layer manager is rendered
    cy.get(".layer-selection-container").should("be.visible");

    // Check that the metrics are rendered
    cy.get('[data-test-id="open-metrics-button"]').should("be.visible");
  });

  it("selects country", () => {
    // TODO: Add test for selecting a country
  });

  it("selects tessela", () => {
    // TODO: Add test for selecting a tessela
  });

  it("shows metrics", () => {
    // TODO: Add test for showing metrics
  });

  it("renders flooding layer", () => {
    // TODO: Add test for rendering flooding layer
  });
});
