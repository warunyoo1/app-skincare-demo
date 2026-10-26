import test from "node:test";
import assert from "node:assert/strict";
import {
  START,
  destinations,
  isWalkable,
  moveWithCollision,
  findWalkRoute,
  isClearSegment,
} from "../src/features/showroom/lib/navigation.ts";
import { SKINCARE_SHELVES } from "../src/features/showroom/config/fixtures.ts";
test("every viewing point is reachable without crossing a product island", () => {
  for (const a of destinations)
    for (const b of destinations) {
      const route = findWalkRoute(a.pose, b.pose);
      assert.ok(route.length, a.id + " to " + b.id);
      let previous = a.pose;
      for (const p of route) {
        assert.ok(isClearSegment(previous, p));
        previous = p;
      }
      assert.equal(previous.x, b.pose.x);
      assert.equal(previous.z, b.pose.z);
    }
});
test("walking respects walls and island collision", () => {
  for (const shelf of SKINCARE_SHELVES) {
    assert.equal(isWalkable(shelf.x, shelf.z), false);
    assert.deepEqual(findWalkRoute(START, { ...shelf, yaw: 0 }), []);
    const approach = { x: Math.sign(shelf.x) * 3.8, z: shelf.z, yaw: 0 };
    assert.ok(findWalkRoute(START, approach).length);
  }
  assert.equal(isWalkable(-1.1, -0.2), false);
  assert.equal(isWalkable(1.4, -0.75), false);
  assert.equal(isWalkable(7, 1), false);
  assert.equal(isWalkable(NaN, 1), false);
  assert.deepEqual(moveWithCollision(START, 0, 3), START);
  assert.deepEqual(findWalkRoute(START, { x: 1.4, z: -0.75, yaw: 0 }), []);
});
