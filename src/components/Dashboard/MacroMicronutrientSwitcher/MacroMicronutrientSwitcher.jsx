import { useState } from 'react';
import MacroCard from './MacroCard';
import MicronutrientsCard from './MicronutrientsCard';
import './MacroMicronutrientSwitcher.css';

const MacroMicronutrientSwitcher = ({ macros, micros }) => {
  const [mostrarMicros, setMostrarMicros] = useState(false);

  return (
    <div
      className="card-container"
      onClick={() => setMostrarMicros((prev) => !prev)}
      style={{ cursor: 'pointer' }}
    >
      <div className={`card macro ${mostrarMicros ? 'back' : 'front'}`}>
        <MacroCard data={macros} />
      </div>
      <div className={`card micro ${mostrarMicros ? 'front' : 'back'}`}>
        <MicronutrientsCard data={micros} />
      </div>
    </div>
  );
};

export default MacroMicronutrientSwitcher;
