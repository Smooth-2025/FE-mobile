import type {
  Point2D,
  LaneWidth,
  Lane,
  Road,
  LaneBoundaryData,
} from '../components/simulation/types';

/**
 * 차선 폭 다항식을 평가하여 특정 s 좌표에서의 폭을 계산합니다
 *
 * OpenDRIVE에서 차선 폭은 3차 다항식으로 정의됩니다:
 * w(s) = a + b*s + c*s² + d*s³
 * 여기서 s는 해당 폭 정의의 sOffset으로부터의 상대적 거리입니다.
 *
 * @param width - 차선 폭 정의 (다항식 계수 포함)
 * @param s - 평가할 s 좌표 (미터 단위)
 * @returns 계산된 차선 폭 (미터 단위)
 */
function evaluateWidthPolynomial(width: LaneWidth, s: number): number {
  if (!width || typeof width !== 'object') {
    throw new Error('유효하지 않은 차선 폭 정의');
  }

  //숫자인지 검증
  const coefficients = ['a', 'b', 'c', 'd'] as const;
  for (const coeff of coefficients) {
    if (typeof width[coeff] !== 'number') {
      throw new Error(`차선 폭 계수 '${coeff}'가 유효하지 않습니다`);
    }
  }

  if (typeof s !== 'number' || !isFinite(s)) {
    throw new Error('s 좌표는 유효한 숫자여야 합니다');
  }

  // sOffset으로부터의 상대적 거리 계산
  const relativeS = s - width.sOffset;

  // 3차 다항식 계산: w(s) = a + b*s + c*s² + d*s³
  const widthValue =
    width.a +
    width.b * relativeS +
    width.c * relativeS * relativeS +
    width.d * relativeS * relativeS * relativeS;

  // 음수 폭은 허용하지 않음 (최소값 0으로 제한)
  return Math.max(0, widthValue);
}

/**
 * 차선의 여러 폭 정의를 사용하여 특정 s 좌표의 폭을 계산
 *
 * 차선은 여러 개의 폭 정의를 가질 수 있으며, 각각은 서로 다른 sOffset에서 시작.
 * 주어진 s 좌표에 해당하는 적절한 폭 정의를 찾아 폭을 계산.
 *
 * @param lane - 차선 정의 (폭 배열 포함)
 * @param s - 평가할 s 좌표 (미터 단위)
 * @returns 계산된 차선 폭 (미터 단위)
 */
export function calculateLaneWidth(lane: Lane, s: number): number {
  if (!lane || !Array.isArray(lane.width) || lane.width.length === 0) {
    throw new Error('유효하지 않은 차선 정의 또는 폭 데이터가 없습니다');
  }

  if (typeof s !== 'number' || !isFinite(s)) {
    throw new Error('s 좌표는 유효한 숫자여야 합니다');
  }

  // 폭 정의들을 sOffset 순으로 정렬
  const sortedWidths = [...lane.width].sort((a, b) => a.sOffset - b.sOffset);

  // 주어진 s 좌표에 해당하는 폭 정의 확인
  let applicableWidth = sortedWidths[0];

  for (let i = 0; i < sortedWidths.length; i++) {
    const width = sortedWidths[i];
    if (s >= width.sOffset) {
      applicableWidth = width;
    } else {
      break;
    }
  }

  return evaluateWidthPolynomial(applicableWidth, s);
}

/**
 * 중심선 좌표점들을 수직으로 오프셋하여 차선 경계 좌표 생성
 *
 * 각 중심선 점에서 수직 방향으로 지정된 거리만큼 오프셋된 점들을 계산합니다.
 * 방향은 중심선의 진행 방향을 기준으로 계산됩니다.
 *
 * @param centerPoints - 중심선 좌표점 배열
 * @param offsets - 각 점에 대응하는 오프셋 거리 배열 (미터 단위, 양수는 좌측, 음수는 우측)
 * @returns 오프셋된 경계 좌표점 배열
 */
