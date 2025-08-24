import * as styled from '@components/report/StampBoard.styles';
import drivingCharacter from '@/assets/images/driving-charactar.png';
import stampImg from '@/assets/images/stamp.png';

export default function StampBoard() {
  const stampTotal = 15;
  const count = 1;

  return (
    <styled.Wrapper>
      <styled.TopSection>
        <styled.TitleBox>
          <styled.Badge>NEW</styled.Badge>
          <styled.Title>
            주행 15회를 달성하면 <br />
            나만의 리포트가 생성됩니다! 🎉
          </styled.Title>
        </styled.TitleBox>
        <styled.Character src={drivingCharacter} alt=" 캐릭터"></styled.Character>
      </styled.TopSection>
      <styled.BottomSection>
        <styled.StatusHeader>
          <p>MY 주행 현황</p>
          <p>
            <span>{count}</span>/15회
          </p>
        </styled.StatusHeader>
        <styled.StampGrid>
          {Array.from({ length: stampTotal }, (_, i) => i + 1).map((n) => {
            const filled = n <= count;
            return (
              <styled.StampCell key={n} filled={filled} aria-label={`stamp-${n}`}>
                {filled ? <img src={stampImg} alt={`${n}회 스탬프`} /> : n}
              </styled.StampCell>
            );
          })}
        </styled.StampGrid>
      </styled.BottomSection>
    </styled.Wrapper>
  );
}
