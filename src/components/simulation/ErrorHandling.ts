import type { OpenDriveData, OpenDriveGeometry, Road, LaneSection } from './types';

export enum ErrorType {
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  INVALID_XML = 'INVALID_XML',
  EMPTY_FILE = 'EMPTY_FILE',
  NO_ROADS = 'NO_ROADS',
  INVALID_GEOMETRY = 'INVALID_GEOMETRY',
  MEMORY_LIMIT = 'MEMORY_LIMIT',
  WEBGL_NOT_SUPPORTED = 'WEBGL_NOT_SUPPORTED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PARSING_ERROR = 'PARSING_ERROR',
  CALCULATION_ERROR = 'CALCULATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface UserFriendlyError {
  type: ErrorType;
  title: string;
  message: string;
  suggestion: string;
  technicalDetails?: string;
  recoverable: boolean;
}

const ERROR_MESSAGES: Record<ErrorType, Omit<UserFriendlyError, 'type' | 'technicalDetails'>> = {
  [ErrorType.FILE_NOT_FOUND]: {
    title: '파일을 찾을 수 없습니다',
    message: '지정된 OpenDRIVE 파일이 존재하지 않거나 접근할 수 없습니다.',
    suggestion: '파일 경로가 올바른지 확인하고, 파일이 서버에 업로드되어 있는지 확인해보세요.',
    recoverable: true,
  },
  [ErrorType.INVALID_XML]: {
    title: '잘못된 XML 형식',
    message: 'OpenDRIVE 파일의 XML 형식이 올바르지 않습니다.',
    suggestion: 'XML 문법을 확인하고, 유효한 OpenDRIVE 파일인지 검증해보세요.',
    recoverable: true,
  },
  [ErrorType.EMPTY_FILE]: {
    title: '빈 파일',
    message: '파일이 비어있거나 내용이 없습니다.',
    suggestion: '올바른 OpenDRIVE 데이터가 포함된 파일을 사용해보세요.',
    recoverable: true,
  },
  [ErrorType.NO_ROADS]: {
    title: '도로 데이터 없음',
    message: 'OpenDRIVE 파일에 도로 정보가 포함되어 있지 않습니다.',
    suggestion: '최소 하나 이상의 도로가 정의된 OpenDRIVE 파일을 사용해보세요.',
    recoverable: true,
  },
  [ErrorType.INVALID_GEOMETRY]: {
    title: '잘못된 지오메트리 데이터',
    message: '도로 지오메트리 데이터에 오류가 있어 시각화할 수 없습니다.',
    suggestion: '지오메트리 좌표와 매개변수가 올바른지 확인해보세요.',
    recoverable: true,
  },
  [ErrorType.MEMORY_LIMIT]: {
    title: '메모리 부족',
    message: '파일이 너무 크거나 복잡하여 메모리가 부족합니다.',
    suggestion: '더 작은 파일을 사용하거나 다른 탭을 닫아 메모리를 확보해보세요.',
    recoverable: true,
  },
  [ErrorType.WEBGL_NOT_SUPPORTED]: {
    title: 'WebGL 지원 안됨',
    message: '브라우저가 WebGL을 지원하지 않아 3D 시각화를 표시할 수 없습니다.',
    suggestion: '최신 브라우저를 사용하거나 하드웨어 가속을 활성화해보세요.',
    recoverable: false,
  },
  [ErrorType.NETWORK_ERROR]: {
    title: '네트워크 오류',
    message: '파일을 다운로드하는 중 네트워크 오류가 발생했습니다.',
    suggestion: '인터넷 연결을 확인하고 잠시 후 다시 시도해보세요.',
    recoverable: true,
  },
  [ErrorType.PARSING_ERROR]: {
    title: '파싱 오류',
    message: 'OpenDRIVE 파일을 분석하는 중 오류가 발생했습니다.',
    suggestion: '파일 형식이 올바른지 확인하고 다른 파일을 시도해보세요.',
    recoverable: true,
  },
  [ErrorType.CALCULATION_ERROR]: {
    title: '계산 오류',
    message: '지오메트리 또는 차선 경계 계산 중 오류가 발생했습니다.',
    suggestion: '데이터의 수치적 정확성을 확인하고 다른 파일을 시도해보세요.',
    recoverable: true,
  },
  [ErrorType.UNKNOWN_ERROR]: {
    title: '알 수 없는 오류',
    message: '예상치 못한 오류가 발생했습니다.',
    suggestion: '페이지를 새로고침하거나 브라우저를 다시 시작해보세요.',
    recoverable: true,
  },
};

