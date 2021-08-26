import Moment from 'react-moment';
import { Row, Column, CodeSnippet } from 'carbon-components-react';

const mockData = require('./mock.json');

const WorkspaceDetail = ({ result }) => {
    result = result ? result : mockData;

    return (
        <div className="bx--workspace_detail">
            <h3>Details</h3>
            <div>
                <Row>
                    <Column lg={3}>
                        <span className="bx--col_title">Name</span>
                        <span className="bx--col_info">{result.name}</span>
                    </Column>
                    <Column lg={3}>
                        <span className="bx--col_title">Workspace ID</span>
                        <span className="bx--col_info">
                            <CodeSnippet type="single">{result.id}</CodeSnippet>
                        </span>
                    </Column>
                    <Column lg={3}>
                        <span className="bx--col_title">State</span>
                        <span className="bx--col_info">
                            {result.workspace_status.frozen
                                ? 'Frozen'
                                : 'Unfrozen'}
                        </span>
                    </Column>
                    <Column lg={3}>
                        <span className="bx--col_title">Version</span>
                        <span className="bx--col_info">{result.type[0]}</span>
                    </Column>
                </Row>
                <Row>
                    <Column lg={3}>
                        <span className="bx--col_title">Location</span>
                        <span className="bx--col_info">{result.location}</span>
                    </Column>
                    <Column lg={3}>
                        <span className="bx--col_title">Resource group</span>
                        <span className="bx--col_info">
                            {result.resource_group}
                        </span>
                    </Column>
                    <Column lg={3}>
                        <span className="bx--col_title">Created by</span>
                        <span className="bx--col_info">
                            {result.created_by}
                        </span>
                    </Column>
                    <Column lg={3}>
                        <span className="bx--col_title">Date created</span>
                        <span className="bx--col_info">
                            <Moment format="YYYY/MM/DD, hh:mm A">
                                {result.created_at}
                            </Moment>
                        </span>
                    </Column>
                </Row>
            </div>
        </div>
    );
};

export default WorkspaceDetail;
