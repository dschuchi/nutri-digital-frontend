import { useState } from 'react';
import MacroCard from './MacroCard';
import MicronutrientsCard from './MicronutrientsCard';
import './MacroMicronutrientSwitcher.css';

const MacroMicronutrientSwitcher = ({ macros, micros }) => {
  const [mostrarMicros, setMostrarMicros] = useState(false);

  return (
    <div
      className="card-switcher-container"
      onClick={() => setMostrarMicros((prev) => !prev)}
      style={{ cursor: 'pointer' }}
    >
      <div className={`switch-card ${!mostrarMicros ? 'visible' : 'hidden'}`}>
        <MacroCard data={macros} />
      </div>
      <div className={`switch-card ${mostrarMicros ? 'visible' : 'hidden'}`}>
        <MicronutrientsCard data={micros} />
      </div>
    </div>
  );
};

export default MacroMicronutrientSwitcher;
