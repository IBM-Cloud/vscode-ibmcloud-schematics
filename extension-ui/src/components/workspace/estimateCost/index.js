const mockData = require('./mock.json');

const EstimateCost = ({ result }) => {
    result = result ? result : mockData;

    return (
        <div>
            totalcost = {result.totalcost}$
        </div>
    );
};

export default EstimateCost;
