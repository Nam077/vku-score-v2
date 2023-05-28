import React, { FunctionComponent } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import data from '../datas/data.json';
const Tutorial: FunctionComponent = () => {
    return (
        <div>
            <MarkdownPreview
                style={{
                    padding: '0px 100px',
                }}
                warpperElement={{
                    'data-color-mode': 'light',
                }}
                source={data.readme2}
            />
        </div>
    );
};

export default Tutorial;
