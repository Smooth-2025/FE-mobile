import styled from '@emotion/styled';
import { useState } from 'react';

const Box = styled.div`
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.primary500};
  color: white;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize[36]};
`;

function App() {
  const [count, setCount] = useState(0);

  return (
    <Box>
      <Title>Emotion 스타일 테스트</Title>
      <button onClick={() => setCount(count + 1)}>count is {count}</button>
    </Box>
  );
}

export default App;