export function detectErrorType(error: Error): ErrorType {
  const message = error.message.toLowerCase();
  const stack = error.stack?.toLowerCase() || '';
  const fullText = `${message} ${stack}`;

  // 파일 관련 오류
  if (message.includes('404') || message.includes('not found') || fullText.includes('fetch')) {
    return ErrorType.FILE_NOT_FOUND;
  }

  // 지오메트리 오류 (XML 오류보다 먼저 확인)
  if (
    message.includes('geometry') ||
    message.includes('coordinate') ||
    message.includes('지오메트리')
  ) {
    return ErrorType.INVALID_GEOMETRY;
  }

  // XML 파싱 오류
  if (message.includes('xml') || message.includes('parse') || message.includes('invalid')) {
    return ErrorType.INVALID_XML;
  }

  // 빈 파일 오류
  if (message.includes('empty') || message.includes('빈') || message.includes('비어')) {
    return ErrorType.EMPTY_FILE;
  }

  // 도로 데이터 없음
  if (message.includes('no road') || message.includes('도로') || message.includes('road')) {
    return ErrorType.NO_ROADS;
  }

  // 지오메트리 오류
  if (
    message.includes('geometry') ||
    message.includes('coordinate') ||
    message.includes('지오메트리')
  ) {
    return ErrorType.INVALID_GEOMETRY;
  }

  // 메모리 오류
  if (message.includes('memory') || message.includes('allocation') || fullText.includes('heap')) {
    return ErrorType.MEMORY_LIMIT;
  }

  // WebGL 오류
  if (message.includes('webgl') || message.includes('context') || fullText.includes('three')) {
    return ErrorType.WEBGL_NOT_SUPPORTED;
  }

  // 네트워크 오류
  if (message.includes('network') || message.includes('fetch') || message.includes('request')) {
    return ErrorType.NETWORK_ERROR;
  }

  // 계산 오류
  if (message.includes('calculation') || message.includes('boundary') || message.includes('계산')) {
    return ErrorType.CALCULATION_ERROR;
  }

  return ErrorType.UNKNOWN_ERROR;
}

//Error 객체를 사용자 친화적 오류로 변환
export function createUserFriendlyError(error: Error): UserFriendlyError {
  const errorType = detectErrorType(error);
  const baseError = ERROR_MESSAGES[errorType];

  return {
    type: errorType,
    ...baseError,
    technicalDetails: `${error.message}\n\n${error.stack || '스택 트레이스 없음'}`,
  };
}

