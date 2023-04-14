import { FC } from "react";

import { signOut } from "./firebase/firebaseSetup";
import Camera from "./Camera";
import "./Content.scss";

const Content: FC = () => {
    
    return (
        <div className="content">
            <Camera />
        </div>
    );
}

export default Content;