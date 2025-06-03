import ResumenProgreso from './ResumenProgreso';

export default function PatientReportContent({ paciente, date }) {
  if (!paciente) return null;

  return (
    <div style={{ marginTop: 24 }}>
      <ResumenProgreso paciente={paciente} date={date} />
    </div>
  );
}