export function offsetPointsPerpendicularly(centerPoints: Point2D[], offsets: number[]): Point2D[] {
  if (!Array.isArray(centerPoints) || centerPoints.length === 0) {
    throw new Error('중심선 좌표점 배열이 유효하지 않거나 비어있습니다');
  }

  if (!Array.isArray(offsets) || offsets.length !== centerPoints.length) {
    throw new Error('오프셋 배열의 길이가 좌표점 배열의 길이와 일치하지 않습니다');
  }

  // 모든 오프셋이 유효한 숫자인지 검증
  for (let i = 0; i < offsets.length; i++) {
    if (typeof offsets[i] !== 'number' || !isFinite(offsets[i])) {
      throw new Error(`오프셋 값 [${i}]이 유효하지 않습니다: ${offsets[i]}`);
    }
  }

  const boundaryPoints: Point2D[] = [];

  for (let i = 0; i < centerPoints.length; i++) {
    const currentPoint = centerPoints[i];
    const offset = offsets[i];

    // 현재 점에서의 방향 벡터 계산
    let direction: Point2D;

    if (i === 0) {
      // 첫 번째 점: 다음 점과의 방향 사용
      if (centerPoints.length > 1) {
        const nextPoint = centerPoints[1];
        direction = {
          x: nextPoint.x - currentPoint.x,
          y: nextPoint.y - currentPoint.y,
        };
      } else {
        // 단일 점인 경우 기본 방향 (동쪽) 사용
        direction = { x: 1, y: 0 };
      }
    } else if (i === centerPoints.length - 1) {
      // 마지막 점: 이전 점과의 방향 사용
      const prevPoint = centerPoints[i - 1];
      direction = {
        x: currentPoint.x - prevPoint.x,
        y: currentPoint.y - prevPoint.y,
      };
    } else {
      // 중간 점: 이전 점과 다음 점의 평균 방향 사용 (부드러운 곡선)
      const prevPoint = centerPoints[i - 1];
      const nextPoint = centerPoints[i + 1];

      const prevDirection = {
        x: currentPoint.x - prevPoint.x,
        y: currentPoint.y - prevPoint.y,
      };

      const nextDirection = {
        x: nextPoint.x - currentPoint.x,
        y: nextPoint.y - currentPoint.y,
      };

      // 두 방향의 평균
      direction = {
        x: (prevDirection.x + nextDirection.x) / 2,
        y: (prevDirection.y + nextDirection.y) / 2,
      };
    }

    // 방향 벡터 정규화
    const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    if (length === 0) {
      // 방향을 계산할 수 없는 경우 기본 방향 사용
      direction = { x: 1, y: 0 };
    } else {
      direction.x /= length;
      direction.y /= length;
    }

    // 수직 벡터 계산 (90도 회전: (x, y) -> (-y, x))
    const perpendicular = {
      x: -direction.y,
      y: direction.x,
    };

    // 오프셋 적용하여 경계 점 계산
    const boundaryPoint: Point2D = {
      x: currentPoint.x + perpendicular.x * offset,
      y: currentPoint.y + perpendicular.y * offset,
    };

    boundaryPoints.push(boundaryPoint);
  }

  return boundaryPoints;
}

/**
 * 도로의 완전한 차선 경계 데이터 계산
 *
 * 도로의 중심선과 차선 정보를 사용하여 모든 차선의 경계 좌표를 계산.
 * 각 차선 섹션과 차선별로 적절한 폭을 계산하고 경계 좌표 생성.
 *
 * @param road - 도로 정의 (차선 섹션 및 차선 정보 포함)
 * @param centerLine - 도로 중심선 좌표점 배열
 * @returns 계산된 차선 경계 데이터
 */
