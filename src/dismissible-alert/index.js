import { Alert } from 'react-bootstrap';
import './index.css';

export default function DismissibleAlert({ message, onClose }) {
  return <Alert className="col-11 col-sm-9 col-md-7 col-lg-5 col-xl-4" variant="danger" onClose={onClose} dismissible>{ message }</Alert>
}
