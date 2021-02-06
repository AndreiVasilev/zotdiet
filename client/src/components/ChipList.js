import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
        minHeight: '48px'
    },
    chip: {
        margin: theme.spacing(0.5),
    },
}));

export default function ChipList(props) {

    const classes = useStyles();
    const {chips, handleDelete} = props;

    function createChips() {
        const items = [];
        for (const chip of chips) {
            items.push(
                <li key={chip}>
                    <Chip
                        label={chip}
                        onDelete={handleDelete(chip)}
                        className={classes.chip}
                    />
                </li>
            );
        }
        return items;
    }

    return (
        <Paper component="ul" className={classes.root}>
            {createChips()}
        </Paper>
    );
}
