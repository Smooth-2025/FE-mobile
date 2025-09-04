import styled from '@emotion/styled';
// import AccidentResponse from '@/components/report/AccidentResponse';
// import DrivingBehavior from '@/components/report/DrivingBehavior';
// import DrivingDNA from '@/components/report/DrivingDNA';
import DrivingSummary from '@/components/report/DrivingSummary';
import Header from '@/layout/Header';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export default function ReportDetailPage() {
  return (
    <>
      <Header type="close" onLeftClick={() => {}} />
      <Container>
        <DrivingSummary />
        {/* <DrivingBehavior />
        <AccidentResponse />
        <DrivingDNA /> */}
      </Container>
    </>
  );
}
