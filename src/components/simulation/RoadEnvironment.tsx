import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';

type Point2D = { x: number; y: number };

type GeometryInfo = {
  s: number;
  x: number;
  y: number;
  hdg: number;
  length: number;
  kind: 'line' | 'arc' | 'spiral';
  curvature?: number;
  curvStart?: number;
  curvEnd?: number;
};

type LaneWidthDef = {
  sOffset: number;
  a: number;
  b: number;
  c: number;
  d: number;
};

type LaneDef = {
  id: number;
  widths: LaneWidthDef[];
};

type LaneSectionDef = {
  sStart: number;
  sEnd: number;
  left: LaneDef[];
  right: LaneDef[];
  center: LaneDef[];
};

type RoadDef = {
  id: string;
  length: number;
  geometries: GeometryInfo[];
  laneOffsets: { s: number; a: number; b: number; c: number; d: number }[];
  sections: LaneSectionDef[];
};

interface Props {
  mapUrl: string;
}

const EPS = 1e-6;

// 숫자 attr 파서
function num(el: Element | null, name: string, def = 0): number {
  if (!el) return def;
  const v = el.getAttribute(name);
  if (v === null) return def;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : def;
}

// 다항식 계산
function evalPoly(a: number, b: number, c: number, d: number, ds: number): number {
  return a + b * ds + c * ds * ds + d * ds * ds * ds;
}

// 중복 제거
function dedupeSortedBy<T>(arr: T[], key: (t: T) => number, eps = EPS): T[] {
  if (arr.length === 0) return arr;
  const res: T[] = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    if (Math.abs(key(arr[i]) - key(res[res.length - 1])) > eps) res.push(arr[i]);
  }
  return res;
}

// XODR XML 로더
async function loadXodr(url: string): Promise<Document> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`XODR fetch 실패: ${res.status} ${res.statusText}`);
  const text = await res.text();
  const parser = new DOMParser();
  return parser.parseFromString(text, 'application/xml');
}

// Geometry 적분 샘플링 (개선된 버전)
type IntegrState = { x: number; y: number; hdg: number };

function integrateGeometry(
  start: IntegrState,
  length: number,
  getCurv: (sLocal: number) => number,
  ds = 0.5, // 더 세밀한 샘플링
): { points: Point2D[]; hdgs: number[] } {
  const steps = Math.max(2, Math.ceil(length / ds));
  const outPts: Point2D[] = [];
  const outHdgs: number[] = [];
  let { x, y, hdg } = start;

  outPts.push({ x, y });
  outHdgs.push(hdg);

  for (let i = 1; i <= steps; i++) {
    const sLocal = (i / steps) * length;
    const prevSLocal = ((i - 1) / steps) * length;

    // 중점에서의 곡률을 사용하여 더 정확한 적분
    const midS = (sLocal + prevSLocal) / 2;
    const k = getCurv(midS);
    const d = length / steps;

    const oldHdg = hdg;
    hdg += k * d;

    // 평균 방향을 사용하여 위치 업데이트
    const avgHdg = (oldHdg + hdg) / 2;
    x += Math.cos(avgHdg) * d;
    y += Math.sin(avgHdg) * d;

    outPts.push({ x, y });
    outHdgs.push(hdg);
  }
  return { points: outPts, hdgs: outHdgs };
}