//OpenDRIVE 데이터의 유효성 검증
export function validateOpenDriveData(data: unknown): {
  isValid: boolean;
  errors: UserFriendlyError[];
  warnings: string[];
} {
  const errors: UserFriendlyError[] = [];
  const warnings: string[] = [];

  try {
    // 기본 타입 검증
    if (!data || typeof data !== 'object') {
      errors.push({
        type: ErrorType.INVALID_XML,
        ...ERROR_MESSAGES[ErrorType.INVALID_XML],
        technicalDetails: 'Data is not an object',
      });
      return { isValid: false, errors, warnings };
    }

    const openDriveData = data as OpenDriveData;

    // 헤더 검증
    if (!openDriveData.header) {
      errors.push({
        type: ErrorType.INVALID_XML,
        ...ERROR_MESSAGES[ErrorType.INVALID_XML],
        technicalDetails: 'Missing header information',
      });
    }

    // 도로 배열 검증
    if (!Array.isArray(openDriveData.road) || openDriveData.road.length === 0) {
      errors.push({
        type: ErrorType.NO_ROADS,
        ...ERROR_MESSAGES[ErrorType.NO_ROADS],
        technicalDetails: 'No roads found in the data',
      });
      return { isValid: false, errors, warnings };
    }

    // 각 도로 검증
    for (let i = 0; i < openDriveData.road.length; i++) {
      const road = openDriveData.road[i];
      const roadErrors = validateRoad(road, i);
      errors.push(...roadErrors.errors);
      warnings.push(...roadErrors.warnings);
    }

    // 파일 크기 경고
    const estimatedSize = JSON.stringify(data).length;
    if (estimatedSize > 1 * 1024 * 1024) {
      // 1MB (테스트를 위해 낮춤)
      warnings.push('파일이 매우 큽니다. 렌더링 성능이 저하될 수 있습니다.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  } catch (validationError) {
    errors.push({
      type: ErrorType.UNKNOWN_ERROR,
      ...ERROR_MESSAGES[ErrorType.UNKNOWN_ERROR],
      technicalDetails:
        validationError instanceof Error ? validationError.message : 'Unknown validation error',
    });

    return { isValid: false, errors, warnings };
  }
}

//개별 도로 데이터를 검증
function validateRoad(
  road: Road,
  index: number,
): {
  errors: UserFriendlyError[];
  warnings: string[];
} {
  const errors: UserFriendlyError[] = [];
  const warnings: string[] = [];

  try {
    // 기본 속성 검증
    if (!road.id || typeof road.id !== 'string') {
      errors.push({
        type: ErrorType.INVALID_XML,
        ...ERROR_MESSAGES[ErrorType.INVALID_XML],
        technicalDetails: `Road ${index}: Invalid or missing ID`,
      });
    }

    if (typeof road.length !== 'number' || road.length <= 0) {
      errors.push({
        type: ErrorType.INVALID_GEOMETRY,
        ...ERROR_MESSAGES[ErrorType.INVALID_GEOMETRY],
        technicalDetails: `Road ${road.id}: Invalid length`,
      });
    }

    // 지오메트리 검증
    if (!road.planView?.geometry || !Array.isArray(road.planView.geometry)) {
      errors.push({
        type: ErrorType.INVALID_GEOMETRY,
        ...ERROR_MESSAGES[ErrorType.INVALID_GEOMETRY],
        technicalDetails: `Road ${road.id}: Missing geometry data`,
      });
    } else {
      const geometryErrors = validateGeometries(road.planView.geometry, road.id);
      errors.push(...geometryErrors.errors);
      warnings.push(...geometryErrors.warnings);
    }

    // 차선 섹션 검증
    if (!road.lanes?.laneSection || !Array.isArray(road.lanes.laneSection)) {
      warnings.push(`도로 ${road.id}: 차선 정보가 없습니다.`);
    } else {
      const laneErrors = validateLaneSections(road.lanes.laneSection, road.id);
      errors.push(...laneErrors.errors);
      warnings.push(...laneErrors.warnings);
    }

    return { errors, warnings };
  } catch (roadError) {
    errors.push({
      type: ErrorType.UNKNOWN_ERROR,
      ...ERROR_MESSAGES[ErrorType.UNKNOWN_ERROR],
      technicalDetails: `Road ${index} validation error: ${roadError instanceof Error ? roadError.message : 'Unknown error'}`,
    });

    return { errors, warnings };
  }
}

// 지오메트리 배열을 검증
function validateGeometries(
  geometries: OpenDriveGeometry[],
  roadId: string,
): {
  errors: UserFriendlyError[];
  warnings: string[];
} {
  const errors: UserFriendlyError[] = [];
  const warnings: string[] = [];

  for (let i = 0; i < geometries.length; i++) {
    const geometry = geometries[i];

    // 필수 속성 검증
    const requiredNumbers = ['s', 'x', 'y', 'hdg', 'length'];
    for (const prop of requiredNumbers) {
      const value = geometry[prop as keyof OpenDriveGeometry];
      if (typeof value !== 'number' || !isFinite(value)) {
        errors.push({
          type: ErrorType.INVALID_GEOMETRY,
          ...ERROR_MESSAGES[ErrorType.INVALID_GEOMETRY],
          technicalDetails: `Road ${roadId}, Geometry ${i}: Invalid ${prop} value`,
        });
      }
    }

    // 타입별 검증
    if (
      geometry.type === 'arc' &&
      (typeof geometry.curvature !== 'number' || geometry.curvature === 0)
    ) {
      errors.push({
        type: ErrorType.INVALID_GEOMETRY,
        ...ERROR_MESSAGES[ErrorType.INVALID_GEOMETRY],
        technicalDetails: `Road ${roadId}, Geometry ${i}: Invalid arc curvature`,
      });
    }

    if (geometry.type === 'spiral') {
      if (typeof geometry.curvStart !== 'number' || typeof geometry.curvEnd !== 'number') {
        errors.push({
          type: ErrorType.INVALID_GEOMETRY,
          ...ERROR_MESSAGES[ErrorType.INVALID_GEOMETRY],
          technicalDetails: `Road ${roadId}, Geometry ${i}: Invalid spiral curvature values`,
        });
      }
    }

    // 연속성 검증
    if (i < geometries.length - 1) {
      const nextGeometry = geometries[i + 1];
      const expectedNextS = geometry.s + geometry.length;
      const actualNextS = nextGeometry.s;

      if (Math.abs(expectedNextS - actualNextS) > 0.01) {
        warnings.push(`도로 ${roadId}: 지오메트리 ${i}와 ${i + 1} 사이에 불연속성이 있습니다.`);
      }
    }
  }

  return { errors, warnings };
}

//차선 섹션 배열 검증
function validateLaneSections(
  laneSections: LaneSection[],
  roadId: string,
): {
  errors: UserFriendlyError[];
  warnings: string[];
} {
  const errors: UserFriendlyError[] = [];
  const warnings: string[] = [];

  for (let i = 0; i < laneSections.length; i++) {
    const section = laneSections[i];

    // s 좌표 검증
    if (typeof section.s !== 'number' || !isFinite(section.s)) {
      errors.push({
        type: ErrorType.INVALID_GEOMETRY,
        ...ERROR_MESSAGES[ErrorType.INVALID_GEOMETRY],
        technicalDetails: `Road ${roadId}, Lane Section ${i}: Invalid s coordinate`,
      });
    }

    // 차선 그룹 검증
    const hasLanes =
      (section.left && section.left.length > 0) ||
      (section.center && section.center.length > 0) ||
      (section.right && section.right.length > 0);

    if (!hasLanes) {
      warnings.push(`도로 ${roadId}, 차선 섹션 ${i}: 차선이 정의되지 않았습니다.`);
    }
  }

  return { errors, warnings };
}

//WebGL 지원 여부 확인
export function checkWebGLSupport(): {
  supported: boolean;
  error?: UserFriendlyError;
} {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) {
      return {
        supported: false,
        error: {
          type: ErrorType.WEBGL_NOT_SUPPORTED,
          ...ERROR_MESSAGES[ErrorType.WEBGL_NOT_SUPPORTED],
          technicalDetails: 'WebGL context could not be created',
        },
      };
    }

    return { supported: true };
  } catch (error) {
    return {
      supported: false,
      error: {
        type: ErrorType.WEBGL_NOT_SUPPORTED,
        ...ERROR_MESSAGES[ErrorType.WEBGL_NOT_SUPPORTED],
        technicalDetails: error instanceof Error ? error.message : 'WebGL check failed',
      },
    };
  }
}

