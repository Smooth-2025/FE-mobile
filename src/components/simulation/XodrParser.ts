import { XMLParser } from 'fast-xml-parser';
import { safeParseInt, safeParseFloat } from '@/utils/numberParser';
import type { OpenDriveData, Road, OpenDriveGeometry, LaneSection, Lane, LaneWidth } from './types';

interface ParsedXmlData {
  OpenDRIVE: ParsedOpenDriveData;
}

interface ParsedOpenDriveData {
  header?: ParsedHeader;
  road?: ParsedRoad | ParsedRoad[];
}

interface ParsedHeader {
  '@_revMajor'?: string | number;
  '@_revMinor'?: string | number;
  '@_name'?: string;
}

interface ParsedRoad {
  '@_id'?: string | number;
  '@_name'?: string;
  '@_length'?: string | number;
  planView?: ParsedPlanView;
  lanes?: ParsedLanes;
}

interface ParsedPlanView {
  geometry?: ParsedGeometry | ParsedGeometry[];
}

interface ParsedGeometry {
  '@_s'?: string | number;
  '@_x'?: string | number;
  '@_y'?: string | number;
  '@_hdg'?: string | number;
  '@_length'?: string | number;
  line?: unknown;
  arc?: ParsedArc;
  spiral?: ParsedSpiral;
}

interface ParsedArc {
  '@_curvature'?: string | number;
}

interface ParsedSpiral {
  '@_curvStart'?: string | number;
  '@_curvEnd'?: string | number;
}

interface ParsedLanes {
  laneSection?: ParsedLaneSection | ParsedLaneSection[];
}

interface ParsedLaneSection {
  '@_s'?: string | number;
  left?: ParsedLaneGroup;
  center?: ParsedLaneGroup;
  right?: ParsedLaneGroup;
}

interface ParsedLaneGroup {
  lane?: ParsedLane | ParsedLane[];
}

interface ParsedLane {
  '@_id'?: string | number;
  '@_type'?: string;
  '@_level'?: string | boolean;
  width?: ParsedLaneWidth | ParsedLaneWidth[];
}

interface ParsedLaneWidth {
  '@_sOffset'?: string | number;
  '@_a'?: string | number;
  '@_b'?: string | number;
  '@_c'?: string | number;
  '@_d'?: string | number;
}

// XML 파서 설정 옵션 (OpenDRIVE 스키마에 최적화된 파싱 설정)
const parserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseAttributeValue: true,
  parseNodeValue: true,
  parseTrueNumberOnly: false,
  arrayMode: false,
  alwaysCreateTextNode: false,
  isArray: (name: string) => {
    const arrayElements = ['road', 'geometry', 'laneSection', 'lane', 'width'];
    return arrayElements.includes(name);
  },
  stopNodes: ['*.geoReference'],
  processEntities: true,
  htmlEntities: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseTagValue: true,
  trimValues: true,
  cdataPropName: undefined,
  numberParseOptions: {
    hex: true,
    leadingZeros: true,
    eNotation: true,
  },
};

/**
 * OpenDRIVE (.xodr) XML 파일 내용을 구조화된 TypeScript 객체로 파싱
 *
 * @param xmlContent - 원시 XML 내용 문자열
 * @returns 파싱된 OpenDRIVE 데이터 구조로 해결되는 Promise
 * @throws {Error} XML 형식이 잘못되었거나 필수 요소가 누락된 경우
 */
export async function parseXodrFile(xmlContent: string): Promise<OpenDriveData> {
  try {
    // XML 내용 검증
    if (!xmlContent || typeof xmlContent !== 'string') {
      throw new Error('유효하지 않은 XML 내용: 빈 문자열이거나 문자열이 아닙니다');
    }

    if (!xmlContent.trim().startsWith('<?xml')) {
      throw new Error('유효하지 않은 XML 형식: XML 선언이 누락되었습니다');
    }

    // 기본적인 XML 구조 검증
    if (!xmlContent.includes('<OpenDRIVE>') || !xmlContent.includes('</OpenDRIVE>')) {
      throw new Error('유효하지 않은 XML 형식: OpenDRIVE 태그가 올바르게 닫히지 않았습니다');
    }

    // XML 파서 생성 및 파싱 실행
    const parser = new XMLParser(parserOptions);
    let parsedData: ParsedXmlData;

    try {
      parsedData = parser.parse(xmlContent) as ParsedXmlData;
    } catch (parseError) {
      throw new Error(
        `XML 파싱 실패: ${parseError instanceof Error ? parseError.message : '알 수 없는 오류'}`,
      );
    }

    // 기본 구조 검증
    if (!parsedData || !parsedData.OpenDRIVE) {
      throw new Error('유효하지 않은 OpenDRIVE 파일: OpenDRIVE 루트 요소가 누락되었습니다');
    }

    // 구조화된 데이터로 변환
    const openDriveData = transformParsedData(parsedData.OpenDRIVE);

    // 변환된 데이터 기본 검증
    if (!openDriveData || !openDriveData.road || !Array.isArray(openDriveData.road)) {
      throw new Error('파싱된 데이터가 OpenDRIVE 구조 요구사항을 충족하지 않습니다');
    }

    return openDriveData;
  } catch (error) {
    if (error instanceof Error) {
      // XML 파싱 오류에 대한 더 자세한 정보 제공
      if (error.message.includes('Invalid XML')) {
        throw new Error(`XML 파싱 오류: ${error.message}`);
      }
      throw error;
    }
    throw new Error('알 수 없는 오류가 발생했습니다');
  }
}

