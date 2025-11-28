/**
 * GrooveAgent Display Screen (jsui)
 * Piano roll visualization with psychedelic effects
 *
 * Full implementation in Story 2.2
 */

/* globals mgraphics, box */

mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

/**
 * Paint callback for jsui
 * Renders the display screen background
 * @global Called by Max jsui
 */
// eslint-disable-next-line no-unused-vars
function paint() {
  // Get current dimensions
  const width = box.rect[2] - box.rect[0];
  const height = box.rect[3] - box.rect[1];

  // Draw black background
  mgraphics.set_source_rgba(0, 0, 0, 1);
  mgraphics.rectangle(0, 0, width, height);
  mgraphics.fill();
}
