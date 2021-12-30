import { Row, Column } from 'carbon-components-react';

const mockData = require('./mock.json');

const EstimateCost = ({ result }) => {
    result = result ? result : mockData;

    return (
        <div className="bx--cost_detail">
        <h2>Cost</h2>
        <div>
            <Row>
                <Column>
                    <span className="bx--col_title">RESOURCE</span>
                </Column>
                <Column>
                    <span className="bx--col_title">LOCAL NAME</span>
                </Column>
                <Column>
                    <span className="bx--col_title">TITLE</span>
                </Column>
                <Column>
                    <span className="bx--col_title">CURRENT COST</span>
                </Column>
                <Column>
                    <span className="bx--col_title">PREVIOUS COST</span>
                </Column> 
                <Column>
                    <span className="bx--col_title">CHANGED COST</span>
                </Column>
            </Row>
            {result?.Lineitem.map((item) => (
                <Row>
                    <Column>
                        <span className="bx--col_info">{item.terraformItemId}</span>
                    </Column>
                    <Column>
                        <span className="bx--col_info">{item.title}</span>
                    </Column>
                    <Column>
                        <span className="bx--col_info">{item.title}</span>
                    </Column>
                    <Column>
                        <span className="bx--col_info">{item.currlineitemtotal}</span>
                    </Column>
                    <Column>
                        <span className="bx--col_info">{item.prevlineitemtotal}</span>
                    </Column> 
                    <Column>
                        <span className="bx--col_info">{item.changelineitemtotal}</span>
                    </Column>
                </Row>
            ))}
        </div>
        </div>
    );
};

export default EstimateCost;