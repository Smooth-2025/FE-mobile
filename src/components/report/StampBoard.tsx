import * as styled from '@components/report/StampBoard.styles';
import reportCharacter from '@/assets/images/report-charactar.png';
import stampImg from '@/assets/images/stamp.png';
import { useGetDrivingProgressQuery } from '@/store/report/reportApi';

export default function StampBoard() {
  const { data, isLoading, isError } = useGetDrivingProgressQuery();
  const stampTotal = data?.threshold ?? 15;
  const count = data?.currentCycleCount ?? 0;

  if (isLoading) {
    return <>isLoading...</>;
  }

  if (isError) {
    return;
  }

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
        <styled.Character src={reportCharacter} alt=" 캐릭터"></styled.Character>
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
