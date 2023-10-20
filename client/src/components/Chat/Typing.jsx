import { } from 'react';
import { SyncLoader } from 'react-spinners';

function Typing() {
    return <div style={{ height: "fit-content", width: "fit-content", padding: "3px" }}><span><SyncLoader size={12} color='white' /></span></div>
}

export default Typing;