export function calculateLaneBoundaries(road: Road, centerLine: Point2D[]): LaneBoundaryData {
  if (!road || typeof road !== 'object') {
    throw new Error('유효하지 않은 도로 정의');
  }

  if (!Array.isArray(centerLine) || centerLine.length === 0) {
    throw new Error('중심선 좌표점 배열이 유효하지 않거나 비어있습니다');
  }

  if (
    !road.lanes ||
    !Array.isArray(road.lanes.laneSection) ||
    road.lanes.laneSection.length === 0
  ) {
    throw new Error('도로에 유효한 차선 섹션이 없습니다');
  }

  const boundaries: { [laneId: string]: Point2D[] } = {};

  // 각 차선 섹션 처리
  for (let sectionIndex = 0; sectionIndex < road.lanes.laneSection.length; sectionIndex++) {
    const section = road.lanes.laneSection[sectionIndex];

    // 섹션의 시작과 끝 s 좌표 계산
    const sectionStart = section.s;
    const sectionEnd =
      sectionIndex < road.lanes.laneSection.length - 1
        ? road.lanes.laneSection[sectionIndex + 1].s
        : road.length;

    // 이 섹션에 해당하는 중심선 점들의 인덱스 범위 계산
    const startIndex = Math.floor((sectionStart / road.length) * (centerLine.length - 1));
    const endIndex = Math.min(
      Math.ceil((sectionEnd / road.length) * (centerLine.length - 1)),
      centerLine.length - 1,
    );

    // 섹션 내의 중심선 점 추출
    const sectionCenterPoints = centerLine.slice(startIndex, endIndex + 1);

    if (sectionCenterPoints.length === 0) {
      continue; // 이 섹션에 해당하는 점이 없으면 건너뛰기
    }

    // 모든 차선 그룹 처리 (좌측, 중앙, 우측)
    const allLanes: { lane: Lane; side: 'left' | 'center' | 'right' }[] = [];

    if (section.left) {
      section.left.forEach((lane) => allLanes.push({ lane, side: 'left' }));
    }
    if (section.center) {
      section.center.forEach((lane) => allLanes.push({ lane, side: 'center' }));
    }
    if (section.right) {
      section.right.forEach((lane) => allLanes.push({ lane, side: 'right' }));
    }

    // 각 차선의 경계 계산
    for (const { lane, side } of allLanes) {
      const laneId = `${road.id}_${lane.id}`;

      // 이미 처리된 차선인 경우 건너뛰기
      if (boundaries[laneId] && sectionIndex > 0) {
        continue;
      }

      // 차선 폭 계산을 위한 s 좌표 배열 생성
      const sCoordinates: number[] = [];
      for (let i = 0; i < sectionCenterPoints.length; i++) {
        const t = i / Math.max(1, sectionCenterPoints.length - 1);
        const s = sectionStart + (sectionEnd - sectionStart) * t;
        sCoordinates.push(s);
      }

      // 각 점에서의 차선 폭 계산
      const widths: number[] = [];
      for (const s of sCoordinates) {
        try {
          const width = calculateLaneWidth(lane, s);
          widths.push(width);
        } catch {
          // 폭 계산 실패 시 기본값 사용
          console.warn(`차선 ${laneId}의 s=${s}에서 폭 계산 실패, 기본값 3.5m 사용`);
          widths.push(3.5);
        }
      }

      // 차선 위치에 따른 오프셋 방향 결정
      let offsetMultiplier = 1;
      if (side === 'right') {
        offsetMultiplier = -1; // 우측 차선은 음의 오프셋
      } else if (side === 'center') {
        offsetMultiplier = 0; // 중앙선은 오프셋 없음
      }

      // 차선 ID에 따른 누적 오프셋 계산
      let cumulativeOffset = 0;
      if (lane.id !== 0) {
        // 중앙선(ID=0)이 아닌 경우 누적 오프셋 계산
        const laneGroup =
          side === 'left' ? section.left : side === 'right' ? section.right : section.center;

        if (laneGroup) {
          // 차선 ID 순서에 따라 누적 오프셋 계산
          const sortedLanes = [...laneGroup].sort((a, b) =>
            side === 'left' ? a.id - b.id : b.id - a.id,
          );

          for (const otherLane of sortedLanes) {
            if (
              (side === 'left' && otherLane.id < lane.id) ||
              (side === 'right' && otherLane.id > lane.id)
            ) {
              // 이 차선보다 중앙에 가까운 차선들의 폭을 누적
              const avgS = (sectionStart + sectionEnd) / 2;
              try {
                const otherWidth = calculateLaneWidth(otherLane, avgS);
                cumulativeOffset += otherWidth;
              } catch {
                cumulativeOffset += 3.5; // 기본값
              }
            }
          }
        }
      }

      // 오프셋 배열 계산
      const offsets = widths.map((width) => {
        const totalOffset = (cumulativeOffset + width / 2) * offsetMultiplier;
        return totalOffset;
      });

      // 경계 좌표 계산
      try {
        const boundaryPoints = offsetPointsPerpendicularly(sectionCenterPoints, offsets);

        // 기존 경계가 있으면 연결, 없으면 새로 생성
        if (boundaries[laneId]) {
          boundaries[laneId].push(...boundaryPoints);
        } else {
          boundaries[laneId] = boundaryPoints;
        }
      } catch (boundaryError) {
        console.warn(`차선 ${laneId}의 경계 계산 실패:`, boundaryError);
        // 실패한 경우 중심선을 기본 경계로 사용
        boundaries[laneId] = [...sectionCenterPoints];
      }
    }
  }

  return {
    roadId: road.id,
    boundaries,
  };
}