function sampleGeometries(geoms: GeometryInfo[], ds = 0.5): { s: number[]; points: Point2D[] } {
  const sAll: number[] = [];
  const pAll: Point2D[] = [];
  if (geoms.length === 0) return { s: sAll, points: pAll };

  // 첫 번째 geometry의 시작점을 기준으로 연속성 보장
  let lastState: IntegrState | null = null;

  for (let gi = 0; gi < geoms.length; gi++) {
    const g = geoms[gi];

    // 연속성을 위해 이전 geometry의 끝점을 사용
    const start: IntegrState = lastState || { x: g.x, y: g.y, hdg: g.hdg };

    // 하지만 XODR 파일의 정의된 시작점과 차이가 크면 파일 값 사용
    if (lastState) {
      const dist = Math.hypot(lastState.x - g.x, lastState.y - g.y);
      if (dist > 0.1) {
        // 10cm 이상 차이나면 파일 값 사용
        start.x = g.x;
        start.y = g.y;
        start.hdg = g.hdg;
      }
    }

    const getCurv =
      g.kind === 'line'
        ? (_s: number) => 0
        : g.kind === 'arc'
          ? (_s: number) => g.curvature || 0
          : (sLocal: number) => {
              const k0 = g.curvStart || 0;
              const k1 = g.curvEnd ?? k0;
              const a = (k1 - k0) / Math.max(1e-9, g.length);
              return k0 + a * sLocal;
            };

    const { points, hdgs } = integrateGeometry(start, g.length, getCurv, ds);

    // 다음 geometry를 위해 마지막 상태 저장
    if (points.length > 0 && hdgs.length > 0) {
      const lastPoint = points[points.length - 1];
      const lastHdg = hdgs[hdgs.length - 1];
      lastState = { x: lastPoint.x, y: lastPoint.y, hdg: lastHdg };
    }

    const sStart = g.s;
    const steps = points.length - 1;
    for (let i = 0; i < points.length; i++) {
      const sAbs = sStart + (g.length * i) / Math.max(1, steps);
      if (gi > 0 && i === 0) continue; // 중복 제거
      sAll.push(sAbs);
      pAll.push(points[i]);
    }
  }
  return { s: sAll, points: pAll };
}

// Lane offset 계산
function evalLaneOffsetAt(
  laneOffsets: { s: number; a: number; b: number; c: number; d: number }[],
  s: number,
): number {
  if (!laneOffsets || laneOffsets.length === 0) return 0;
  const sorted = [...laneOffsets].sort((a, b) => a.s - b.s);
  let w = sorted[0];
  for (const lo of sorted) {
    if (s + EPS >= lo.s) w = lo;
    else break;
  }
  const ds = s - w.s;
  return evalPoly(w.a, w.b, w.c, w.d, ds);
}

// Lane width 계산
function sanitizeWidths(widths: LaneWidthDef[]): LaneWidthDef[] {
  const sorted = [...widths].sort((a, b) => a.sOffset - b.sOffset);
  return dedupeSortedBy(sorted, (w) => w.sOffset, 1e-6);
}

function evalLaneWidthAt(lane: LaneDef, sRel: number): number {
  const widths = sanitizeWidths(lane.widths);
  if (widths.length === 0) return NaN;

  let w = widths[0];
  for (const wd of widths) {
    if (sRel + EPS >= wd.sOffset) w = wd;
    else break;
  }
  const ds = sRel - w.sOffset;
  const val = evalPoly(w.a, w.b, w.c, w.d, ds);
  return Math.max(0, val);
}

// 수직 오프셋 적용 (개선된 버전)
function offsetPerp(center: Point2D[], offsets: number[]): Point2D[] {
  const out: Point2D[] = [];

  for (let i = 0; i < center.length; i++) {
    const p = center[i];
    let dx: number, dy: number;

    if (center.length === 1) {
      // 점이 하나뿐이면 기본 방향 사용
      dx = 1;
      dy = 0;
    } else if (i === 0) {
      // 첫 번째 점: 다음 점과의 방향 사용
      const pNext = center[1];
      dx = pNext.x - p.x;
      dy = pNext.y - p.y;
    } else if (i === center.length - 1) {
      // 마지막 점: 이전 점과의 방향 사용
      const pPrev = center[i - 1];
      dx = p.x - pPrev.x;
      dy = p.y - pPrev.y;
    } else {
      // 중간 점: 이전과 다음 점의 평균 방향 사용
      const pPrev = center[i - 1];
      const pNext = center[i + 1];
      dx = pNext.x - pPrev.x;
      dy = pNext.y - pPrev.y;
    }

    const len = Math.hypot(dx, dy);
    if (len < 1e-10) {
      // 길이가 너무 작으면 이전 점과 같은 위치 사용
      if (out.length > 0) {
        out.push({ ...out[out.length - 1] });
      } else {
        out.push({ ...p });
      }
      continue;
    }

    dx /= len;
    dy /= len;
    const nx = -dy; // 수직 벡터
    const ny = dx;

    const off = offsets[i] || 0;

    // 오프셋이 너무 크면 제한
    const maxOffset = 50; // 최대 50m
    const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, off));

    out.push({
      x: p.x + nx * clampedOffset,
      y: p.y + ny * clampedOffset,
    });
  }
  return out;
}

