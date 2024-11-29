
import { Duck } from './demo';

interface Props {
  duck: Duck;
}

export default function DuckItem({ duck }: Props) {
  return (
    <div key={duck.name}>
      {duck.name}
      <button onClick={() => duck.makeSound('quack')}>Make Sound</button>
    </div>
  );
}
