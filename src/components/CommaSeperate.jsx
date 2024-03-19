import React from 'react'

const CommaSeperate = ({ elements }) => {
    const commaSeparated = elements.join(', ');
    return <>{commaSeparated}</>;
}

export default CommaSeperate