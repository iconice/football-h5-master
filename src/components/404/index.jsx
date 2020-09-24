import * as React from 'react';

class NotFound extends React.Component {
    render() {
        const { location } = this.props;
        return (
            <div className="not-found">
                <h1>404</h1>
                <h3>
                    No match for <code>{location.pathname}</code>
                </h3>
            </div>
        );
    }
}

export default NotFound;
