import test from "node:test";
import assert from "node:assert/strict";
import { products, gallery } from "../src/features/products/data/catalog.ts";
test("catalog has only the two pictured packaging variants without invented sales facts", () => {
  assert.equal(products.length, 2);
  assert.equal(new Set(products.map((p) => p.id)).size, 2);
  for (const p of products) {
    assert.equal(p.price, null);
    assert.equal(p.stock, null);
    assert.ok(p.sourceUrl.startsWith("https://drive.google.com/file/d/"));
    assert.match(p.image, /^\/assets\//);
  }
  assert.equal(gallery.length, 4);
});
