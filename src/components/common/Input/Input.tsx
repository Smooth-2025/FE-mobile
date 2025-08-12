import { useId } from 'react';
import * as Styled from './Input.styles';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** RN에서 value/onChangeText 사용 → 웹에선 value/onChange 사용 */
  value?: string;
}

export function Input(props: InputProps) {
  const { label, id, value, onChange, ...restProps } = props;
  const autoId = useId();
  const inputId = id ?? `input-${autoId}`;

  return (
    <Styled.Wrapper>
      {label && <Styled.StyledLabel htmlFor={inputId}>{label}</Styled.StyledLabel>}
      <Styled.StyledInput id={inputId} value={value} onChange={onChange} {...restProps} />
    </Styled.Wrapper>
  );
}
