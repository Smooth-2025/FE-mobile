import type { OpenDriveGeometry, Point2D } from './types';

export function sampleLine(geometry: OpenDriveGeometry, resolution: number): Point2D[] {
  if (geometry.type !== 'line') {
    throw new Error('Geometry type must be "line" for sampleLine function');
  }

  if (resolution <= 0) {
    throw new Error('Resolution must be greater than 0');
  }

  if (geometry.length <= 0) {
    throw new Error('Geometry length must be greater than 0');
  }

  const points: Point2D[] = [];
  const numPoints = Math.max(2, Math.ceil(geometry.length * resolution));

  const cos_hdg = Math.cos(geometry.hdg);
  const sin_hdg = Math.sin(geometry.hdg);

  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1);
    const distance = t * geometry.length;

    const point: Point2D = {
      x: geometry.x + distance * cos_hdg,
      y: geometry.y + distance * sin_hdg,
    };

    points.push(point);
  }

  return points;
}

export function sampleArc(geometry: OpenDriveGeometry, resolution: number): Point2D[] {
  if (geometry.type !== 'arc') {
    throw new Error('Geometry type must be "arc" for sampleArc function');
  }

  if (resolution <= 0) {
    throw new Error('Resolution must be greater than 0');
  }

  if (geometry.length <= 0) {
    throw new Error('Geometry length must be greater than 0');
  }

  if (geometry.curvature === undefined) {
    throw new Error('Curvature must be defined for arc geometry');
  }

  if (geometry.curvature === 0) {
    throw new Error('Curvature cannot be zero for arc geometry');
  }

  const points: Point2D[] = [];
  const numPoints = Math.max(2, Math.ceil(geometry.length * resolution));

  const radius = 1 / Math.abs(geometry.curvature);

  const centerOffsetAngle = geometry.hdg + (geometry.curvature > 0 ? Math.PI / 2 : -Math.PI / 2);
  const centerX = geometry.x + radius * Math.cos(centerOffsetAngle);
  const centerY = geometry.y + radius * Math.sin(centerOffsetAngle);

  const startAngle = Math.atan2(geometry.y - centerY, geometry.x - centerX);

  const totalAngle = geometry.length / radius;

  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1);
    const currentAngle = startAngle + (geometry.curvature > 0 ? totalAngle : -totalAngle) * t;

    const point: Point2D = {
      x: centerX + radius * Math.cos(currentAngle),
      y: centerY + radius * Math.sin(currentAngle),
    };

    points.push(point);
  }

  return points;
}

export function sampleSpiral(geometry: OpenDriveGeometry, resolution: number): Point2D[] {
  if (geometry.type !== 'spiral') {
    throw new Error('Geometry type must be "spiral" for sampleSpiral function');
  }

  if (resolution <= 0) {
    throw new Error('Resolution must be greater than 0');
  }

  if (geometry.length <= 0) {
    throw new Error('Geometry length must be greater than 0');
  }

  if (geometry.curvStart === undefined || geometry.curvEnd === undefined) {
    throw new Error('curvStart and curvEnd must be defined for spiral geometry');
  }

  const points: Point2D[] = [];
  const numPoints = Math.max(2, Math.ceil(geometry.length * resolution));

  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1);
    const s = t * geometry.length;

    const { x, y } = integrateSpiral(
      geometry.x,
      geometry.y,
      geometry.hdg,
      s,
      geometry.curvStart,
      geometry.curvEnd,
      geometry.length,
    );

    const point: Point2D = { x, y };
    points.push(point);
  }

  return points;
}

function integrateSpiral(
  startX: number,
  startY: number,
  startHeading: number,
  distance: number,
  curvStart: number,
  curvEnd: number,
  totalLength: number,
): { x: number; y: number; heading: number } {
  const steps = Math.max(10, Math.ceil(distance * 10));
  const stepSize = distance / steps;

  let x = startX;
  let y = startY;
  let heading = startHeading;

  for (let i = 0; i < steps; i++) {
    const s = i * stepSize;
    const t = s / totalLength;

    const currentCurvature = curvStart + (curvEnd - curvStart) * t;

    x += stepSize * Math.cos(heading);
    y += stepSize * Math.sin(heading);

    heading += currentCurvature * stepSize;
  }

  return { x, y, heading };
}

export function sampleRoadGeometry(geometries: OpenDriveGeometry[], resolution: number): Point2D[] {
  if (!Array.isArray(geometries)) {
    throw new Error('Geometries must be an array');
  }

  if (geometries.length === 0) {
    return [];
  }

  if (resolution <= 0) {
    throw new Error('Resolution must be greater than 0');
  }

  const allPoints: Point2D[] = [];

  for (let i = 0; i < geometries.length; i++) {
    const geometry = geometries[i];

    const adaptiveResolution = calculateAdaptiveResolution(geometry, resolution);

    let segmentPoints: Point2D[] = [];

    switch (geometry.type) {
      case 'line':
        segmentPoints = sampleLine(geometry, adaptiveResolution);
        break;
      case 'arc':
        segmentPoints = sampleArc(geometry, adaptiveResolution);
        break;
      case 'spiral':
        segmentPoints = sampleSpiral(geometry, adaptiveResolution);
        break;
      default:
        throw new Error(`Unsupported geometry type: ${geometry.type}`);
    }
    if (i === 0) {
      allPoints.push(...segmentPoints);
    } else {
      if (segmentPoints.length > 1) {
        const lastPoint = allPoints[allPoints.length - 1];
        const firstPoint = segmentPoints[0];
        const distance = Math.sqrt(
          Math.pow(firstPoint.x - lastPoint.x, 2) + Math.pow(firstPoint.y - lastPoint.y, 2),
        );

        if (distance > 0.1) {
          console.warn(
            `Discontinuity detected between geometry segments: ${distance.toFixed(3)}m gap`,
          );
        }
        allPoints.push(...segmentPoints.slice(1));
      }
    }
  }

  return allPoints;
}

function calculateAdaptiveResolution(geometry: OpenDriveGeometry, baseResolution: number): number {
  switch (geometry.type) {
    case 'line':
      return baseResolution;

    case 'arc': {
      if (geometry.curvature === undefined) return baseResolution;
      const curvatureFactor = Math.min(3, Math.max(1, Math.abs(geometry.curvature) * 10));
      return baseResolution * curvatureFactor;
    }

    case 'spiral': {
      if (geometry.curvStart === undefined || geometry.curvEnd === undefined) return baseResolution;
      const curvatureChange = Math.abs(geometry.curvEnd - geometry.curvStart);
      const spiralFactor = Math.min(2, Math.max(1, curvatureChange * 20));
      return baseResolution * spiralFactor;
    }

    default:
      return baseResolution;
  }
}
