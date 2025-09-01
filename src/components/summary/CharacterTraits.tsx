import drivingProgress from '@/assets/images/driving-progress.png';
import emptyImg from '@/assets/images/characters/empty.png';
import lionImg from '@/assets/images/characters/lion.png';
import dolphinImg from '@/assets/images/characters/dolphin.png';
import catImg from '@/assets/images/characters/cat.png';
import meerkatImg from '@/assets/images/characters/meerkat.png';
import * as styled from '@/components/summary/CharacterTraits.styles';
import { useGetCharacterTraitsQuery } from '@/store/driving/drivingApi';
import { Skeleton } from '@/components/common/Skeleton';
import type { CharacterType } from '@/store/driving/type';

const characterImages: Record<CharacterType, string> = {
  LION: lionImg,
  DOLPHIN: dolphinImg,
  CAT: catImg,
  MEERKAT: meerkatImg,
  NONE: emptyImg,
};

const MIN_KM = 0;
const MAX_KM = 100;

function Placeholder() {
  return (
    <styled.P_Container>
      <styled.P_TitleBox>
        <Skeleton width={40} unit="%" height={100} rounded />
        <Skeleton width={60} unit="%" height={100} rounded />
      </styled.P_TitleBox>
      <styled.P_ImageWrapper>
        <Skeleton width={100} unit="%" height={100} rounded />
      </styled.P_ImageWrapper>
      <styled.P_DescriptionBox>
        <Skeleton width={60} unit="%" height={50} rounded />
        <Skeleton width={80} unit="%" height={50} rounded />
      </styled.P_DescriptionBox>
      <styled.P_ProgressBox>
        <Skeleton width={70} unit="%" height={20} rounded />
        <Skeleton width={10} unit="%" height={20} rounded />
        <Skeleton width={100} unit="%" height={10} rounded />
        <styled.P_ScaleBox>
          <Skeleton width={10} unit="%" height={100} rounded />
          <Skeleton width={10} unit="%" height={100} rounded />
        </styled.P_ScaleBox>
      </styled.P_ProgressBox>
      <Skeleton rounded />
    </styled.P_Container>
  );
}

export default function CharacterTraits() {
  const { data, isLoading, isError } = useGetCharacterTraitsQuery();

  if (isLoading) {
    return <Placeholder />;
  }

  if (isError) {
    return;
  }

  const characterImage = characterImages[data?.characterType ?? 'NONE'];

  return (
    <styled.CharacterTraitsContainer>
      <styled.Header>
        <styled.Subtitle>100km 주행 분석 결과</styled.Subtitle>
        <styled.Title>
          당신의 운전 성향은 &nbsp;
          <strong>
            [{data?.characterTrait}] {data?.characterType}
          </strong>
          입니다.
        </styled.Title>
      </styled.Header>
      <styled.Character src={characterImage} alt={`${data?.characterType} 캐릭터`} />
      <styled.Description>{data?.description}</styled.Description>

      <styled.ProgressSection>
        <styled.ProgressText>
          다음 운전 성향 리포트까지 &nbsp;
          <styled.Highlight>{data?.remainingDistance ?? 0}km</styled.Highlight> 남았어요!
        </styled.ProgressText>

        <styled.ProgressTrack>
          <styled.ProgressMarker style={{ left: `${data?.currentDistance ?? 0}%` }}>
            <styled.ProgressIcon src={drivingProgress} alt="car-progress" />
            <styled.ProgressKm>{data?.currentDistance ?? 0}km</styled.ProgressKm>
          </styled.ProgressMarker>
          <styled.ProgressBar>
            <styled.ProgressFill percent={data?.currentDistance ?? 0} />
          </styled.ProgressBar>
        </styled.ProgressTrack>

        <styled.ProgressScale>
          <span>{MIN_KM}km</span>
          <span>{MAX_KM}km</span>
        </styled.ProgressScale>
      </styled.ProgressSection>
    </styled.CharacterTraitsContainer>
  );
}