//메모리 사용량을 추정
export function estimateMemoryUsage(data: OpenDriveData): {
  estimatedMB: number;
  warning?: string;
} {
  try {
    // 데이터 크기 추정
    const jsonSize = JSON.stringify(data).length;
    const estimatedMB = jsonSize / (1024 * 1024);

    // 도로 및 지오메트리 복잡도 고려
    const totalGeometries = data.road.reduce(
      (sum, road) => sum + (road.planView?.geometry?.length || 0),
      0,
    );

    // 복잡도에 따른 메모리 사용량 증가 추정
    const complexityMultiplier = 1 + (totalGeometries / 1000) * 0.5;
    const finalEstimate = estimatedMB * complexityMultiplier;

    let warning: string | undefined;
    if (finalEstimate > 50) {
      warning = '메모리 사용량이 매우 높을 것으로 예상됩니다. 성능 문제가 발생할 수 있습니다.';
    } else if (finalEstimate > 20) {
      warning = '메모리 사용량이 높을 것으로 예상됩니다. 렌더링 성능이 저하될 수 있습니다.';
    }

    return {
      estimatedMB: finalEstimate,
      warning,
    };
  } catch {
    return {
      estimatedMB: 0,
      warning: '메모리 사용량을 추정할 수 없습니다.',
    };
  }
}

export async function safeAsyncOperation<T>(
  operation: () => Promise<T>,
  errorContext: string,
): Promise<{ success: true; data: T } | { success: false; error: UserFriendlyError }> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    const userFriendlyError = createUserFriendlyError(
      error instanceof Error ? error : new Error(`${errorContext}: Unknown error`),
    );

    return { success: false, error: userFriendlyError };
  }
}

export default {
  ErrorType,
  detectErrorType,
  createUserFriendlyError,
  validateOpenDriveData,
  checkWebGLSupport,
  estimateMemoryUsage,
  safeAsyncOperation,
};
