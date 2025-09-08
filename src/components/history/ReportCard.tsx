import { useNavigate } from 'react-router-dom';
import reportInbox from '@/assets/images/report-inbox.png';
import { useMarkReportAsReadMutation } from '@/store/driving/drivingApi';
import * as Styled from './ReportCard.styles';
import type { TimelineReportData, TimelineStatus } from '@/store/driving/type';

type PropsType = {
  status: TimelineStatus;
  data?: TimelineReportData | null;
};

export default function ReportCard(props: PropsType) {
  const navigate = useNavigate();
  const [markReportAsRead] = useMarkReportAsReadMutation();

  if (props.status === 'PROCESSING') {
    return (
      <Styled.ReportCardContainer $status={'PROCESSING'}>
        <Styled.ProcessingIndicator>
          <span />
        </Styled.ProcessingIndicator>
        <Styled.ReportTextBox>
          <Styled.ProcessingText>운전 습관을 분석하고 있어요.</Styled.ProcessingText>
        </Styled.ReportTextBox>
      </Styled.ReportCardContainer>
    );
  }
  if (!props.data) return;
  const { data } = props;

  const handleOpen = async () => {
    if (data?.id !== null && !data.isRead) {
      markReportAsRead(data.id);
    }
    navigate(`/report/${data.id}`);
  };

  return (
    <Styled.ReportCardContainer $status={'COMPLETED'} onClick={handleOpen}>
      {!data?.isRead && <Styled.NotificationBadge />}
      <Styled.ReportIcon src={reportInbox} alt="리포트 이미지" />
      <Styled.ReportTextBox>
        <>
          <Styled.ReportTitle>운전 분석 결과 확인하기</Styled.ReportTitle>
          <Styled.ReportSub> 주행 리포트를 확인해보세요!</Styled.ReportSub>
        </>
      </Styled.ReportTextBox>
    </Styled.ReportCardContainer>
  );
}
