import { css } from "@emotion/react";
import { PulseLoader } from "react-spinners";
import '../../styles/Modal/Spinner.css';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export const Spinner = () => {
    return (
        <div className="spinner-container">
            <PulseLoader color={"#007bff"} css={override} size={15} />
        </div>
    );
};
