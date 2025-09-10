import startIcon from '@/assets/images/dna/start.png';
import speedIcon from '@/assets/images/dna/speed.png';
import brakeIcon from '@/assets/images/dna/brake.png';
import laneIcon from '@/assets/images/dna/lane.png';
import * as Styled from '@/components/report/DrivingDNA.styles';
import { useGetDrivingDNAQuery } from '@/store/report/reportApi';
import RadarChart from './charts/RadarChart';
import type { AxisId } from '@/store/report/type';

type DNAListType = {
  id: AxisId;
  title: string;
  icon: string;
};

const CATEGORIES = ['출발성향(A)', '감속성향(B)', '차선성향(C)', '대응 성향(D)'];

const DNAList: DNAListType[] = [
  { id: 'A', title: '출발 성향', icon: startIcon },
  { id: 'B', title: '속도 유지', icon: speedIcon },
  { id: 'C', title: '제동 성향', icon: brakeIcon },
  { id: 'D', title: '차선 변경', icon: laneIcon },
];

export default function DrivingDNA({ reportId }: { reportId: number }) {
  const { data, isLoading, isError } = useGetDrivingDNAQuery({ reportId });

  if (isLoading) return <>isLoading...</>;
  if (isError) {
    return;
  }
  if (!data) return;
  const { headline, radar, axes } = data;

  const series = [radar.A, radar.B, radar.C, radar.D];

  const mergedAxes = axes.map((axis) => {
    const localInfo = DNAList.find((item) => item.id === axis.id);
    return {
      ...axis,
      title: localInfo?.title ?? '',
      icon: localInfo?.icon ?? '',
    };
  });

  return (
    <Styled.Section>
      <Styled.SectionTitle>운전 성향 DNA</Styled.SectionTitle>
      {/* == 주행 차트 ==  */}
      <div>
        <Styled.DNATitle>
          DNA 분석결과 &nbsp;
          <b>
            {axes.map((axis) => axis.label).join('-')}
            <br />
            {headline ?? ''}
          </b>{' '}
        </Styled.DNATitle>
        <RadarChart categories={CATEGORIES} series={series} />
        <Styled.DNAListBox>
          {mergedAxes.map((axis) => (
            <Styled.DNACard key={axis.id}>
              <Styled.Icon src={axis.icon} alt={axis.title} />
              <Styled.Content>
                <Styled.Title>
                  {axis.title} ({axis.label})
                </Styled.Title>
                <Styled.Description>{axis.summary}</Styled.Description>
              </Styled.Content>
            </Styled.DNACard>
          ))}
        </Styled.DNAListBox>
      </div>
    </Styled.Section>
  );
}
