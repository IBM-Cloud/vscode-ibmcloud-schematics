import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
  Tooltip,
} from 'carbon-components-react';

const mockData = require('./mock.json');

const EstimateCost = ({ result }) => {
    result = result ? result : mockData;

    return (
        <div className="bx--cost_detail">
            <h2>Cost Estimate</h2>
            <div>
                <StructuredListWrapper>
                    <StructuredListHead>
                        <StructuredListRow head>
                            <StructuredListCell head>Resource</StructuredListCell>
                            <StructuredListCell head>Local Name</StructuredListCell>
                            <StructuredListCell head>Title</StructuredListCell>
                            <StructuredListCell head>Current Cost</StructuredListCell>
                            <StructuredListCell head>Previous Cost</StructuredListCell>
                            <StructuredListCell head>Changed Cost</StructuredListCell>
                        </StructuredListRow>
                    </StructuredListHead>
                
                    <StructuredListBody>
                        {result?.Lineitem.map((item, index) => (
                        <StructuredListRow key={index}>
                            <StructuredListCell>{item.terraformItemId}</StructuredListCell>
                            <StructuredListCell>{item.id}</StructuredListCell>
                            <StructuredListCell>{item.title}</StructuredListCell>
                            <StructuredListCell>{item.currlineitemtotal.toFixed(2)} {result?.currency}</StructuredListCell>
                            <StructuredListCell>{item.prevlineitemtotal.toFixed(2)} {result?.currency}</StructuredListCell>
                            <StructuredListCell>{item.changelineitemtotal.toFixed(2)} {result?.currency}</StructuredListCell>
                        </StructuredListRow>
                        ))}
                        <StructuredListRow key={result?.Lineitem.length+1}></StructuredListRow>
                        <StructuredListCell head> Total estimated cost </StructuredListCell>
                        <StructuredListCell></StructuredListCell>
                        <StructuredListCell></StructuredListCell>
                        <StructuredListCell></StructuredListCell>
                        <StructuredListCell></StructuredListCell>
                        <StructuredListCell >{`${result?.totalcost.toFixed(2)} ${result?.currency}`} 
                        </StructuredListCell>
                    </StructuredListBody>     
                </StructuredListWrapper>

            </div>
           
        </div>
    );
};

export default EstimateCost;