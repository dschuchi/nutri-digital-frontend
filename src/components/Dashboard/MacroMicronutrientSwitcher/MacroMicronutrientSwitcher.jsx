import { useState } from 'react';
import MacroCard from './MacroCard';
import MicronutrientsCard from './MicronutrientsCard';
import { SwapOutlined } from '@ant-design/icons';
import './MacroMicronutrientSwitcher.css';

const MacroMicronutrientSwitcher = ({ macros, micros }) => {
  const [mostrarMicros, setMostrarMicros] = useState(false);

  const handleSwitch = () => {
    setMostrarMicros((prev) => !prev);
  };

  return (
    <div
      className="card-switcher-container"
      onClick={handleSwitch}
    >
      <div className="switch-icon">
        <SwapOutlined />
      </div>

      {mostrarMicros ? (
        <MicronutrientsCard data={micros} />
      ) : (
        <MacroCard data={macros} />
      )}
    </div>
  );
};

export default MacroMicronutrientSwitcher;
