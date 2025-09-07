import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/layout/Header';
import ReportListItem from '@/components/myPage/ReportListItem';
import * as S from '@/components/myPage/ReportListPage.styles';
import { getEmergencyHistory } from '@/apis/emergency';

interface ReportData {
  id: string;
  date: string;
  location: string;
  type: string;
  status: string;
}

export default function ReportListPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleGoBack = () => {
    navigate('/mypage');
  };

  // 가족알림 상태 변환 함수
  const formatFamilyNotification = useCallback((familyNotified: boolean): string => {
    return familyNotified ? '알림 완료' : '-';
  }, []);

  // 날짜 형식 변환 함수 (UTC -> 한국시간)
  const formatDateTime = useCallback((timeString: string): string => {
    try {
      // 백엔드에서 오는 UTC 시간을 Date 객체로 변환
      const utcDate = new Date(timeString);
      
      if (isNaN(utcDate.getTime())) {
        return timeString;
      }
      
      const koreanTime = new Date(utcDate.getTime() + (9 * 60 * 60 * 1000));
      
      const year = koreanTime.getFullYear();
      const month = String(koreanTime.getMonth() + 1).padStart(2, '0');
      const day = String(koreanTime.getDate()).padStart(2, '0');
      const hours = String(koreanTime.getHours()).padStart(2, '0');
      const minutes = String(koreanTime.getMinutes()).padStart(2, '0');
      
      const result = `${year}-${month}-${day} ${hours}:${minutes}`;
      
      return result;
      
    } catch (error) {
      console.error('formatDateTime 에러:', error);
      return timeString;
    }
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getEmergencyHistory();
        
        if (response.success && response.data) {
          const transformedData = response.data.map((item, index) => ({
            id: item.id?.toString() || `report-${index}`,
            date: formatDateTime(item.reportTime),
            location: `${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}`,
            type: '접수 완료',
            status: formatFamilyNotification(item.familyNotified),
          }));
          setReports(transformedData);
        } else {
          setError(response.message || '신고내역을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('신고내역 조회 실패:', err);
        setError('신고내역을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [formatDateTime, formatFamilyNotification]);

  return (
    <S.Container>
      <Header type="back" title="신고내역" onLeftClick={handleGoBack} />

      <S.ContentSection>
        {loading ? (
          <S.LoadingContainer>
            <S.LoadingText>신고내역을 불러오는 중...</S.LoadingText>
          </S.LoadingContainer>
        ) : error ? (
          <S.ErrorContainer>
            <S.ErrorText>{error}</S.ErrorText>
          </S.ErrorContainer>
        ) : reports.length === 0 ? (
          <S.EmptyContainer>
            <S.EmptyText>신고내역이 없습니다.</S.EmptyText>
          </S.EmptyContainer>
        ) : (
          reports.map((report) => (
            <ReportListItem
              key={report.id}
              date={report.date}
              location={report.location}
              type={report.type}
              status={report.status}
            />
          ))
        )}
      </S.ContentSection>
    </S.Container>
  );
}