/**
 * 파싱된 원시 데이터를 OpenDriveData 구조로 변환
 *
 * @param rawData - fast-xml-parser에서 파싱된 원시 데이터
 * @returns 변환된 OpenDriveData 객체
 */
function transformParsedData(rawData: ParsedOpenDriveData): OpenDriveData {
  // 헤더 정보 추출
  const headerName = rawData.header?.['@_name'];
  const header = {
    revMajor: safeParseInt(rawData.header?.['@_revMajor']) || 1,
    revMinor: safeParseInt(rawData.header?.['@_revMinor']) || 0,
    name: headerName && headerName.trim() !== '' ? headerName : undefined,
  };

  // 도로 데이터 변환
  const roads: Road[] = [];
  const rawRoads = Array.isArray(rawData.road) ? rawData.road : rawData.road ? [rawData.road] : [];

  for (const rawRoad of rawRoads) {
    if (!rawRoad) continue;

    const road: Road = {
      id: rawRoad['@_id']?.toString() || '',
      name: rawRoad['@_name'] || undefined,
      length: safeParseFloat(rawRoad['@_length']),
      planView: {
        geometry: transformGeometries(rawRoad.planView?.geometry),
      },
      lanes: {
        laneSection: transformLaneSections(rawRoad.lanes?.laneSection),
      },
    };

    roads.push(road);
  }

  return {
    header,
    road: roads,
  };
}

/**
 * 지오메트리 데이터 변환
 *
 * @param rawGeometries - 원시 지오메트리 데이터
 * @returns 변환된 OpenDriveGeometry 배열
 */
function transformGeometries(
  rawGeometries: ParsedGeometry | ParsedGeometry[] | undefined,
): OpenDriveGeometry[] {
  if (!rawGeometries) return [];

  const geometries = Array.isArray(rawGeometries) ? rawGeometries : [rawGeometries];

  return geometries.map((geom) => {
    const geometry: OpenDriveGeometry = {
      s: safeParseFloat(geom['@_s']),
      x: safeParseFloat(geom['@_x']),
      y: safeParseFloat(geom['@_y']),
      hdg: safeParseFloat(geom['@_hdg']),
      length: safeParseFloat(geom['@_length']),
      type: 'line', // 기본값
    };

    // 지오메트리 타입 결정
    if (geom.line !== undefined) {
      geometry.type = 'line';
    } else if (geom.arc !== undefined) {
      geometry.type = 'arc';
      geometry.curvature = safeParseFloat(geom.arc['@_curvature']);
    } else if (geom.spiral !== undefined) {
      geometry.type = 'spiral';
      geometry.curvStart = safeParseFloat(geom.spiral['@_curvStart']);
      geometry.curvEnd = safeParseFloat(geom.spiral['@_curvEnd']);
    }

    return geometry;
  });
}

/**
 * 차선 섹션 데이터를 변환
 *
 * @param rawLaneSections - 원시 차선 섹션 데이터
 * @returns 변환된 LaneSection 배열
 */
function transformLaneSections(
  rawLaneSections: ParsedLaneSection | ParsedLaneSection[] | undefined,
): LaneSection[] {
  if (!rawLaneSections) return [];

  const sections = Array.isArray(rawLaneSections) ? rawLaneSections : [rawLaneSections];

  return sections.map((section) => {
    const laneSection: LaneSection = {
      s: safeParseFloat(section['@_s']),
    };

    // 좌측, 중앙, 우측 차선 변환
    if (section.left?.lane) {
      laneSection.left = transformLanes(section.left.lane);
    }
    if (section.center?.lane) {
      laneSection.center = transformLanes(section.center.lane);
    }
    if (section.right?.lane) {
      laneSection.right = transformLanes(section.right.lane);
    }

    return laneSection;
  });
}

/**
 * 차선 데이터를 변환
 *
 * @param rawLanes - 원시 차선 데이터
 * @returns 변환된 Lane 배열
 */
function transformLanes(rawLanes: ParsedLane | ParsedLane[] | undefined): Lane[] {
  if (!rawLanes) return [];

  const lanes = Array.isArray(rawLanes) ? rawLanes : [rawLanes];

  return lanes.map((lane) => {
    const transformedLane: Lane = {
      id: safeParseInt(lane['@_id']),
      type: lane['@_type'] || 'none',
      level: lane['@_level'] === 'true' || lane['@_level'] === true,
      width: transformLaneWidths(lane.width),
    };

    return transformedLane;
  });
}

/**
 * 차선 폭 데이터를 변환
 *
 * @param rawWidths - 원시 차선 폭 데이터
 * @returns 변환된 LaneWidth 배열
 */
function transformLaneWidths(
  rawWidths: ParsedLaneWidth | ParsedLaneWidth[] | undefined,
): LaneWidth[] {
  if (!rawWidths) return [];

  const widths = Array.isArray(rawWidths) ? rawWidths : [rawWidths];

  return widths.map((width) => ({
    sOffset: safeParseFloat(width['@_sOffset']),
    a: safeParseFloat(width['@_a']),
    b: safeParseFloat(width['@_b']),
    c: safeParseFloat(width['@_c']),
    d: safeParseFloat(width['@_d']),
  }));
}
