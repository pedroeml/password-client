import { Alert } from 'react-bootstrap';
import './index.css';

export default function DismissibleAlert({ message, onClose }) {
  return <Alert className="col-5" variant="danger" onClose={onClose} dismissible>{ message }</Alert>
}
