import * as S from './ReportListItem.styles';

interface ReportListItemProps {
  date: string;
  location: string;
  type: string;
  status: string;
}

export default function ReportListItem({ date, location, type, status }: ReportListItemProps) {
  return (
    <S.ReportItem>
      <S.ReportRow>
        <S.ReportLabel>신고일시</S.ReportLabel>
        <S.ReportValue>{date}</S.ReportValue>
      </S.ReportRow>
      <S.ReportRow>
        <S.ReportLabel>신고위치</S.ReportLabel>
        <S.ReportValue>{location}</S.ReportValue>
      </S.ReportRow>
      <S.ReportRow>
        <S.ReportLabel>신고처리</S.ReportLabel>
        <S.ReportValue>{type}</S.ReportValue>
      </S.ReportRow>
      <S.ReportRow>
        <S.ReportLabel>가족알림</S.ReportLabel>
        <S.ReportValue>{status}</S.ReportValue>
      </S.ReportRow>
    </S.ReportItem>
  );
}