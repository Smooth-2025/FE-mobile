import drivingProgress from '@/assets/images/driving-progress.png';
import drivingCharactarEmpty from '@/assets/images/driving-charactarEmpty.png';
import lion from '@/assets/images/charactars/lion.png';
import dolphin from '@/assets/images/charactars/dolphin.png';
import cat from '@/assets/images/charactars/cat.png';
import meerkat from '@/assets/images/charactars/meerkat.png';
import * as styled from '@/components/drive/DriveCharacterResultCard.styles';

export default function DriveCharacterResultCard() {
  const personaStyle = '안전 운전형';
  const personaName = '돌고래';
  const remain = 10;
  const totalKm = 100;
  const currentKm = Math.max(0, Math.min(totalKm, totalKm - remain));
  const percent = (currentKm / totalKm) * 100;

  const minLabel = '0km';
  const maxLabel = `${totalKm}km`;

  const characterImages: Record<string, string> = {
    사자: lion,
    돌고래: dolphin,
    고양이: cat,
    미어캣: meerkat,
  };

  const characterImage = characterImages[personaName] ?? drivingCharactarEmpty;

  return (
    <styled.CharacterCardWrapper>
      <styled.Header>
        <styled.Subtitle>100km 주행 분석 결과</styled.Subtitle>
        <styled.Title>
          당신의 운전 성향은
          <strong>
            [{personaStyle}] {personaName}
          </strong>
          입니다.
        </styled.Title>
      </styled.Header>
      <styled.Character src={characterImage} alt={`${personaName} 캐릭터`} />
      <styled.Description>
        속도와 판단력으로 흐름을 지배하는 리더형 운전자에요. 과격하진 않지만 단호한 주행 스타일로
        주변을 압도합니다.항상 먼저 움직이며 도로 위 중심이 되는 타입입니다.
      </styled.Description>

      <styled.ProgressSection>
        <styled.ProgressText>
          다음 운전 성향 리포트까지 <styled.Highlight>{remain}km</styled.Highlight> 남았어요!
        </styled.ProgressText>

        <styled.ProgressTrack>
          <styled.ProgressMarker style={{ left: `${percent}%` }}>
            <styled.ProgressIcon src={drivingProgress} alt="car-progress" />
            <styled.ProgressKm>{currentKm}km</styled.ProgressKm>
          </styled.ProgressMarker>

          <styled.ProgressBar>
            <styled.ProgressFill percent={percent} />
          </styled.ProgressBar>
        </styled.ProgressTrack>
        <styled.ProgressScale>
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </styled.ProgressScale>
      </styled.ProgressSection>
    </styled.CharacterCardWrapper>
  );
}
