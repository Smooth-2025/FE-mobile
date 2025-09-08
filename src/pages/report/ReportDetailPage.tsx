import styled from '@emotion/styled';
import { useNavigate, useParams } from 'react-router-dom';
import AccidentResponse from '@/components/report/AccidentResponse';
import DrivingBehavior from '@/components/report/DrivingBehavior';
import DrivingDNA from '@/components/report/DrivingDNA';
import DrivingSummary from '@/components/report/DrivingSummary';
import Header from '@/layout/Header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 30px;
`;

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const reportId = Number(id);
  const navigate = useNavigate();

  return (
    <>
      <Header type="close" onLeftClick={() => navigate(-1)} title="주행 리포트" />
      <Container>
        <DrivingSummary reportId={reportId} />
        <DrivingBehavior reportId={reportId} />
        <AccidentResponse reportId={reportId} />
        <DrivingDNA reportId={reportId} />
      </Container>
    </>
  );
}
