import React from 'react';
import { Card, CardContent, Typography } from "@material-ui/core";
import './InfoBox.css';

function InfoBox({ title, cases, total, isRed, active, ...props }) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && "infobox--selected"} ${isRed && "infoBox--isRed"}`}>
            <CardContent>
                <Typography className='infoBox_title' color='textSecondary'>{title}</Typography>
                
                <h2 className={`infoBox_cases ${!isRed && "infoBox_cases--green"}`}>{cases}</h2>
                
                <Typography className='infoBox_total' color='textSecondary'>{total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
