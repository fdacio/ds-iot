import React, { Fragment } from "react";
import Icon from 'react-native-vector-icons/FontAwesome';

const IconBulb = (props) => {

    return (
        <Fragment>
            {(props.state) &&
                <Icon name="lightbulb-o" size={100} color="#ffe000" />
            }
            {(!props.state) &&
                <Icon name="lightbulb-o" size={100} color="#c1c1c1" />
            }
        </Fragment>
    )
}

export default IconBulb;