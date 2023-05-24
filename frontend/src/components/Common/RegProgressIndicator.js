import React from "react";
import "../../styles/common/RegProgressIndicator.css";

const RegProgressIndicator = ({currentStep}) => {
    const steps = ['Create Your Account', 'Tell Us About Yourself', 'Customize Your Avatar'];

    return (
        <div className="progress-indicator">
            <div className="step-title">{steps[currentStep - 1]}</div>

            <div className="step-circles">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div  className={`circle ${index < currentStep ? 'filled' : ''}`}>
                            {index + 1}
                        </div>
                        {index < 2 && <div className={`line ${index < currentStep - 1 ? 'filled' : ''}`}></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default RegProgressIndicator;
