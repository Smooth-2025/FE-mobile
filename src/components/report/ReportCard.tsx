import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import reportInbox from '@/assets/images/report-inbox.png';
import * as Styled from './ReportCard.styles';

type ReportStatus = 'processing' | 'ready' | 'read';

export default function ReportCard() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<ReportStatus>('ready');

  return (
    <Styled.ReportCardContainer
      $status={status}
      onClick={() => {
        setStatus('read');
        navigate('/report/detail');
      }}
    >
      {status === 'ready' && <Styled.NotificationBadge />}
      <Styled.ReportIcon src={reportInbox} alt="리포트 이미지" />
      <Styled.ReportTextBox>
        {status === 'processing' ? (
          <>
            <Styled.ReportTitle>리포트 생성 중...</Styled.ReportTitle>
            <Styled.ReportSub>잠시만 기다려 주세요</Styled.ReportSub>
          </>
        ) : (
          <>
            <Styled.ReportTitle>15회 주행완료! 🎉</Styled.ReportTitle>
            <Styled.ReportSub> 주행 리포트가 도착했어요</Styled.ReportSub>
          </>
        )}
      </Styled.ReportTextBox>
    </Styled.ReportCardContainer>
  );
}