// 섹션 경계 오프셋 계산
function buildSectionBoundariesOffsets(
  sSlice: number[],
  section: LaneSectionDef,
  laneOffsets: { s: number; a: number; b: number; c: number; d: number }[],
): { left: number[][]; right: number[][]; laneOffsetVals: number[] } {
  const s0 = section.sStart;
  const laneOffVals = sSlice.map((s) => evalLaneOffsetAt(laneOffsets, s));

  const leftSorted = [...section.left].sort((a, b) => a.id - b.id);
  const rightSorted = [...section.right].sort((a, b) => b.id - a.id);

  const leftWs = leftSorted.map((l) =>
    sSlice.map((s) => {
      const w = evalLaneWidthAt(l, s - s0);
      return Number.isFinite(w) ? w : NaN;
    }),
  );
  const rightWs = rightSorted.map((l) =>
    sSlice.map((s) => {
      const w = evalLaneWidthAt(l, s - s0);
      return Number.isFinite(w) ? w : NaN;
    }),
  );

  const fixSeq = (seq: number[]) => {
    let last = 3.5;
    for (let i = 0; i < seq.length; i++) {
      if (!Number.isFinite(seq[i])) seq[i] = last;
      else last = seq[i];
    }
    return seq;
  };
  leftWs.forEach((seq) => fixSeq(seq));
  rightWs.forEach((seq) => fixSeq(seq));

  const leftBoundaries: number[][] = [];
  const rightBoundaries: number[][] = [];

  leftBoundaries.push(sSlice.map((_, i) => laneOffVals[i] + 0));
  rightBoundaries.push(sSlice.map((_, i) => laneOffVals[i] + 0));

  for (let k = 0; k < leftWs.length; k++) {
    const prev = leftBoundaries[leftBoundaries.length - 1];
    leftBoundaries.push(prev.map((v, i) => v + leftWs[k][i]));
  }
  for (let k = 0; k < rightWs.length; k++) {
    const prev = rightBoundaries[rightBoundaries.length - 1];
    rightBoundaries.push(prev.map((v, i) => v - rightWs[k][i]));
  }

  return { left: leftBoundaries, right: rightBoundaries, laneOffsetVals: laneOffVals };
}

// XML → RoadDef 파싱
function parseRoad(roadEl: Element): RoadDef {
  const id = roadEl.getAttribute('id') ?? '';
  const length = num(roadEl, 'length', 0);

  const geoms: GeometryInfo[] = [];
  const plan = roadEl.querySelector('planView');
  plan?.querySelectorAll('geometry').forEach((g) => {
    const s = num(g, 's', 0);
    const x = num(g, 'x', 0);
    const y = num(g, 'y', 0);
    const hdg = num(g, 'hdg', 0);
    const length = num(g, 'length', 0);
    let kind: GeometryInfo['kind'] = 'line';
    let curvature: number | undefined;
    let curvStart: number | undefined;
    let curvEnd: number | undefined;

    if (g.querySelector('arc')) {
      kind = 'arc';
      curvature = num(g.querySelector('arc'), 'curvature', 0);
    } else if (g.querySelector('spiral')) {
      kind = 'spiral';
      curvStart = num(g.querySelector('spiral'), 'curvStart', 0);
      curvEnd = num(g.querySelector('spiral'), 'curvEnd', curvStart);
    } else {
      kind = 'line';
    }
    geoms.push({ s, x, y, hdg, length, kind, curvature, curvStart, curvEnd });
  });

  const laneOffsets: RoadDef['laneOffsets'] = [];
  roadEl.querySelectorAll('lanes > laneOffset').forEach((lo) => {
    laneOffsets.push({
      s: num(lo, 's', 0),
      a: num(lo, 'a', 0),
      b: num(lo, 'b', 0),
      c: num(lo, 'c', 0),
      d: num(lo, 'd', 0),
    });
  });

  const sections: LaneSectionDef[] = [];
  const laneSections = roadEl.querySelectorAll('lanes > laneSection');
  laneSections.forEach((secEl, idx) => {
    const sStart = num(secEl, 's', 0);
    const sEnd = idx < laneSections.length - 1 ? num(laneSections[idx + 1], 's', length) : length;

    const parseLaneGroup = (sel: 'left' | 'center' | 'right'): LaneDef[] => {
      const res: LaneDef[] = [];
      secEl.querySelectorAll(`${sel} > lane`).forEach((ln) => {
        const idAttr = ln.getAttribute('id');
        const laneId = idAttr !== null ? Number(idAttr) : 0;

        const widths: LaneWidthDef[] = Array.from(ln.querySelectorAll('width')).map((w) => ({
          sOffset: num(w, 'sOffset', 0),
          a: num(w, 'a', 0),
          b: num(w, 'b', 0),
          c: num(w, 'c', 0),
          d: num(w, 'd', 0),
        }));

        res.push({ id: laneId, widths });
      });
      return res;
    };

    sections.push({
      sStart,
      sEnd,
      left: parseLaneGroup('left'),
      center: parseLaneGroup('center'),
      right: parseLaneGroup('right'),
    });
  });

  return { id, length, geometries: geoms, laneOffsets, sections };
}

