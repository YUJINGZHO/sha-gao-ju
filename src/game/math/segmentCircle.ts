export interface PointLike {
  x: number
  y: number
}

export interface CircleLike extends PointLike {
  radius: number
}

export function segmentIntersectsCircle(
  start: PointLike,
  end: PointLike,
  circle: CircleLike,
  padding = 0,
): boolean {
  const segmentX = end.x - start.x
  const segmentY = end.y - start.y
  const lengthSquared = segmentX * segmentX + segmentY * segmentY
  if (lengthSquared === 0) return false

  const projection = Math.max(0, Math.min(1,
    ((circle.x - start.x) * segmentX + (circle.y - start.y) * segmentY) / lengthSquared,
  ))
  const closestX = start.x + projection * segmentX
  const closestY = start.y + projection * segmentY
  const deltaX = circle.x - closestX
  const deltaY = circle.y - closestY
  const radius = circle.radius + Math.max(0, padding)
  return deltaX * deltaX + deltaY * deltaY <= radius * radius
}
