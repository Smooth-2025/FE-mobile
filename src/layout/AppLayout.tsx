import styled from '@emotion/styled';
import { Outlet, Link } from 'react-router-dom';

const Shell = styled.div`
  padding: 16px 24px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary600};
  }
`;
export default function AppLayout() {
  return (
    <Shell>
      <Nav>
        <Link to="/">Home</Link>
        <Link to="/drive">Drive</Link>
        <Link to="/report">Report</Link>
        <Link to="/mypage">MyPage</Link>
      </Nav>
      <Outlet />
    </Shell>
  );
}