export default function RoadEnvironment({ mapUrl }: Props) {
  const [roadLines, setRoadLines] = useState<THREE.Vector3[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const buildRoadLines = async () => {
      try {
        setLoading(true);
        const xml = await loadXodr(mapUrl);
        const roadEls = Array.from(xml.querySelectorAll('road'));

        const SCALE = 0.1;
        const allPointsForCenter: Point2D[] = [];
        const lines: THREE.Vector3[][] = [];

        const roads: {
          def: RoadDef;
          sample: { s: number[]; points: Point2D[] };
        }[] = [];

        for (const rEl of roadEls) {
          const def = parseRoad(rEl);
          if (def.geometries.length === 0) continue;
          const sample = sampleGeometries(def.geometries, 1);
          roads.push({ def, sample });
          allPointsForCenter.push(...sample.points);
        }

        const avgX =
          allPointsForCenter.reduce((s, p) => s + p.x, 0) / Math.max(1, allPointsForCenter.length);
        const avgY =
          allPointsForCenter.reduce((s, p) => s + p.y, 0) / Math.max(1, allPointsForCenter.length);

        for (const { def, sample } of roads) {
          for (const sec of def.sections) {
            const idxStart = sample.s.findIndex((sv) => sv >= sec.sStart - 1e-6);
            if (idxStart < 0) continue;
            let idxEnd = idxStart;
            while (idxEnd + 1 < sample.s.length && sample.s[idxEnd + 1] < sec.sEnd + 1e-6) idxEnd++;

            const sSlice = sample.s.slice(idxStart, idxEnd + 1);
            const cSlice = sample.points.slice(idxStart, idxEnd + 1);
            if (sSlice.length < 2) continue;

            const { left, right } = buildSectionBoundariesOffsets(sSlice, sec, def.laneOffsets);

            for (let k = 0; k < left.length; k++) {
              const offPts = offsetPerp(cSlice, left[k]);
              const threePts = offPts.map(
                (p) => new THREE.Vector3((p.x - avgX) * SCALE, 0, -(p.y - avgY) * SCALE),
              );
              lines.push(threePts);
            }

            for (let k = 0; k < right.length; k++) {
              const offPts = offsetPerp(cSlice, right[k]);
              const threePts = offPts.map(
                (p) => new THREE.Vector3((p.x - avgX) * SCALE, 0, -(p.y - avgY) * SCALE),
              );
              lines.push(threePts);
            }
          }
        }

        setRoadLines(lines);
        setError(null);
      } catch (err) {
        console.error('Error loading XODR file:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    buildRoadLines();
  }, [mapUrl]);

  if (loading) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="gray" />
      </mesh>
    );
  }

  if (error) {
    console.error('RoadEnvironment error:', error);
    return null;
  }

  return (
    <group>
      {roadLines.map((points, index) => {
        if (points.length < 2) return null;
        return <Line key={index} points={points} color="#8E8E8E" lineWidth={2} dashed={false} />;
      })}
    </group>
  );
}
