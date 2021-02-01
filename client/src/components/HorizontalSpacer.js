function HorizontalSpacer(props) {

    const {color} = props;

    return (
        <div style={{borderTop: `2px solid ${color ? color : '#eff0f1'}`}}/>
    );
}

export default HorizontalSpacer;
