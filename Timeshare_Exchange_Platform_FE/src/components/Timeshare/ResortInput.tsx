import * as React from 'react';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Autocomplete from '@mui/joy/Autocomplete';
import CircularProgress from '@mui/joy/CircularProgress';
import { GetResort, GetResortById } from '../../services/resort.service';
import Input from '@mui/joy/Input';


function sleep(duration: number): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}

export default function ResortInput(props: any) {
    const [resort, setResort] = React.useState<any>({});
    const [unit, setUnit] = React.useState<any>({});
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<any>([]);
    const loading = open && options.length === 0;
    const resortProp = props?.post?.resortId;
    const unitProp = props?.post?.unitId;

    React.useEffect(() => {
        if(props?.post?.resortId){
            setResort(props?.post?.resortId)
        }
        if(props?.post?.unitId){
            setUnit(props?.post?.unitId)
        }
        let active = true;
        if (!loading) {
            return undefined;
        }
        (async () => {
            //Call API here
            const resortList = await GetResort();
            if (active) {
                setOptions([...resortList]);
            }
        })();
        return () => {
            active = false;
        };
    }, [loading, props?.post?.resortId, props?.post?.unitId, resortProp, unitProp]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    return (
        <>
            <FormLabel>Your resort</FormLabel>
            <input
                type='hidden'
                name='resortId'
                value={resort._id}
            ></input>
            <input
                type='hidden'
                name='unitId'
                value={unit._id}
            ></input>
            <Autocomplete
                noOptionsText='No Options'
                size="sm"
                sx={{ width: 400 }}
                placeholder="Find your resort"
                onChange={async (event, value) => {
                    if (value) {
                        const resort = await GetResortById(value?._id);
                        setResort(resort)
                    }
                }}
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                isOptionEqualToValue={(option: any, value: any) => option?.name === value.name}
                getOptionLabel={(option: any) => option?.name}
                options={options}
                loading={loading}
                value={resortProp}
                endDecorator={
                    loading ? (
                        <CircularProgress size="sm" sx={{ bgcolor: 'background.surface' }} />
                    ) : null
                }
            />
            <FormLabel sx={{ mt: 2 }}>Units</FormLabel>
            <Autocomplete
                size="sm"
                disabled = {!resort.units}
                noOptionsText="No options"
                placeholder="Select unit"
                onChange={async (event, value) => {
                    if (value) {
                        setUnit(value)
                    }
                }}
                value={unitProp}
                options={resort?.units || []}
                loading={loading}
                isOptionEqualToValue={(option: any, value: any) => option?.name === value.name}
                getOptionLabel={(option: any) => option?.name}
            />
        </>

    );
}
