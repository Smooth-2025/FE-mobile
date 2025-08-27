export default function SimulationGround() {
  return (
    <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial color="#2a2a2a" toneMapped={false} />
    </mesh>
  );
}
