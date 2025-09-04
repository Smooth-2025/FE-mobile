import startIcon from '@/assets/images/dna/start.png';
import speedIcon from '@/assets/images/dna/speed.png';
import brakeIcon from '@/assets/images/dna/brake.png';
import laneIcon from '@/assets/images/dna/lane.png';
import * as Styled from '@/components/report/DrivingDNA.styles';
import RadarChart from './charts/RadarChart';

type DNAListType = {
  id: string;
  title: string;
  code: string;
  description: string;
  icon: string;
};

const CATEGORIES = ['출발성향(A)', '감속성향(B)', '차선성향(C)', '대응 성향(D)'];

export default function DrivingDNA() {
  const DNAList: DNAListType[] = [
    {
      id: 'start',
      title: '출발 성향',
      code: 'A2',
      description: '무리하지 않고 적절한 속도로 출발하는 안정적인 스타일입니다.',
      icon: startIcon,
    },
    {
      id: 'speed',
      title: '속도 유지',
      code: 'B1',
      description: '규정 속도를 잘 지키며 일관되게 운전하는 스타일입니다.',
      icon: speedIcon,
    },
    {
      id: 'brake',
      title: '제동 성향',
      code: 'C3',
      description: '급제동을 피하고 미리 감속하는 안전 위주의 스타일입니다.',
      icon: brakeIcon,
    },
    {
      id: 'lane',
      title: '차선 변경',
      code: 'D1',
      description: '불필요한 차선 변경을 줄이고 안정적으로 차선을 유지합니다.',
      icon: laneIcon,
    },
  ];

  const series = [
    {
      name: '내 주행',
      data: [100, 55, 72, 60],
    },
  ];

  return (
    <Styled.Section>
      <Styled.SectionTitle>운전 성향 DNA</Styled.SectionTitle>
      {/* == 주행 차트 ==  */}
      <div>
        <Styled.DNATitle>
          DNA 분석결과&nbsp;
          <b>
            "A2-B1-C3-D4"
            <br />
            적극적이면서 빠른 반응형 운전자
          </b>
          예요!
        </Styled.DNATitle>
        <RadarChart categories={CATEGORIES} series={series} />
        <Styled.DNAListBox>
          {DNAList.map((style) => (
            <Styled.DNACard key={style.id}>
              <Styled.Icon src={style.icon} alt={style.title} />
              <Styled.Content>
                <Styled.Title>
                  {style.title} ({style.code})
                </Styled.Title>
                <Styled.Description>{style.description}</Styled.Description>
              </Styled.Content>
            </Styled.DNACard>
          ))}
        </Styled.DNAListBox>
      </div>
    </Styled.Section>
  );
}
