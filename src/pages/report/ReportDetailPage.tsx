import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import AccidentResponse from '@/components/report/AccidentResponse';
import DrivingBehavior from '@/components/report/DrivingBehavior';
// import DrivingDNA from '@/components/report/DrivingDNA';
import DrivingSummary from '@/components/report/DrivingSummary';
import Header from '@/layout/Header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export default function ReportDetailPage() {
  const { reportId } = useParams<{ reportId: string }>();
  const id = Number(reportId);
  return (
    <>
      <Header type="close" onLeftClick={() => {}} title="주행 리포트" />
      <Container>
        <DrivingSummary reportId={id} />
        <DrivingBehavior reportId={id} />
        <AccidentResponse reportId={id} />
        {/* 
        <DrivingDNA /> */}
      </Container>
    </>
  );
}
