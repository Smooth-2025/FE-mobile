import OpenDriveVisualization from './OpenDriveVisualization';
import * as Styled from './DrivingSimulation.styles';

export default function DrivingSimulation() {
  return (
    <Styled.Container>
      <OpenDriveVisualization width="100%" height="100%" />
    </Styled.Container>
  );
}
