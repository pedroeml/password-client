import { Button } from 'react-bootstrap';

export default function PlayerRegisterComponent({ username, onAccept, onDecline }) {

  return (
    <div className="d-flex justify-content-center align-items-center">
      <span className="text-muted">User <strong className="font-monospace">{ username }</strong> not found. Do you want to register?</span>
      <Button variant="link" onClick={onAccept}>Yes</Button>
      <Button variant="link" onClick={onDecline}>No</Button>
    </div>
  );
}
