import { Button } from 'react-bootstrap';

export default function PlayerWelcomeComponent({ username, onLogout }) {

  return (
    <div className="d-flex justify-content-center align-items-center">
      <span className="text-muted">Welcome back <strong className="font-monospace">{ username }</strong>!</span>
      <Button variant="link" onClick={onLogout}>Logout</Button>
    </div>
  );
}
