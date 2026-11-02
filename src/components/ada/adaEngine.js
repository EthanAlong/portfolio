/**
 * adaEngine — a browser sketch of the ADA Checker's idea on a single-user
 * toilet room: clearance volumes become rectangles and circles in plan, and
 * each check is a geometric test (contained in the room, clear of fixtures).
 * Inches. Selected 2010 ADA Standards checks only; a design-review aid like
 * the plugin, not a certification.
 *
 * Plan: origin top-left, x right, y down. Toilet on the left wall at the top,
 * lavatory on the top wall to the right, door in the bottom wall near the
 * right corner, hinged on the right and swinging into the room (so the room
 * side is the pull side).
 */

export const DEFAULTS = { width: 96, depth: 108, doorClear: 34, toiletCL: 18, circle: { x: 46, y: 72 } }

const TOILET = { w: 20, d: 28 }       // footprint
const LAV = { w: 24, d: 20, fromRight: 12 }
const DOOR_FROM_RIGHT = 6
const STOP = 2                        // leaf width = clear width + stops / door thickness

const contains = (outer, r) => r.x >= outer.x - 1e-6 && r.y >= outer.y - 1e-6 && r.x + r.w <= outer.x + outer.w + 1e-6 && r.y + r.h <= outer.y + outer.h + 1e-6
const overlap = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h
const circleHitsRect = (c, r, rect) => {
  const dx = Math.max(rect.x - c.x, 0, c.x - (rect.x + rect.w))
  const dy = Math.max(rect.y - c.y, 0, c.y - (rect.y + rect.h))
  return dx * dx + dy * dy < r * r - 1e-6
}

const inRoom = (c, p) =>
  c.x - c.r >= -1e-6 && c.y - c.r >= -1e-6 && c.x + c.r <= p.width + 1e-6 && c.y + c.r <= p.depth + 1e-6

export function plan(p) {
  const room = { x: 0, y: 0, w: p.width, h: p.depth }
  const toilet = { x: p.toiletCL - TOILET.w / 2, y: 0, w: TOILET.w, h: TOILET.d }
  const lav = { x: p.width - LAV.fromRight - LAV.w, y: 0, w: LAV.w, h: LAV.d }
  const leaf = p.doorClear + STOP
  const door = { x0: p.width - DOOR_FROM_RIGHT - leaf, x1: p.width - DOOR_FROM_RIGHT, y: p.depth }
  const hinge = { x: door.x1, y: p.depth }

  // clear floor spaces
  const toiletClear = { x: 0, y: 0, w: 60, h: 56 }                       // 604.3.1
  const maneuver = { x: door.x0 - 18, y: p.depth - 60, w: leaf + 18, h: 60 } // 404.2.4.1, front approach, pull side
  const turning = { x: p.circle.x, y: p.circle.y, r: 30 }                  // 304.3.1

  const checks = [
    {
      id: 'door-width',
      label: 'Door clear width ≥ 32"',
      ref: '404.2.3',
      pass: p.doorClear >= 32,
      detail: `${p.doorClear}" clear`,
    },
    {
      id: 'maneuver',
      label: 'Door maneuvering clearance, pull side (60" deep, 18" beyond the latch)',
      ref: '404.2.4.1',
      pass: contains(room, maneuver) && !overlap(maneuver, toilet) && !overlap(maneuver, lav),
      detail: !contains(room, maneuver) ? 'runs into a wall' : overlap(maneuver, toilet) || overlap(maneuver, lav) ? 'a fixture is in it' : 'clear',
    },
    {
      id: 'toilet-cl',
      label: 'Toilet centerline 16"–18" from the side wall',
      ref: '604.2',
      pass: p.toiletCL >= 16 && p.toiletCL <= 18,
      detail: `${p.toiletCL}"`,
    },
    {
      id: 'toilet-clear',
      label: 'Toilet clearance 60" × 56", no other fixture in it',
      ref: '604.3',
      pass: contains(room, toiletClear) && !overlap(toiletClear, lav),
      detail: !contains(room, toiletClear) ? 'room too small' : overlap(toiletClear, lav) ? 'lavatory intrudes' : 'clear',
    },
    {
      id: 'swing',
      label: 'Door does not swing into the toilet clearance',
      ref: '603.2.3',
      pass: !circleHitsRect(hinge, leaf, toiletClear),
      detail: circleHitsRect(hinge, leaf, toiletClear) ? 'swing overlaps' : 'clear',
    },
    {
      id: 'turning',
      label: '60" turning circle inside the room, clear of the toilet',
      ref: '304.3.1',
      // knee and toe clearance under the lavatory may be part of the turning space (304.3)
      pass: inRoom(turning, p) && !circleHitsRect(turning, turning.r, toilet),
      detail: !inRoom(turning, p) ? 'runs into a wall' : circleHitsRect(turning, turning.r, toilet) ? 'hits the toilet' : 'clear',
    },
  ]
  return { room, toilet, lav, door, hinge, leaf, toiletClear, maneuver, turning, checks }
}
