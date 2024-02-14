import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";

// This component used by pages/LoadingsPage, cards/LoadingCard and cards/TransactionCard
const LoadingModal = () => {
  const { isLoading: showMe } = useSelector(state => state.loadingReducer);

  if (!showMe) return null;

  return (
    <Modal show={showMe} className="d-flex justify-content-center align-items-center">
      <Modal.Header >
        <Modal.Title style={{ height: "16px", fontSize: "16px" }}>Please wait</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <img src="/working.gif" alt="working" width="200" height="135"/>
      </Modal.Body>
      {/* <Modal.Footer>
                    <Button variant="secondary" onClick={() => closeMe(false)}>
                        Close
                    </Button>
                </Modal.Footer> */}
    </Modal>
  )
}

export default LoadingModal