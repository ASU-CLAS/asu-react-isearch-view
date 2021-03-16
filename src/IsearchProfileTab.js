import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';

const isearchProfileTab = (props) => {

    const [activeTab, setActiveTab] = useState(0);

    const toggle = tab => {
        if(activeTab !== tab) setActiveTab(tab);
    }

    return (
        <div>
            <Nav tabs>
                {(props.tabs).map((item, index) => {
                    return (
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeTab === index })}
                                onClick={() => { toggle( index ); }}
                            >
                                { item[0] }
                            </NavLink>
                        </NavItem>
                    )
                })}
            </Nav>
            <TabContent activeTab={activeTab}>
                {(props.tabs).map((item, index) => {
                    return (
                        <TabPane tabId={index} className={index++}>
                            <Row>
                                <Col sm="12">
                                    <div className="tabContentArea" dangerouslySetInnerHTML={{
                                        __html: item[1]
                                    }}>
                                    </div>
                                </Col>
                            </Row>
                        </TabPane>
                    )
                })}
            </TabContent>
        </div>
    );
}

export default isearchProfileTab;