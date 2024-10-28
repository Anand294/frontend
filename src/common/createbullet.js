
import React from "react";
const createBulletPoints = (text) => {
    return (
        <>
            {text.split('\n').map((line, index) => {
                const trimmedLine = line.trim();
                return trimmedLine ? (
                    <React.Fragment key={index}>
                        {trimmedLine}
                        <br /><br></br>
                    </React.Fragment>
                ) : null;
            })}
        </>
    );
};

export { createBulletPoints };
