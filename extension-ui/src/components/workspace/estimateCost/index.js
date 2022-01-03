import { Row, Column } from 'carbon-components-react';
import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
} from 'carbon-components-react';
const mockData = require('./mock.json');

const EstimateCost = ({ result }) => {
    result = result ? result : mockData;
    let  totalCost =0
    for (let i =0; i< result?.Lineitem.length;i++) {
      totalCost += parseInt(result.Lineitem[i].changelineitemtotal)
    }
    return (
        <div className="bx--cost_detail">
        <h2>Cost</h2>
        <div>
        <StructuredListWrapper>
            <StructuredListHead>
                <StructuredListRow head>
                    <StructuredListCell head>RESOURCE</StructuredListCell>
                    <StructuredListCell head>LOCAL NAME</StructuredListCell>
                    <StructuredListCell head>TITLE</StructuredListCell>
                    <StructuredListCell head>CURRENT COST</StructuredListCell>
                    <StructuredListCell head>PREVIOUS COST</StructuredListCell>
                    <StructuredListCell head>CHANGED COST</StructuredListCell>
                </StructuredListRow>
            </StructuredListHead>
          
          <StructuredListBody>
            {result?.Lineitem.map((item, index) => (
               <StructuredListRow key={index}>
                  <StructuredListCell>{item.terraformItemId}</StructuredListCell>
                  <StructuredListCell>{item.id}</StructuredListCell>
                  <StructuredListCell>{item.title}</StructuredListCell>
                  <StructuredListCell>{item.currlineitemtotal} {result?.currency}</StructuredListCell>
                  <StructuredListCell>{item.prevlineitemtotal} {result?.currency}</StructuredListCell>
                  <StructuredListCell>{item.changelineitemtotal} {result?.currency}</StructuredListCell>
               </StructuredListRow>
            ))}
             <StructuredListRow key={result?.Lineitem.length+1}></StructuredListRow>
             <StructuredListCell> TOTAL COST</StructuredListCell>
             <StructuredListCell></StructuredListCell>
             <StructuredListCell></StructuredListCell>
             <StructuredListCell></StructuredListCell>
             <StructuredListCell></StructuredListCell>
             <StructuredListCell>{totalCost} {result?.currency}</StructuredListCell>
          </StructuredListBody>     
      </StructuredListWrapper>
            </div>
            </div>
    );
};

export default EstimateCost;