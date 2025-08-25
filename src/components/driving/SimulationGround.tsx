export default function SimulationGround() {
  return (
    <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[200, 500]} />
      <meshStandardMaterial color="#2a2a2a" />
    </mesh>
  );
}
